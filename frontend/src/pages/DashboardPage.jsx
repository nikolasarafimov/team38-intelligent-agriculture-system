import { useEffect, useState } from "react";
import { apiRequest, getCurrentUser, getCurrentUserId } from "../api";
import "./DashboardPage.css";

function StatCard({ title, value, description }) {
    return (
        <article className="dashboard-stat-card">
            <p>{title}</p>
            <strong>{value}</strong>
            <span>{description}</span>
        </article>
    );
}

function DataTable({ title, columns, rows, emptyMessage, onEdit, onDelete }) {
    return (
        <section className="dashboard-table-card">
            <h3>{title}</h3>

            {rows.length === 0 ? (
                <p className="empty-table-message">{emptyMessage}</p>
            ) : (
                <div className="responsive-table">
                    <table>
                        <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {column.render
                                            ? column.render(row)
                                            : row[column.key] || "-"}
                                    </td>
                                ))}

                                <td>
                                    <div className="table-actions">
                                        <button
                                            type="button"
                                            className="edit-row-button"
                                            onClick={() => onEdit(row)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-row-button"
                                            onClick={() => onDelete(row.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function EditDataForm({ editType, editForm, setEditForm, onCancel, onSave, loading }) {
    if (!editType || !editForm) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    return (
        <section className="edit-data-card">
            <div className="edit-data-header">
                <div>
                    <span className="section-label">Edit Data</span>
                    <h2>
                        Edit{" "}
                        {editType === "crop"
                            ? "Crop"
                            : editType === "parcel"
                                ? "Parcel"
                                : "Activity"}
                    </h2>
                </div>

                <button type="button" className="secondary-dashboard-button" onClick={onCancel}>
                    Cancel
                </button>
            </div>

            <form className="edit-data-form" onSubmit={onSave}>
                {editType === "crop" && (
                    <>
                        <div className="form-field">
                            <label htmlFor="edit-crop-name">Crop Name</label>
                            <input
                                id="edit-crop-name"
                                name="name"
                                type="text"
                                value={editForm.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-crop-type">Crop Type</label>
                            <input
                                id="edit-crop-type"
                                name="type"
                                type="text"
                                value={editForm.type || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-crop-date">Planting Date</label>
                            <input
                                id="edit-crop-date"
                                name="plantingDate"
                                type="date"
                                value={editForm.plantingDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {editType === "parcel" && (
                    <>
                        <div className="form-field">
                            <label htmlFor="edit-parcel-location">Location</label>
                            <input
                                id="edit-parcel-location"
                                name="location"
                                type="text"
                                value={editForm.location || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-parcel-size">Size</label>
                            <input
                                id="edit-parcel-size"
                                name="size"
                                type="number"
                                step="0.01"
                                value={editForm.size || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-parcel-soil">Soil Type</label>
                            <input
                                id="edit-parcel-soil"
                                name="soilType"
                                type="text"
                                value={editForm.soilType || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                {editType === "activity" && (
                    <>
                        <div className="form-field">
                            <label htmlFor="edit-activity-description">Description</label>
                            <input
                                id="edit-activity-description"
                                name="description"
                                type="text"
                                value={editForm.description || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-activity-type">Activity Type</label>
                            <input
                                id="edit-activity-type"
                                name="type"
                                type="text"
                                value={editForm.type || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="edit-activity-date">Date</label>
                            <input
                                id="edit-activity-date"
                                name="date"
                                type="date"
                                value={editForm.date || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </section>
    );
}

export default function DashboardPage() {
    const currentUser = getCurrentUser();
    const activeUserId = getCurrentUserId();

    const [stats, setStats] = useState({
        usersCount: 0,
        cropsCount: 0,
        parcelsCount: 0,
        activitiesCount: 0,
    });

    const [search, setSearch] = useState("");
    const [crops, setCrops] = useState([]);
    const [parcels, setParcels] = useState([]);
    const [activities, setActivities] = useState([]);

    const [editType, setEditType] = useState("");
    const [editForm, setEditForm] = useState(null);


    const loadDashboard = async (searchValue = "") => {
        try {
            const query = searchValue.trim()
                ? `?search=${encodeURIComponent(searchValue.trim())}`
                : "";

            const [statsData, cropsData, parcelsData, activitiesData] =
                await Promise.all([
                    apiRequest("/api/dashboard/stats"),
                    apiRequest(`/api/crops${query}`),
                    apiRequest(`/api/parcels${query}`),
                    apiRequest(`/api/activities${query}`),
                ]);

            setStats(statsData);
            setCrops(cropsData);
            setParcels(parcelsData);
            setActivities(activitiesData);

        } catch (error) {
            setStatus({
                loading: false,
                message:
                    error.message ||
                    "Could not load dashboard data. Make sure the backend is running.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        loadDashboard(search);
    };

    const clearSearch = () => {
        setSearch("");
        loadDashboard("");
    };

    const startEdit = (type, row) => {
        setEditType(type);
        setEditForm({ ...row });

        setStatus({
            loading: false,
            message: `Editing ${type} record with ID ${row.id}.`,
            type: "info",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const cancelEdit = () => {
        setEditType("");
        setEditForm(null);

        setStatus({
            loading: false,
            message: "Edit cancelled.",
            type: "info",
        });
    };

    const saveEdit = async (event) => {
        event.preventDefault();

        if (!editType || !editForm?.id) {
            setStatus({
                loading: false,
                message: "No record selected for editing.",
                type: "error",
            });
            return;
        }

        setStatus({
            loading: true,
            message: "Saving changes...",
            type: "info",
        });

        try {
            let endpoint = "";
            let payload = {};

            if (editType === "crop") {
                endpoint = `/api/crops/${editForm.id}`;
                payload = {
                    name: editForm.name,
                    type: editForm.type,
                    plantingDate: editForm.plantingDate,
                    user: {
                        id: editForm.user?.id || activeUserId,
                    },
                };
            }

            if (editType === "parcel") {
                endpoint = `/api/parcels/${editForm.id}`;
                payload = {
                    location: editForm.location,
                    size: Number(editForm.size),
                    soilType: editForm.soilType,
                    user: {
                        id: editForm.user?.id || activeUserId,
                    },
                };
            }

            if (editType === "activity") {
                endpoint = `/api/activities/${editForm.id}`;
                payload = {
                    description: editForm.description,
                    date: editForm.date,
                    type: editForm.type,
                    user: {
                        id: editForm.user?.id || activeUserId,
                    },
                };
            }

            await apiRequest(endpoint, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            setEditType("");
            setEditForm(null);

            await loadDashboard(search);

            setStatus({
                loading: false,
                message: "Record updated successfully.",
                type: "success",
            });
        } catch (error) {
            setStatus({
                loading: false,
                message: error.message || "Could not update record.",
                type: "error",
            });
        }
    };

    const deleteRecord = async (type, id) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete this ${type} record?`
        );

        if (!confirmed) {
            return;
        }

        setStatus({
            loading: true,
            message: "Deleting record...",
            type: "info",
        });

        try {
            let endpoint = "";

            if (type === "crop") {
                endpoint = `/api/crops/${id}`;
            }

            if (type === "parcel") {
                endpoint = `/api/parcels/${id}`;
            }

            if (type === "activity") {
                endpoint = `/api/activities/${id}`;
            }

            await apiRequest(endpoint, {
                method: "DELETE",
            });

            await loadDashboard(search);

            setStatus({
                loading: false,
                message: "Record deleted successfully.",
                type: "success",
            });
        } catch (error) {
            setStatus({
                loading: false,
                message: error.message || "Could not delete record.",
                type: "error",
            });
        }
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-hero">
                <span className="section-label">Project Dashboard</span>
                <h1>Intelligent Agriculture Overview</h1>
                <p>
                    This dashboard displays real backend statistics, search/filter
                    functionality, and user-facing edit/delete actions for crops,
                    parcels and agricultural activities.
                </p>

                {currentUser && (
                    <div className="current-user-box">
                        Logged in as <strong>{currentUser.fullName}</strong> ·{" "}
                        {currentUser.email} · Role: {currentUser.role}
                    </div>
                )}
            </section>

            <section className="dashboard-stats-grid">
                <StatCard
                    title="Users"
                    value={stats.usersCount}
                    description="Registered users in the system"
                />

                <StatCard
                    title="Crops"
                    value={stats.cropsCount}
                    description="Saved agricultural crop records"
                />

                <StatCard
                    title="Parcels"
                    value={stats.parcelsCount}
                    description="Registered land parcel records"
                />

                <StatCard
                    title="Activities"
                    value={stats.activitiesCount}
                    description="Agricultural activity records"
                />
            </section>

            <section className="dashboard-search-card">
                <form onSubmit={handleSearchSubmit}>
                    <label htmlFor="dashboard-search">
                        Search and filter agricultural data
                    </label>

                    <div className="dashboard-search-row">
                        <input
                            id="dashboard-search"
                            type="text"
                            placeholder="Search by crop, type, location, soil, activity..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        <button type="submit">Search</button>

                        <button
                            type="button"
                            className="secondary-dashboard-button"
                            onClick={clearSearch}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </section>

            {status.message && (
                <div className={`dashboard-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <EditDataForm
                editType={editType}
                editForm={editForm}
                setEditForm={setEditForm}
                onCancel={cancelEdit}
                onSave={saveEdit}
                loading={status.loading}
            />

            <section className="dashboard-data-grid">
                <DataTable
                    title="Crops"
                    rows={crops}
                    emptyMessage="No crops found."
                    onEdit={(row) => startEdit("crop", row)}
                    onDelete={(id) => deleteRecord("crop", id)}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Name" },
                        { key: "type", label: "Type" },
                        { key: "plantingDate", label: "Planting Date" },
                        {
                            key: "user",
                            label: "User",
                            render: (row) => row.user?.email || "-",
                        },
                    ]}
                />

                <DataTable
                    title="Parcels"
                    rows={parcels}
                    emptyMessage="No parcels found."
                    onEdit={(row) => startEdit("parcel", row)}
                    onDelete={(id) => deleteRecord("parcel", id)}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "location", label: "Location" },
                        { key: "size", label: "Size" },
                        { key: "soilType", label: "Soil Type" },
                        {
                            key: "user",
                            label: "User",
                            render: (row) => row.user?.email || "-",
                        },
                    ]}
                />

                <DataTable
                    title="Activities"
                    rows={activities}
                    emptyMessage="No activities found."
                    onEdit={(row) => startEdit("activity", row)}
                    onDelete={(id) => deleteRecord("activity", id)}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "description", label: "Description" },
                        { key: "type", label: "Type" },
                        { key: "date", label: "Date" },
                        {
                            key: "user",
                            label: "User",
                            render: (row) => row.user?.email || "-",
                        },
                    ]}
                />
            </section>
        </main>
    );
}