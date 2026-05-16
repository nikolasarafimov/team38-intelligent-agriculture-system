import { useState } from "react";
import { apiRequest } from "../api";

const initialFormData = {
    Soil_pH: "6.8",
    Soil_Moisture: "32",
    Organic_Carbon: "1.7",
    Electrical_Conductivity: "0.8",
    Temperature_C: "32",
    Humidity: "35",
    Rainfall_mm: "2",
    Sunlight_Hours: "8",
    Wind_Speed_kmh: "12",
    Field_Area_hectare: "1.5",
    Previous_Irrigation_mm: "5",
    Soil_Type: "Loamy",
    Crop_Type: "Tomato",
    Crop_Growth_Stage: "Vegetative",
    Season: "Summer",
    Irrigation_Type: "Drip",
    Water_Source: "Canal",
    Mulching_Used: "Yes",
    Region: "Skopje",
};

const numericFields = [
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
];

function RecommendationValue({ label, value }) {
    return (
        <div>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

export default function RecommendationsPage() {
    const [formData, setFormData] = useState(initialFormData);
    const [recommendation, setRecommendation] = useState(null);

    const [status, setStatus] = useState({
        loading: false,
        message: "",
        type: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const buildPayload = () => {
        const payload = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (numericFields.includes(key)) {
                payload[key] = Number(value);
            } else {
                payload[key] = value;
            }
        });

        return payload;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setStatus({
            loading: true,
            message: "Generating AI-supported recommendation...",
            type: "info",
        });

        setRecommendation(null);

        try {
            const response = await apiRequest("/api/recommendations", {
                method: "POST",
                body: JSON.stringify(buildPayload()),
            });

            setRecommendation(response);

            setStatus({
                loading: false,
                message: response.mlServiceAvailable
                    ? "ML recommendation generated successfully."
                    : "Fallback recommendation generated. ML service response was not available.",
                type: response.mlServiceAvailable ? "success" : "info",
            });
        } catch (error) {
            setStatus({
                loading: false,
                message:
                    error.message ||
                    "Could not generate recommendation. Make sure backend and ML service are running.",
                type: "error",
            });
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setRecommendation(null);
        setStatus({
            loading: false,
            message: "",
            type: "",
        });
    };

    const predictionLabel =
        recommendation?.predictionLabel ||
        recommendation?.predictions?.[0]?.label ||
        recommendation?.prediction ||
        recommendation?.result ||
        "-";

    const probabilities =
        recommendation?.probabilities ||
        recommendation?.predictions?.[0]?.probabilities ||
        null;

    return (
        <main className="page-shell">
            <section className="page-header-card">
                <span className="section-label">AI / ML Module</span>
                <h1>AI-Supported Irrigation Recommendations</h1>
                <p>
                    This page sends agricultural, soil and weather-related features to
                    the Spring Boot backend. The backend forwards the correctly formatted
                    request to the FastAPI ML service and returns an irrigation
                    recommendation.
                </p>
            </section>

            <section className="form-layout">
                <form className="data-form" onSubmit={handleSubmit}>
                    <h2>Soil and Field Conditions</h2>

                    <div className="form-field">
                        <label htmlFor="Soil_pH">Soil pH</label>
                        <input
                            id="Soil_pH"
                            name="Soil_pH"
                            type="number"
                            step="0.1"
                            value={formData.Soil_pH}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Soil_Moisture">Soil Moisture</label>
                        <input
                            id="Soil_Moisture"
                            name="Soil_Moisture"
                            type="number"
                            step="0.1"
                            value={formData.Soil_Moisture}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Organic_Carbon">Organic Carbon</label>
                        <input
                            id="Organic_Carbon"
                            name="Organic_Carbon"
                            type="number"
                            step="0.1"
                            value={formData.Organic_Carbon}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Electrical_Conductivity">Electrical Conductivity</label>
                        <input
                            id="Electrical_Conductivity"
                            name="Electrical_Conductivity"
                            type="number"
                            step="0.1"
                            value={formData.Electrical_Conductivity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Field_Area_hectare">Field Area hectare</label>
                        <input
                            id="Field_Area_hectare"
                            name="Field_Area_hectare"
                            type="number"
                            step="0.1"
                            value={formData.Field_Area_hectare}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <h2>Weather Conditions</h2>

                    <div className="form-field">
                        <label htmlFor="Temperature_C">Temperature °C</label>
                        <input
                            id="Temperature_C"
                            name="Temperature_C"
                            type="number"
                            step="0.1"
                            value={formData.Temperature_C}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Humidity">Humidity %</label>
                        <input
                            id="Humidity"
                            name="Humidity"
                            type="number"
                            step="0.1"
                            value={formData.Humidity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Rainfall_mm">Rainfall mm</label>
                        <input
                            id="Rainfall_mm"
                            name="Rainfall_mm"
                            type="number"
                            step="0.1"
                            value={formData.Rainfall_mm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Sunlight_Hours">Sunlight Hours</label>
                        <input
                            id="Sunlight_Hours"
                            name="Sunlight_Hours"
                            type="number"
                            step="0.1"
                            value={formData.Sunlight_Hours}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Wind_Speed_kmh">Wind Speed km/h</label>
                        <input
                            id="Wind_Speed_kmh"
                            name="Wind_Speed_kmh"
                            type="number"
                            step="0.1"
                            value={formData.Wind_Speed_kmh}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="Previous_Irrigation_mm">Previous Irrigation mm</label>
                        <input
                            id="Previous_Irrigation_mm"
                            name="Previous_Irrigation_mm"
                            type="number"
                            step="0.1"
                            value={formData.Previous_Irrigation_mm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <h2>Agricultural Categories</h2>

                    <div className="form-field">
                        <label htmlFor="Soil_Type">Soil Type</label>
                        <select
                            id="Soil_Type"
                            name="Soil_Type"
                            value={formData.Soil_Type}
                            onChange={handleChange}
                            required
                        >
                            <option value="Loamy">Loamy</option>
                            <option value="Clay">Clay</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Silty">Silty</option>
                            <option value="Peaty">Peaty</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Crop_Type">Crop Type</label>
                        <select
                            id="Crop_Type"
                            name="Crop_Type"
                            value={formData.Crop_Type}
                            onChange={handleChange}
                            required
                        >
                            <option value="Tomato">Tomato</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Rice">Rice</option>
                            <option value="Corn">Corn</option>
                            <option value="Potato">Potato</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Crop_Growth_Stage">Crop Growth Stage</label>
                        <select
                            id="Crop_Growth_Stage"
                            name="Crop_Growth_Stage"
                            value={formData.Crop_Growth_Stage}
                            onChange={handleChange}
                            required
                        >
                            <option value="Initial">Initial</option>
                            <option value="Vegetative">Vegetative</option>
                            <option value="Flowering">Flowering</option>
                            <option value="Maturity">Maturity</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Season">Season</label>
                        <select
                            id="Season"
                            name="Season"
                            value={formData.Season}
                            onChange={handleChange}
                            required
                        >
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Autumn">Autumn</option>
                            <option value="Winter">Winter</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Irrigation_Type">Irrigation Type</label>
                        <select
                            id="Irrigation_Type"
                            name="Irrigation_Type"
                            value={formData.Irrigation_Type}
                            onChange={handleChange}
                            required
                        >
                            <option value="Drip">Drip</option>
                            <option value="Sprinkler">Sprinkler</option>
                            <option value="Flood">Flood</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Water_Source">Water Source</label>
                        <select
                            id="Water_Source"
                            name="Water_Source"
                            value={formData.Water_Source}
                            onChange={handleChange}
                            required
                        >
                            <option value="Canal">Canal</option>
                            <option value="Well">Well</option>
                            <option value="River">River</option>
                            <option value="Rainwater">Rainwater</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Mulching_Used">Mulching Used</label>
                        <select
                            id="Mulching_Used"
                            name="Mulching_Used"
                            value={formData.Mulching_Used}
                            onChange={handleChange}
                            required
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Region">Region</label>
                        <select
                            id="Region"
                            name="Region"
                            value={formData.Region}
                            onChange={handleChange}
                            required
                        >
                            <option value="Skopje">Skopje</option>
                            <option value="Bitola">Bitola</option>
                            <option value="Ohrid">Ohrid</option>
                            <option value="Strumica">Strumica</option>
                            <option value="Tetovo">Tetovo</option>
                        </select>
                    </div>

                    <div className="form-actions-row">
                        <button className="submit-button" type="submit" disabled={status.loading}>
                            {status.loading ? "Generating..." : "Generate ML Recommendation"}
                        </button>

                        <button className="secondary-action" type="button" onClick={resetForm}>
                            Reset
                        </button>
                    </div>

                    {status.message && (
                        <div className={`form-alert ${status.type}`}>
                            {status.message}
                        </div>
                    )}
                </form>

                <aside className="preview-panel">
                    <h2>Recommendation Result</h2>

                    {!recommendation ? (
                        <p>
                            Fill in the agricultural, soil and weather conditions and
                            generate an ML-supported irrigation recommendation.
                        </p>
                    ) : (
                        <div className="recommendation-result">
                            <div className="recommendation-highlight">
                                <span>Recommendation</span>
                                <strong>
                                    {recommendation.recommendation ||
                                        "Recommendation generated."}
                                </strong>
                            </div>

                            <div className="preview-list">
                                <RecommendationValue
                                    label="Prediction Label"
                                    value={predictionLabel}
                                />

                                <RecommendationValue
                                    label="Source"
                                    value={recommendation.source || "ML service"}
                                />

                                <RecommendationValue
                                    label="ML Service Available"
                                    value={
                                        recommendation.mlServiceAvailable === false
                                            ? "No, fallback used"
                                            : "Yes"
                                    }
                                />
                            </div>

                            {probabilities && (
                                <div className="probabilities-box">
                                    <h3>Prediction Probabilities</h3>

                                    {Object.entries(probabilities).map(([key, value]) => (
                                        <div key={key} className="probability-row">
                                            <span>{key}</span>
                                            <strong>{Number(value).toFixed(3)}</strong>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <details className="raw-response-details">
                                <summary>View raw backend response</summary>
                                <pre>{JSON.stringify(recommendation, null, 2)}</pre>
                            </details>
                        </div>
                    )}
                </aside>
            </section>
        </main>
    );
}