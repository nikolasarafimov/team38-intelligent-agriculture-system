"""Load model artifacts once at startup (global singleton)."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from sklearn.pipeline import Pipeline

logger = logging.getLogger(__name__)

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent / "trained_model_objects"
MODEL_PATH = ARTIFACTS_DIR / "model.pkl"
MODEL_FALLBACK_PATH = ARTIFACTS_DIR / "irrigation_model.pkl"
PREPROCESSOR_PATH = ARTIFACTS_DIR / "preprocessor.pkl"
LABEL_ENCODER_PATH = ARTIFACTS_DIR / "label_encoder.pkl"
THRESHOLD_PATH = ARTIFACTS_DIR / "healthy_soil_moisture_threshold.pkl"


@dataclass(frozen=True)
class Artifacts:
    model: Any
    preprocessor: Any
    label_encoder: Any
    healthy_soil_moisture_threshold: float


_artifacts: Artifacts | None = None


def _coerce_threshold(obj: Any) -> float:
    if isinstance(obj, dict):
        for key in ("healthy_soil_moisture_threshold", "moisture_threshold"):
            if key in obj and obj[key] is not None:
                return float(np.asarray(obj[key]).item())
        raise ValueError(
            "healthy_soil_moisture_threshold.pkl dict must contain key "
            "'healthy_soil_moisture_threshold' or 'moisture_threshold'"
        )
    return float(np.asarray(obj).item())


def _resolve_model_path() -> Path:
    if MODEL_PATH.is_file():
        return MODEL_PATH
    if MODEL_FALLBACK_PATH.is_file():
        return MODEL_FALLBACK_PATH
    raise FileNotFoundError(
        f"Missing classifier artifact: expected {MODEL_PATH.name} or {MODEL_FALLBACK_PATH.name} under {ARTIFACTS_DIR}"
    )


def _load_classifier(model_path: Path) -> Any:
    raw: Any = joblib.load(model_path)
    if isinstance(raw, Pipeline) and "model" in raw.named_steps:
        logger.info("Using named step 'model' from Pipeline loaded from %s", model_path.name)
        return raw.named_steps["model"]
    return raw


def load_artifacts_into_memory() -> Artifacts:
    """Load all pickles from ``trained_model_objects/`` and store as a process-wide singleton."""
    global _artifacts
    model_path = _resolve_model_path()
    for p, name in (
        (PREPROCESSOR_PATH, "preprocessor.pkl"),
        (LABEL_ENCODER_PATH, "label_encoder.pkl"),
        (THRESHOLD_PATH, "healthy_soil_moisture_threshold.pkl"),
    ):
        if not p.is_file():
            raise FileNotFoundError(f"Missing required artifact: {name} at {p}")

    model = _load_classifier(model_path)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    label_encoder = joblib.load(LABEL_ENCODER_PATH)
    threshold_raw = joblib.load(THRESHOLD_PATH)
    threshold = _coerce_threshold(threshold_raw)

    loaded = Artifacts(
        model=model,
        preprocessor=preprocessor,
        label_encoder=label_encoder,
        healthy_soil_moisture_threshold=threshold,
    )
    _artifacts = loaded
    logger.info(
        "Loaded ML artifacts from %s (healthy_soil_moisture_threshold=%s)",
        ARTIFACTS_DIR,
        threshold,
    )
    return loaded


def get_artifacts() -> Artifacts:
    if _artifacts is None:
        raise RuntimeError("Artifacts not loaded; application lifespan did not run")
    return _artifacts
