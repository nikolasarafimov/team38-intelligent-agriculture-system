"""FastAPI entrypoint for irrigation need classification."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any

import numpy as np
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.feature_engineering import add_engineered_features
from app.model_loader import Artifacts, get_artifacts, load_artifacts_into_memory
from app.schemas import (
    PredictionItem,
    PredictionResponse,
    PredictRequestBody,
    SinglePredictionRequest,
)
from app.utils import records_to_raw_dataframe, reorder_features, summarize_batch_for_log

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    load_artifacts_into_memory()
    yield


app = FastAPI(title="Irrigation prediction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def request_validation_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    logger.warning("Request validation failed: %s", exc.errors())
    return JSONResponse(status_code=400, content={"detail": exc.errors()})


@app.exception_handler(ValidationError)
async def pydantic_validation_handler(_request: Request, exc: ValidationError) -> JSONResponse:
    logger.warning("Validation error: %s", exc.errors())
    return JSONResponse(status_code=400, content={"detail": exc.errors()})


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _normalize_to_batch(body: PredictRequestBody) -> list[dict[str, Any]]:
    if isinstance(body, SinglePredictionRequest):
        return [body.model_dump()]
    if not body:
        raise HTTPException(
            status_code=400,
            detail={"message": "Batch must contain at least one record"},
        )
    return [row.model_dump() for row in body]


def _class_names_for_proba(model: Any, label_encoder: Any, n_cols: int) -> list[str]:
    model_classes = getattr(model, "classes_", None)
    if model_classes is not None and len(model_classes) == n_cols:
        mc = np.asarray(model_classes).ravel()
        if mc.dtype.kind in "iu" or np.issubdtype(mc.dtype, np.integer):
            decoded = label_encoder.inverse_transform(mc.astype(int, copy=False))
            return [str(x) for x in decoded]
        return [str(x) for x in mc]
    le_classes = getattr(label_encoder, "classes_", None)
    if le_classes is not None and len(le_classes) == n_cols:
        return [str(x) for x in le_classes]
    raise ValueError("Cannot align predict_proba columns with class names")


def _build_probability_maps(model: Any, label_encoder: Any, proba: np.ndarray) -> list[dict[str, float]]:
    names = _class_names_for_proba(model, label_encoder, proba.shape[1])
    return [{names[j]: float(row[j]) for j in range(len(names))} for row in proba]


def _predict_batch(artifacts: Artifacts, rows: list[dict[str, Any]]) -> list[PredictionItem]:
    df_raw = records_to_raw_dataframe(rows)
    df_eng = add_engineered_features(df_raw, artifacts.healthy_soil_moisture_threshold)
    df_x = reorder_features(df_eng)

    try:
        x_transformed = artifacts.preprocessor.transform(df_x)
    except Exception as exc:
        logger.exception("Preprocessor transform failed")
        raise HTTPException(
            status_code=400,
            detail={"message": "Preprocessing failed", "error": str(exc)},
        ) from exc

    try:
        y_pred = artifacts.model.predict(x_transformed)
    except Exception as exc:
        logger.exception("Model predict failed")
        raise HTTPException(
            status_code=500,
            detail={"message": "Prediction failed", "error": str(exc)},
        ) from exc

    y_flat = np.asarray(y_pred).ravel()
    if y_flat.dtype.kind in "iu" or np.issubdtype(y_flat.dtype, np.integer):
        labels = artifacts.label_encoder.inverse_transform(y_flat.astype(int, copy=False))
        labels_str = [str(lab) for lab in labels]
    else:
        labels_str = [str(lab) for lab in y_flat]

    use_proba = hasattr(artifacts.model, "predict_proba")
    prob_maps: list[dict[str, float] | None]
    if use_proba:
        try:
            proba = np.asarray(artifacts.model.predict_proba(x_transformed), dtype=float)
            prob_maps = _build_probability_maps(
                artifacts.model, artifacts.label_encoder, proba
            )
        except Exception as exc:
            logger.warning("predict_proba failed, returning labels only: %s", exc)
            prob_maps = [None] * len(labels_str)
    else:
        prob_maps = [None] * len(labels_str)

    return [
        PredictionItem(label=labels_str[i], probabilities=prob_maps[i])
        for i in range(len(labels_str))
    ]


@app.post("/predict", response_model=PredictionResponse, response_model_exclude_none=True)
def predict(body: PredictRequestBody) -> PredictionResponse:
    artifacts = get_artifacts()
    rows = _normalize_to_batch(body)
    logger.info(
        "POST /predict request received: %s",
        summarize_batch_for_log(len(rows), rows[0].keys() if rows else []),
    )
    predictions = _predict_batch(artifacts, rows)
    logger.info("Prediction succeeded batch_size=%s", len(predictions))
    return PredictionResponse(predictions=predictions)
