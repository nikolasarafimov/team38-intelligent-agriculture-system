import { useState } from "react";
import { ML_API_BASE_URL } from "../api";

const defaultForm = {
    Crop_Type: "Wheat",
    Soil_Type: "Loamy",
    Soil_Moisture: 35,
    Soil_pH: 6.5,
    Organic_Carbon: 1.8,
    Electrical_Conductivity: 0.7,
    Temperature_C: 27,
    Humidity: 55,
    Rainfall_mm: 3,
    Sunlight_Hours: 8,
    Wind_Speed_kmh: 10,
    Field_Area_hectare: 1.5,
    Previous_Irrigation_mm: 5,
    Crop_Growth_Stage: "Vegetative",
    Season: "Summer",
    Irrigation_Type: "Drip",
    Water_Source: "Groundwater",
    Mulching_Used: "Yes",
    Region: "Central",
};

function buildFallbackRecommendation(data) {
    const recommendations = [];

    if (Number(data.Soil_Moisture) < 35) {
        recommendations.push({
            title: "High irrigation priority",
            text: "Soil moisture is low. Irrigation should be scheduled soon to prevent crop stress.",
            level: "High",
        });
    } else if (Number(data.Soil_Moisture) < 55 && Number(data.Temperature_C) > 25) {
        recommendations.push({
            title: "Moderate irrigation recommended",
            text: "Moisture is acceptable but temperature is elevated. A moderate irrigation cycle is recommended.",
            level: "Medium",
        });
    } else {
        recommendations.push({
            title: "Irrigation not urgent",
            text: "Current soil and weather conditions do not indicate urgent irrigation need.",
            level: "Low",
        });
    }

    if (Number(data.Soil_pH) < 5.8) {
        recommendations.push({
            title: "Soil acidity warning",
            text: "The soil pH is relatively low. Consider soil correction practices depending on crop requirements.",
            level: "Medium",
        });
    }

    if (Number(data.Rainfall_mm) > 15) {
        recommendations.push({
            title: "Rainfall detected",
            text: "Rainfall is sufficient. Delay additional irrigation and monitor field moisture before action.",
            level: "Low",
        });
    }

    if (Number(data.Temperature_C) > 32) {
        recommendations.push({
            title: "Heat stress risk",
            text: "High temperature may increase crop stress. Monitor the field and avoid irrigation during peak heat.",
            level: "High",
        });
    }

    return recommendations;
}

function mapPredictionToRecommendation(prediction) {
    const label = prediction?.label || "Unknown";
    const probabilities = prediction?.probabilities || {};

    let level = "Medium";
    let title = "ML irrigation prediction";
    let text = `The ML model predicted irrigation need as: ${label}.`;

    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes("high")) {
        level = "High";
        title = "High irrigation need predicted";
        text = "The ML model predicts a high irrigation need. Irrigation should be prioritized for this field.";
    } else if (lowerLabel.includes("low")) {
        level = "Low";
        title = "Low irrigation need predicted";
        text = "The ML model predicts low irrigation need. Irrigation can be delayed while monitoring field conditions.";
    } else if (lowerLabel.includes("medium") || lowerLabel.includes("moderate")) {
        level = "Medium";
        title = "Moderate irrigation need predicted";
        text = "The ML model predicts moderate irrigation need. A controlled irrigation cycle may be appropriate.";
    }

    const probabilityText = Object.keys(probabilities).length
        ? ` Model confidence values: ${Object.entries(probabilities)
            .map(([key, value]) => `${key}: ${(value * 100).toFixed(1)}%`)
            .join(", ")}.`
        : "";

    return [
        {
            title,
            text: text + probabilityText,
            level,
        },
    ];
}

