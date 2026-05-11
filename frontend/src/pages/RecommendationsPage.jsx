import { useState } from "react";

const defaultForm = {
    cropType: "Wheat",
    soilType: "Loamy",
    soilMoisture: 35,
    soilPh: 6.5,
    temperature: 27,
    rainfall: 3,
    humidity: 55,
    growthStage: "Vegetative",
};

function buildRecommendation(data) {
    const recommendations = [];

    if (Number(data.soilMoisture) < 35) {
        recommendations.push({
            title: "High irrigation priority",
            text: "Soil moisture is low. Irrigation should be scheduled soon to prevent crop stress.",
            level: "High",
        });
    } else if (Number(data.soilMoisture) < 55 && Number(data.temperature) > 25) {
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

    if (Number(data.soilPh) < 5.8) {
        recommendations.push({
            title: "Soil acidity warning",
            text: "The soil pH is relatively low. Consider soil correction practices depending on crop requirements.",
            level: "Medium",
        });
    }

    if (Number(data.rainfall) > 15) {
        recommendations.push({
            title: "Rainfall detected",
            text: "Rainfall is sufficient. Delay additional irrigation and monitor field moisture before action.",
            level: "Low",
        });
    }

    if (Number(data.temperature) > 32) {
        recommendations.push({
            title: "Heat stress risk",
            text: "High temperature may increase crop stress. Monitor the field and avoid irrigation during peak heat.",
            level: "High",
        });
    }

    return recommendations;
}

export default function Recommendations() {
    const [formData, setFormData] = useState(defaultForm);
    const [recommendations, setRecommendations] = useState(buildRecommendation(defaultForm));

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setRecommendations(buildRecommendation(formData));
    };

    return (
        <div className="recommendations-page">
            <section className="card">
                <span className="section-pill">AI Recommendation Module</span>
                <h2>Agricultural Recommendations</h2>
                <p>
                    This page demonstrates the intelligent recommendation part of the system. It
                    uses crop, soil and weather parameters to generate decision-support guidance
                    for irrigation and field management.
                </p>
            </section>

            <section className="recommendation-layout">
                <form className="data-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="cropType">Crop type</label>
                        <select
                            id="cropType"
                            name="cropType"
                            value={formData.cropType}
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
                        <label htmlFor="soilType">Soil type</label>
                        <select
                            id="soilType"
                            name="soilType"
                            value={formData.soilType}
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
                            <label htmlFor="soilMoisture">Soil moisture (%)</label>
                            <input
                                id="soilMoisture"
                                name="soilMoisture"
                                type="number"
                                value={formData.soilMoisture}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="soilPh">Soil pH</label>
                            <input
                                id="soilPh"
                                name="soilPh"
                                type="number"
                                step="0.1"
                                value={formData.soilPh}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="temperature">Temperature (°C)</label>
                            <input
                                id="temperature"
                                name="temperature"
                                type="number"
                                value={formData.temperature}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="rainfall">Rainfall (mm)</label>
                            <input
                                id="rainfall"
                                name="rainfall"
                                type="number"
                                value={formData.rainfall}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-field">
                            <label htmlFor="humidity">Humidity (%)</label>
                            <input
                                id="humidity"
                                name="humidity"
                                type="number"
                                value={formData.humidity}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="growthStage">Growth stage</label>
                            <select
                                id="growthStage"
                                name="growthStage"
                                value={formData.growthStage}
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

                    <button className="submit-button" type="submit">
                        Generate Recommendation
                    </button>
                </form>

                <aside className="recommendation-results">
                    <h3>Generated Recommendations</h3>

                    {recommendations.map((item, index) => (
                        <article className={`recommendation-card ${item.level.toLowerCase()}`} key={index}>
                            <div>
                                <span className="level-badge">{item.level}</span>
                                <h4>{item.title}</h4>
                            </div>
                            <p>{item.text}</p>
                        </article>
                    ))}

                    <div className="ai-note">
                        <strong>Prototype note:</strong> This recommendation screen represents the
                        AI-supported decision-making module. It can later be connected directly to
                        the FastAPI ML prediction endpoint.
                    </div>
                </aside>
            </section>
        </div>
    );
}