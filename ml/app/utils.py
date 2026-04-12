"""Training schema column order and DataFrame helpers."""

from __future__ import annotations

from typing import Any, Iterable, Mapping, Sequence

import pandas as pd

# Exact order expected by the trained preprocessor (numeric + engineered, then categorical).
TRAINING_FEATURE_COLUMNS: tuple[str, ...] = (
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
    "Moisture_Deficit",
    "Water_Availability",
    "ET_Proxy",
    "Irrigation_per_Hectare",
    "Soil_Type",
    "Crop_Type",
    "Crop_Growth_Stage",
    "Season",
    "Irrigation_Type",
    "Water_Source",
    "Mulching_Used",
    "Region",
)

_ENGINEERED_NAMES = frozenset(
    {"Moisture_Deficit", "Water_Availability", "ET_Proxy", "Irrigation_per_Hectare"}
)
RAW_FEATURE_COLUMNS: tuple[str, ...] = tuple(
    c for c in TRAINING_FEATURE_COLUMNS if c not in _ENGINEERED_NAMES
)


def records_to_raw_dataframe(records: Sequence[Mapping[str, Any]]) -> pd.DataFrame:
    """Build a DataFrame from validated dicts; preserves batch row order."""
    if not records:
        return pd.DataFrame(columns=list(RAW_FEATURE_COLUMNS))
    return pd.DataFrame(list(records))


def reorder_features(df: pd.DataFrame) -> pd.DataFrame:
    """Reorder columns to the 23-feature training schema; drop extras."""
    missing = set(TRAINING_FEATURE_COLUMNS) - set(df.columns)
    if missing:
        raise ValueError(f"Missing feature columns after engineering: {sorted(missing)}")
    extra = set(df.columns) - set(TRAINING_FEATURE_COLUMNS)
    if extra:
        df = df.drop(columns=list(extra))
    return df.loc[:, list(TRAINING_FEATURE_COLUMNS)]


def summarize_batch_for_log(n_rows: int, keys: Iterable[str]) -> dict[str, Any]:
    return {"batch_size": n_rows, "feature_keys": sorted(keys)}
