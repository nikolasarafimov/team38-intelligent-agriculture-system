import { useState } from "react";
import { apiRequest } from "../api";

export default function WeatherPage() {
    const [coordinates, setCoordinates] = useState({
        latitude: "41.9981",
        longitude: "21.4254",
    });

    const [weatherData, setWeatherData] = useState(null);

    const [status, setStatus] = useState({
        loading: false,
        message: "",
        type: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            [name]: value,
        }));
    };

    const fetchWeather = async (event) => {
        event.preventDefault();

        if (!coordinates.latitude || !coordinates.longitude) {
            setStatus({
                loading: false,
                message: "Latitude and longitude are required.",
                type: "error",
            });
            return;
        }

        setStatus({
            loading: true,
            message: "Fetching weather data from external API...",
            type: "info",
        });

        try {
            const data = await apiRequest(
                `/api/weather?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
            );

            setWeatherData(data);

            setStatus({
                loading: false,
                message: "Weather data loaded successfully.",
                type: "success",
            });
        } catch (error) {
            setStatus({
                loading: false,
                message:
                    error.message ||
                    "Could not fetch weather data. Make sure the backend is running.",
                type: "error",
            });
        }
    };

    const current = weatherData?.current;
    const currentUnits = weatherData?.current_units;

    return (
        <main className="page-shell">
            <section className="page-header-card">
                <span className="section-label">External API Integration</span>
                <h1>Weather Data</h1>
                <p>
                    This page demonstrates integration with an external weather API.
                    The backend calls Open-Meteo and returns current weather and daily
                    forecast data for the selected coordinates.
                </p>
            </section>

            <section className="form-layout">
                <form className="data-form" onSubmit={fetchWeather}>
                    <div className="form-field">
                        <label htmlFor="latitude">Latitude</label>
                        <input
                            id="latitude"
                            name="latitude"
                            type="number"
                            step="0.0001"
                            value={coordinates.latitude}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="longitude">Longitude</label>
                        <input
                            id="longitude"
                            name="longitude"
                            type="number"
                            step="0.0001"
                            value={coordinates.longitude}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="submit-button" type="submit" disabled={status.loading}>
                        {status.loading ? "Loading Weather..." : "Get Weather Data"}
                    </button>

                    {status.message && (
                        <div className={`form-alert ${status.type}`}>
                            {status.message}
                        </div>
                    )}
                </form>

                <aside className="preview-panel">
                    <h2>Current Weather</h2>

                    {!current ? (
                        <p>
                            Click the button to load weather data for the selected
                            coordinates. Default coordinates are for Skopje.
                        </p>
                    ) : (
                        <div className="preview-list">
                            <div>
                                <span>Temperature</span>
                                <strong>
                                    {current.temperature_2m}{" "}
                                    {currentUnits?.temperature_2m || "°C"}
                                </strong>
                            </div>

                            <div>
                                <span>Humidity</span>
                                <strong>
                                    {current.relative_humidity_2m}{" "}
                                    {currentUnits?.relative_humidity_2m || "%"}
                                </strong>
                            </div>

                            <div>
                                <span>Precipitation</span>
                                <strong>
                                    {current.precipitation}{" "}
                                    {currentUnits?.precipitation || "mm"}
                                </strong>
                            </div>

                            <div>
                                <span>Wind Speed</span>
                                <strong>
                                    {current.wind_speed_10m}{" "}
                                    {currentUnits?.wind_speed_10m || "km/h"}
                                </strong>
                            </div>
                        </div>
                    )}
                </aside>
            </section>
        </main>
    );
}