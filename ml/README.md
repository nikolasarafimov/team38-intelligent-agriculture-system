# POST `/predict` request body

**Body:** one JSON object, **or** a JSON array of objects with the same keys (one object per prediction). Content type: `application/json`.

## Columns and types

| Column | Type |
| --- | --- |
| `Soil_pH` | `float` |
| `Soil_Moisture` | `float` |
| `Organic_Carbon` | `float` |
| `Electrical_Conductivity` | `float` |
| `Temperature_C` | `float` |
| `Humidity` | `float` |
| `Rainfall_mm` | `float` |
| `Sunlight_Hours` | `float` |
| `Wind_Speed_kmh` | `float` |
| `Field_Area_hectare` | `float` |
| `Previous_Irrigation_mm` | `float` |
| `Soil_Type` | `string` |
| `Crop_Type` | `string` |
| `Crop_Growth_Stage` | `string` |
| `Season` | `string` |
| `Irrigation_Type` | `string` |
| `Water_Source` | `string` |
| `Mulching_Used` | `string` |
| `Region` | `string` |

Numeric fields must be finite numbers (integers are accepted). `Humidity`, `Rainfall_mm`, `Sunlight_Hours`, `Wind_Speed_kmh`, `Field_Area_hectare`, and `Previous_Irrigation_mm` must be ≥ 0. String fields must be non-empty after trimming. Unknown keys on each object are rejected.
