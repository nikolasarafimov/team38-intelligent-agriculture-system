import { useState } from "react";

const API_BASE_URL = "http://localhost:8080";

export default function CropForm() {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        plantingDate: "",
    });

    const [status, setStatus] = useState({
        loading: false,
        message: "",
        type: "",
    });

    const [createdCrop, setCreatedCrop] = useState(null);

    const USER_ID = 1;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            type: "",
            plantingDate: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.name.trim() || !formData.type.trim() || !formData.plantingDate) {
            setStatus({
                loading: false,
                message: "Please fill in all crop fields before submitting.",
                type: "error",
            });
            return;
        }

        setStatus({
            loading: true,
            message: "Saving crop data...",
            type: "info",
        });

        const payload = {
            name: formData.name,
            type: formData.type,
            plantingDate: formData.plantingDate,
            user: {
                id: USER_ID,
            },
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/crops`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save crop.");
            }

            const savedCrop = await response.json();

            setCreatedCrop(savedCrop);
            setStatus({
                loading: false,
                message: "Crop data saved successfully.",
                type: "success",
            });
            resetForm();
        } catch (error) {
            setStatus({
                loading: false,
                message:
                    "Could not save crop data. Make sure the backend is running and user with ID 1 exists.",
                type: "error",
            });
            console.error(error);
        }
    };

    return (
        <div className="form-page">
            <section className="card form-intro">
                <div>
                    <span className="section-pill">Crop Data Entry</span>
                    <h2>Add New Crop</h2>
                    <p>
                        Enter crop information and store it in the PostgreSQL database through the
                        Spring Boot backend. This page demonstrates the frontend-backend
                        integration of the project.
                    </p>
                </div>
            </section>

            <section className="form-layout">
                <form className="data-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="crop-name">Crop name</label>
                        <input
                            id="crop-name"
                            name="name"
                            type="text"
                            placeholder="Example: Wheat"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="crop-type">Crop type</label>
                        <input
                            id="crop-type"
                            name="type"
                            type="text"
                            placeholder="Example: Grain"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="planting-date">Planting date</label>
                        <input
                            id="planting-date"
                            name="plantingDate"
                            type="date"
                            value={formData.plantingDate}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="submit-button" type="submit" disabled={status.loading}>
                        {status.loading ? "Saving..." : "Save Crop"}
                    </button>

                    {status.message && (
                        <div className={`form-message ${status.type}`}>{status.message}</div>
                    )}
                </form>

                <aside className="preview-panel">
                    <h3>Current Input</h3>
                    <div className="preview-row">
                        <span>Name</span>
                        <strong>{formData.name || "Not entered"}</strong>
                    </div>
                    <div className="preview-row">
                        <span>Type</span>
                        <strong>{formData.type || "Not entered"}</strong>
                    </div>
                    <div className="preview-row">
                        <span>Planting date</span>
                        <strong>{formData.plantingDate || "Not selected"}</strong>
                    </div>

                    {createdCrop && (
                        <div className="created-box">
                            <h4>Last saved crop</h4>
                            <p>
                                <strong>ID:</strong> {createdCrop.id}
                            </p>
                            <p>
                                <strong>Name:</strong> {createdCrop.name}
                            </p>
                            <p>
                                <strong>Type:</strong> {createdCrop.type}
                            </p>
                        </div>
                    )}
                </aside>
            </section>
        </div>
    );
}