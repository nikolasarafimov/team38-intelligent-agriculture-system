import { useEffect, useState } from "react";
import { apiRequest, getCurrentUser } from "../api";

function AdminTable({ title, rows, columns, onDelete }) {
    return (
        <section className="dashboard-table-card">
            <h3>{title}</h3>

            {rows.length === 0 ? (
                <p className="empty-table-message">No records found.</p>
            ) : (
                <div className="responsive-table">
                    <table>
                        <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                            <th>Action</th>
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
                                    <button
                                        className="admin-delete-button"
                                        type="button"
                                        onClick={() => onDelete(row.id)}
                                    >
                                        Delete
                                    </button>
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

export default function AdminPage() {
    const currentUser = getCurrentUser();

    const [users, setUsers] = useState([]);
    const [crops, setCrops] = useState([]);
    const [parcels, setParcels] = useState([]);
    const [activities, setActivities] = useState([]);

    const [status, setStatus] = useState({
        loading: true,
        message: "Loading admin data...",
        type: "info",
    });

    const loadAdminData = async () => {
        setStatus({
            loading: true,
            message: "Loading admin data...",
            type: "info",
        });

        try {
            const [usersData, cropsData, parcelsData, activitiesData] =
                await Promise.all([
                    apiRequest("/api/admin/users"),
                    apiRequest("/api/admin/crops"),
                    apiRequest("/api/admin/parcels"),
                    apiRequest("/api/admin/activities"),
                ]);

            setUsers(usersData);
            setCrops(cropsData);
            setParcels(parcelsData);
            setActivities(activitiesData);

            setStatus({
                loading: false,
                message: "Admin data loaded successfully.",
                type: "success",
            });
        } catch (error) {
            setStatus({
                loading: false,
                message:
                    error.message ||
                    "Could not load admin data. Make sure the backend is running.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const deleteRecord = async (resource, id) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete this ${resource} record?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await apiRequest(`/api/admin/${resource}/${id}`, {
                method: "DELETE",
            });

            setStatus({
                loading: false,
                message: "Record deleted successfully.",
                type: "success",
            });

            loadAdminData();
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
                <span className="section-label">Administrative Functionalities</span>
                <h1>Admin Panel</h1>
                <p>
                    This page demonstrates administrative access to users and system
                    data. It allows reviewing users, crops, parcels and agricultural
                    activities, with basic delete actions for intervention.
                </p>

                {currentUser && (
                    <div className="current-user-box">
                        Current user: <strong>{currentUser.fullName}</strong> · Role:{" "}
                        {currentUser.role}
                    </div>
                )}
            </section>

            {status.message && (
                <div className={`dashboard-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <section className="dashboard-data-grid">
                <AdminTable
                    title="Users"
                    rows={users}
                    onDelete={(id) => deleteRecord("users", id)}
                    columns={[
                        { key: "id", label: "ID" },
                        { key: "fullName", label: "Full Name" },
                        { key: "email", label: "Email" },
                        { key: "role", label: "Role" },
                    ]}
                />

                <AdminTable
                    title="Crops"
                    rows={crops}
                    onDelete={(id) => deleteRecord("crops", id)}
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

                <AdminTable
                    title="Parcels"
                    rows={parcels}
                    onDelete={(id) => deleteRecord("parcels", id)}
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

                <AdminTable
                    title="Activities"
                    rows={activities}
                    onDelete={(id) => deleteRecord("activities", id)}
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