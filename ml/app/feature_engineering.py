"""Vectorized engineered features (computed before preprocessor.transform)."""

from __future__ import annotations

import numpy as np
import pandas as pd

_ENGINEERED_COLS = (
    "Moisture_Deficit",
    "Water_Availability",
    "ET_Proxy",
    "Irrigation_per_Hectare",
)


def add_engineered_features(
    df: pd.DataFrame,
    healthy_soil_moisture_threshold: float,
) -> pd.DataFrame:
    """
    Compute engineered columns from raw features (vectorized, no row loops).

    - Moisture_Deficit = threshold - Soil_Moisture
    - Water_Availability = Rainfall_mm + Previous_Irrigation_mm
    - ET_Proxy = (Temperature_C * Wind_Speed_kmh) / Humidity; Humidity == 0 → 0
    - Irrigation_per_Hectare = Previous_Irrigation_mm / Field_Area_hectare; area == 0 → 0
    """
    out = df.copy()
    out["Moisture_Deficit"] = healthy_soil_moisture_threshold - out["Soil_Moisture"]
    out["Water_Availability"] = out["Rainfall_mm"] + out["Previous_Irrigation_mm"]

    hum = np.asarray(out["Humidity"], dtype=float)
    t = np.asarray(out["Temperature_C"], dtype=float)
    w = np.asarray(out["Wind_Speed_kmh"], dtype=float)
    out["ET_Proxy"] = np.where(hum == 0.0, 0.0, (t * w) / hum)

    fa = np.asarray(out["Field_Area_hectare"], dtype=float)
    prev = np.asarray(out["Previous_Irrigation_mm"], dtype=float)
    out["Irrigation_per_Hectare"] = np.where(fa == 0.0, 0.0, prev / fa)

    for col in _ENGINEERED_COLS:
        out[col] = out[col].replace([np.inf, -np.inf], np.nan).fillna(0.0)
    return out
