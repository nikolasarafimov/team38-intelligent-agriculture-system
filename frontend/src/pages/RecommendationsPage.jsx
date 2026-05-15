import { useState } from "react";
import { apiRequest } from "../api";

export default function RecommendationsPage() {
    const [formData, setFormData] = useState({
        cropType: "Tomato",
        soilType: "Loamy",
        temperature: "28",
        humidity: "55",
        rainfall: "8",
    });

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        setStatus({
            loading: true,
            message: "Generating AI-supported recommendation...",
            type: "info",
        });

        setRecommendation(null);

        const payload = {
            cropType: formData.cropType,
            soilType: formData.soilType,
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            rainfall: Number(formData.rainfall),
        };

        try {
            const response = await apiRequest("/api/recommendations", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setRecommendation(response);

            setStatus({
                loading: false,
                message: "Recommendation generated successfully.",
                type: "success",
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

    return (
        <main className="page-shell">
            <section className="page-header-card">
                <span className="section-label">AI / ML Module</span>
                <h1>AI-Supported Recommendations</h1>
                <p>
                    This page sends crop, soil and weather-related input to the Spring Boot
                    backend. The backend forwards the data to the FastAPI ML service and
                    returns an agricultural recommendation.
                </p>
            </section>

            <section className="form-layout">
                <form className="data-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="cropType">Crop Type</label>
                        <input
                            id="cropType"
                            name="cropType"
                            type="text"
                            value={formData.cropType}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="soilType">Soil Type</label>
                        <select
                            id="soilType"
                            name="soilType"
                            value={formData.soilType}
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
                        <label htmlFor="temperature">Temperature °C</label>
                        <input
                            id="temperature"
                            name="temperature"
                            type="number"
                            step="0.1"
                            value={formData.temperature}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="humidity">Humidity %</label>
                        <input
                            id="humidity"
                            name="humidity"
                            type="number"
                            step="0.1"
                            value={formData.humidity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="rainfall">Rainfall mm</label>
                        <input
                            id="rainfall"
                            name="rainfall"
                            type="number"
                            step="0.1"
                            value={formData.rainfall}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="submit-button" type="submit" disabled={status.loading}>
                        {status.loading ? "Generating..." : "Generate Recommendation"}
                    </button>

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
                            Fill in the agricultural conditions and generate an
                            AI-supported recommendation.
                        </p>
                    ) : (
                        <div className="recommendation-result">
                            <div className="recommendation-highlight">
                                <span>Recommendation</span>
                                <strong>
                                    {recommendation.recommendation ||
                                        recommendation.prediction ||
                                        recommendation.result ||
                                        "Recommendation generated."}
                                </strong>
                            </div>

                            <div className="preview-list">
                                <div>
                                    <span>Source</span>
                                    <strong>{recommendation.source || "ML service"}</strong>
                                </div>

                                <div>
                                    <span>ML Service Available</span>
                                    <strong>
                                        {recommendation.mlServiceAvailable === false
                                            ? "No, backend fallback used"
                                            : "Yes / response received"}
                                    </strong>
                                </div>
                            </div>

                            <details className="raw-response-details">
                                <summary>View raw response</summary>
                                <pre>{JSON.stringify(recommendation, null, 2)}</pre>
                            </details>
                        </div>
                    )}
                </aside>
            </section>
        </main>
    );
}