export default function Recommendations() {
    const [formData, setFormData] = useState(defaultForm);
    const [recommendations, setRecommendations] = useState(
        buildFallbackRecommendation(defaultForm)
    );
    const [status, setStatus] = useState({
        loading: false,
        message: "Rule-based recommendation is shown by default. Use the button to call the ML service.",
        type: "info",
    });

    const handleChange = (event) => {
        const { name, value, type } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleRuleBasedRecommendation = () => {
        setRecommendations(buildFallbackRecommendation(formData));
        setStatus({
            loading: false,
            message: "Generated rule-based recommendation.",
            type: "success",
        });
    };

    const handleMlPrediction = async () => {
        setStatus({
            loading: true,
            message: "Calling FastAPI ML prediction service...",
            type: "info",
        });

        try {
            const response = await fetch(`${ML_API_BASE_URL}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("ML prediction request failed.");
            }

            const data = await response.json();
            const prediction = data.predictions?.[0];

            setRecommendations(mapPredictionToRecommendation(prediction));
            setStatus({
                loading: false,
                message: "ML prediction completed successfully.",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setRecommendations(buildFallbackRecommendation(formData));
            setStatus({
                loading: false,
                message:
                    "Could not reach the ML service. Showing rule-based fallback recommendation instead.",
                type: "error",
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleMlPrediction();
    };

    return (
        <div className="recommendations-page">
            <section className="card">
                <h2>Agricultural Recommendations</h2>
                <p>
                    This page demonstrates the intelligent recommendation part of the system.
                    It can call the FastAPI ML prediction service and also provides a rule-based
                    fallback when the ML service is not running.
                </p>
            </section>

            <section className="recommendation-layout">
                <form className="data-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="Crop_Type">Crop type</label>
                        <select
                            id="Crop_Type"
                            name="Crop_Type"
                            value={formData.Crop_Type}
                            onChange={handleChange}
                        >
                            <option>Wheat</option>
                            <option>Corn</option>
                            <option>Rice</option>
                            <option>Tomato</option>
                            <option>Potato</option>
                            <option>Soybean</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="Soil_Type">Soil type</label>
                        <select
                            id="Soil_Type"
                            name="Soil_Type"
                            value={formData.Soil_Type}
                            onChange={handleChange}
                        >
                            <option>Loamy</option>
                            <option>Clay</option>
                            <option>Sandy</option>
                            <option>Silty</option>
                            <option>Peaty</option>
                        </select>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="Soil_Moisture">Soil moisture (%)</label>
                            <input
                                id="Soil_Moisture"
                                name="Soil_Moisture"
                                type="number"
                                value={formData.Soil_Moisture}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="Soil_pH">Soil pH</label>
                            <input
                                id="Soil_pH"
                                name="Soil_pH"
                                type="number"
                                step="0.1"
                                value={formData.Soil_pH}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="Temperature_C">Temperature (°C)</label>
                            <input
                                id="Temperature_C"
                                name="Temperature_C"
                                type="number"
                                value={formData.Temperature_C}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="Rainfall_mm">Rainfall (mm)</label>
                            <input
                                id="Rainfall_mm"
                                name="Rainfall_mm"
                                type="number"
                                value={formData.Rainfall_mm}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="Humidity">Humidity (%)</label>
                            <input
                                id="Humidity"
                                name="Humidity"
                                type="number"
                                value={formData.Humidity}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="Crop_Growth_Stage">Growth stage</label>
                            <select
                                id="Crop_Growth_Stage"
                                name="Crop_Growth_Stage"
                                value={formData.Crop_Growth_Stage}
                                onChange={handleChange}
                            >
                                <option>Seedling</option>
                                <option>Vegetative</option>
                                <option>Flowering</option>
                                <option>Fruiting</option>
                                <option>Maturity</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="Season">Season</label>
                            <select
                                id="Season"
                                name="Season"
                                value={formData.Season}
                                onChange={handleChange}
                            >
                                <option>Spring</option>
                                <option>Summer</option>
                                <option>Autumn</option>
                                <option>Winter</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="Irrigation_Type">Irrigation type</label>
                            <select
                                id="Irrigation_Type"
                                name="Irrigation_Type"
                                value={formData.Irrigation_Type}
                                onChange={handleChange}
                            >
                                <option>Drip</option>
                                <option>Sprinkler</option>
                                <option>Flood</option>
                                <option>Manual</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="Field_Area_hectare">Field area (ha)</label>
                            <input
                                id="Field_Area_hectare"
                                name="Field_Area_hectare"
                                type="number"
                                step="0.1"
                                value={formData.Field_Area_hectare}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="Previous_Irrigation_mm">Previous irrigation (mm)</label>
                            <input
                                id="Previous_Irrigation_mm"
                                name="Previous_Irrigation_mm"
                                type="number"
                                value={formData.Previous_Irrigation_mm}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button className="submit-button" type="submit" disabled={status.loading}>
                        {status.loading ? "Predicting..." : "Generate ML Recommendation"}
                    </button>

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={handleRuleBasedRecommendation}
                        disabled={status.loading}
                    >
                        Use Rule-Based Fallback
                    </button>

                    {status.message && (
                        <div className={`form-message ${status.type}`}>
                            {status.message}
                        </div>
                    )}
                </form>

                <aside className="recommendation-results">
                    <h3>Generated Recommendations</h3>

                    {recommendations.map((item, index) => (
                        <article
                            className={`recommendation-card ${item.level.toLowerCase()}`}
                            key={index}
                        >
                            <div>
                                <span className="level-badge">{item.level}</span>
                                <h4>{item.title}</h4>
                            </div>
                            <p>{item.text}</p>
                        </article>
                    ))}

                    <div className="ai-note">
                        <strong>Prototype note:</strong> The page calls the FastAPI ML service when
                        it is running. If the service is unavailable, the application still provides
                        a rule-based fallback recommendation for demonstration purposes.
                    </div>
                </aside>
            </section>
        </div>
    );
}