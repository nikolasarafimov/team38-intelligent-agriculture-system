import { useState } from "react";
import { API_BASE_URL, getCurrentUserId } from "../api";

const initialCropData = {
    name: "",
    type: "",
    plantingDate: "",
};

const initialParcelData = {
    location: "",
    size: "",
    soilType: "",
};

const initialActivityData = {
    description: "",
    date: "",
    type: "",
};

export default function DataEntryPage() {
    const activeUserId = getCurrentUserId();
    const [activeTab, setActiveTab] = useState("crop");

    const [cropData, setCropData] = useState(initialCropData);
    const [parcelData, setParcelData] = useState(initialParcelData);
    const [activityData, setActivityData] = useState(initialActivityData);

    const [status, setStatus] = useState({
        message: "",
        type: "",
    });

    const [lastSavedRecord, setLastSavedRecord] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCropChange = (event) => {
        const { name, value } = event.target;

        setCropData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleParcelChange = (event) => {
        const { name, value } = event.target;

        setParcelData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleActivityChange = (event) => {
        const { name, value } = event.target;

        setActivityData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const saveCrop = async (event) => {
        event.preventDefault();

        if (!cropData.name.trim() || !cropData.type.trim() || !cropData.plantingDate) {
            setStatus({
                message: "Please fill in all crop fields before saving.",
                type: "error",
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({
            message: "Saving crop data...",
            type: "info",
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/crops`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: cropData.name,
                    type: cropData.type,
                    plantingDate: cropData.plantingDate,
                    user: {
                        id: activeUserId,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Crop save request failed.");
            }

            const savedCrop = await response.json();

            setLastSavedRecord({
                category: "Crop",
                title: savedCrop.name,
                id: savedCrop.id,
            });

            setCropData(initialCropData);

            setStatus({
                message: "Crop data was saved successfully.",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setStatus({
                message: `Could not save crop data. Make sure the backend is running and user with ID ${activeUserId} exists.`,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveParcel = async (event) => {
        event.preventDefault();

        if (!parcelData.location.trim() || !parcelData.size || !parcelData.soilType.trim()) {
            setStatus({
                message: "Please fill in all parcel fields before saving.",
                type: "error",
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({
            message: "Saving parcel data...",
            type: "info",
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/parcels`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    location: parcelData.location,
                    size: Number(parcelData.size),
                    soilType: parcelData.soilType,
                    user: {
                        id: activeUserId,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Parcel save request failed.");
            }

            const savedParcel = await response.json();

            setLastSavedRecord({
                category: "Parcel",
                title: savedParcel.location,
                id: savedParcel.id,
            });

            setParcelData(initialParcelData);

            setStatus({
                message: "Parcel data was saved successfully.",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setStatus({
                message: `Could not save parcel data. Make sure the backend is running and user with ID ${activeUserId} exists.`,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveActivity = async (event) => {
        event.preventDefault();

        if (!activityData.description.trim() || !activityData.date || !activityData.type.trim()) {
            setStatus({
                message: "Please fill in all activity fields before saving.",
                type: "error",
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({
            message: "Saving activity data...",
            type: "info",
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/activities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description: activityData.description,
                    date: activityData.date,
                    type: activityData.type,
                    user: {
                        id: activeUserId,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Activity save request failed.");
            }

            const savedActivity = await response.json();

            setLastSavedRecord({
                category: "Activity",
                title: savedActivity.description,
                id: savedActivity.id,
            });

            setActivityData(initialActivityData);

            setStatus({
                message: "Activity data was saved successfully.",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setStatus({
                message: `Could not save activity data. Make sure the backend is running and user with ID ${activeUserId} exists.`,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const changeTab = (tabName) => {
        setActiveTab(tabName);
        setStatus({
            message: "",
            type: "",
        });
        setLastSavedRecord(null);
    };

    return (
        <main className="page-shell">
            <section className="page-header-card">
                <span className="section-label">Agricultural Data Entry</span>
                <h1>Data Entry</h1>
                <p>
                    Enter and store agricultural records in the system. This page allows users
                    to manage the main data categories used by the application: crops, parcels
                    and field activities.
                </p>
            </section>

            <section className="data-entry-tabs">
                <button
                    type="button"
                    className={activeTab === "crop" ? "active" : ""}
                    onClick={() => changeTab("crop")}
                >
                    Crop
                </button>

                <button
                    type="button"
                    className={activeTab === "parcel" ? "active" : ""}
                    onClick={() => changeTab("parcel")}
                >
                    Parcel
                </button>

                <button
                    type="button"
                    className={activeTab === "activity" ? "active" : ""}
                    onClick={() => changeTab("activity")}
                >
                    Activity
                </button>
            </section>

            <section className="crop-form-layout">
                {activeTab === "crop" && (
                    <form className="crop-form-card" onSubmit={saveCrop}>
                        <div className="form-group">
                            <label htmlFor="name">Crop name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Example: Wheat"
                                value={cropData.name}
                                onChange={handleCropChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Crop type</label>
                            <input
                                id="type"
                                name="type"
                                type="text"
                                placeholder="Example: Grain"
                                value={cropData.type}
                                onChange={handleCropChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="plantingDate">Planting date</label>
                            <input
                                id="plantingDate"
                                name="plantingDate"
                                type="date"
                                value={cropData.plantingDate}
                                onChange={handleCropChange}
                            />
                        </div>

                        <button className="primary-action-button" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Crop"}
                        </button>

                        {status.message && (
                            <div className={`form-alert ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                    </form>
                )}

                {activeTab === "parcel" && (
                    <form className="crop-form-card" onSubmit={saveParcel}>
                        <div className="form-group">
                            <label htmlFor="location">Parcel location</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Example: North Field"
                                value={parcelData.location}
                                onChange={handleParcelChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="size">Parcel size</label>
                            <input
                                id="size"
                                name="size"
                                type="number"
                                step="0.1"
                                placeholder="Example: 2.5"
                                value={parcelData.size}
                                onChange={handleParcelChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="soilType">Soil type</label>
                            <input
                                id="soilType"
                                name="soilType"
                                type="text"
                                placeholder="Example: Loamy"
                                value={parcelData.soilType}
                                onChange={handleParcelChange}
                            />
                        </div>

                        <button className="primary-action-button" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Parcel"}
                        </button>

                        {status.message && (
                            <div className={`form-alert ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                    </form>
                )}

                {activeTab === "activity" && (
                    <form className="crop-form-card" onSubmit={saveActivity}>
                        <div className="form-group">
                            <label htmlFor="description">Activity description</label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Example: Irrigation completed"
                                value={activityData.description}
                                onChange={handleActivityChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Activity date</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                value={activityData.date}
                                onChange={handleActivityChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="activityType">Activity type</label>
                            <input
                                id="activityType"
                                name="type"
                                type="text"
                                placeholder="Example: Irrigation"
                                value={activityData.type}
                                onChange={handleActivityChange}
                            />
                        </div>

                        <button className="primary-action-button" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Activity"}
                        </button>

                        {status.message && (
                            <div className={`form-alert ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                    </form>
                )}

                <aside className="crop-preview-card">
                    <span className="section-label">Current Input</span>

                    {activeTab === "crop" && (
                        <>
                            <h2>Crop Preview</h2>
                            <div className="preview-list">
                                <div>
                                    <span>Name</span>
                                    <strong>{cropData.name || "Not entered"}</strong>
                                </div>
                                <div>
                                    <span>Type</span>
                                    <strong>{cropData.type || "Not entered"}</strong>
                                </div>
                                <div>
                                    <span>Planting date</span>
                                    <strong>{cropData.plantingDate || "Not selected"}</strong>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "parcel" && (
                        <>
                            <h2>Parcel Preview</h2>
                            <div className="preview-list">
                                <div>
                                    <span>Location</span>
                                    <strong>{parcelData.location || "Not entered"}</strong>
                                </div>
                                <div>
                                    <span>Size</span>
                                    <strong>{parcelData.size ? `${parcelData.size} ha` : "Not entered"}</strong>
                                </div>
                                <div>
                                    <span>Soil type</span>
                                    <strong>{parcelData.soilType || "Not entered"}</strong>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "activity" && (
                        <>
                            <h2>Activity Preview</h2>
                            <div className="preview-list">
                                <div>
                                    <span>Description</span>
                                    <strong>{activityData.description || "Not entered"}</strong>
                                </div>
                                <div>
                                    <span>Date</span>
                                    <strong>{activityData.date || "Not selected"}</strong>
                                </div>
                                <div>
                                    <span>Type</span>
                                    <strong>{activityData.type || "Not entered"}</strong>
                                </div>
                            </div>
                        </>
                    )}

                    {lastSavedRecord && (
                        <div className="saved-crop-box">
                            <span className="section-label">Last Saved Record</span>
                            <p>
                                <strong>{lastSavedRecord.title}</strong> was saved as{" "}
                                <strong>{lastSavedRecord.category}</strong> with ID{" "}
                                <strong>{lastSavedRecord.id}</strong>.
                            </p>
                        </div>
                    )}
                </aside>
            </section>
        </main>
    );
}