"""Pydantic request/response models (raw features only; no extras on requests)."""

from __future__ import annotations

import math
from typing import Any, Union

from pydantic import BaseModel, ConfigDict, Field, RootModel, ValidationInfo, field_validator, model_validator


def _finite_float(name: str, v: float) -> float:
    if not isinstance(v, (int, float)) or isinstance(v, bool):
        raise TypeError(f"{name} must be a number")
    fv = float(v)
    if not math.isfinite(fv):
        raise ValueError(f"{name} must be a finite number")
    return fv


class SinglePredictionRequest(BaseModel):
    """One row of raw features (no engineered columns)."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    Soil_pH: float
    Soil_Moisture: float
    Organic_Carbon: float
    Electrical_Conductivity: float
    Temperature_C: float
    Humidity: float
    Rainfall_mm: float
    Sunlight_Hours: float
    Wind_Speed_kmh: float
    Field_Area_hectare: float
    Previous_Irrigation_mm: float
    Soil_Type: str = Field(..., min_length=1)
    Crop_Type: str = Field(..., min_length=1)
    Crop_Growth_Stage: str = Field(..., min_length=1)
    Season: str = Field(..., min_length=1)
    Irrigation_Type: str = Field(..., min_length=1)
    Water_Source: str = Field(..., min_length=1)
    Mulching_Used: str = Field(..., min_length=1)
    Region: str = Field(..., min_length=1)

    @field_validator(
        "Soil_pH",
        "Soil_Moisture",
        "Organic_Carbon",
        "Electrical_Conductivity",
        "Temperature_C",
        "Humidity",
        "Rainfall_mm",
        "Sunlight_Hours",
        "Wind_Speed_kmh",
        "Field_Area_hectare",
        "Previous_Irrigation_mm",
        mode="before",
    )
    @classmethod
    def _validate_numeric(cls, v: Any, info: ValidationInfo) -> float:
        return _finite_float(info.field_name, v)

    @field_validator(
        "Soil_Type",
        "Crop_Type",
        "Crop_Growth_Stage",
        "Season",
        "Irrigation_Type",
        "Water_Source",
        "Mulching_Used",
        "Region",
        mode="before",
    )
    @classmethod
    def _strip_categorical(cls, v: Any) -> str:
        if not isinstance(v, str):
            raise TypeError("Categorical features must be strings")
        s = v.strip()
        if not s:
            raise ValueError("Categorical features must be non-empty")
        return s

    @model_validator(mode="after")
    def _non_negative_physical(self) -> SinglePredictionRequest:
        for name in (
            "Humidity",
            "Rainfall_mm",
            "Sunlight_Hours",
            "Wind_Speed_kmh",
            "Field_Area_hectare",
            "Previous_Irrigation_mm",
        ):
            if getattr(self, name) < 0:
                raise ValueError(f"{name} must be >= 0")
        return self


class BatchPredictionRequest(RootModel[list[SinglePredictionRequest]]):
    """JSON array of records (same shape as a top-level list body for POST /predict)."""


class PredictionItem(BaseModel):
    label: str
    probabilities: dict[str, float] | None = None


class PredictionResponse(BaseModel):
    predictions: list[PredictionItem]


# FastAPI body: one object or a JSON array (Spring / REST clients).
PredictRequestBody = Union[SinglePredictionRequest, list[SinglePredictionRequest]]
