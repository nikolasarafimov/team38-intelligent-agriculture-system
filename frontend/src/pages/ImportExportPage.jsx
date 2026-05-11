import { useState } from "react";

const API_BASE_URL = "http://localhost:8080";
const USER_ID = 1;

const importOptions = [
    { value: "crops", label: "Crops CSV" },
    { value: "parcels", label: "Parcels CSV" },
    { value: "activities", label: "Activities CSV" },
    { value: "excel", label: "All Data Excel" },
];

const exportOptions = [
    {
        endpoint: "crops",
        filename: "crops.csv",
        title: "Export Crops",
        description: "Download crop records as a CSV file.",
    },
    {
        endpoint: "parcels",
        filename: "parcels.csv",
        title: "Export Parcels",
        description: "Download parcel records as a CSV file.",
    },
    {
        endpoint: "activities",
        filename: "activities.csv",
        title: "Export Activities",
        description: "Download activity records as a CSV file.",
    },
    {
        endpoint: "excel",
        filename: "agriculture_data.xlsx",
        title: "Export Excel",
        description: "Download all available data as one Excel workbook.",
    },
];

export default function ImportExportPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [importType, setImportType] = useState("crops");
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setResult(null);
        setMessage("");
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setMessage("Please select a CSV or Excel file before importing.");
            return;
        }

        setLoading(true);
        setResult(null);
        setMessage("");

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/data/import/${importType}?userId=${USER_ID}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Import failed");
            }

            const data = await response.json();
            setResult(data);
            setMessage("Import completed.");
        } catch (error) {
            console.error(error);
            setMessage("Import failed. Make sure the backend is running and the file format is valid.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (endpoint, filename) => {
        setMessage("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/data/export/${endpoint}?userId=${USER_ID}`
            );

            if (!response.ok) {
                throw new Error("Export failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");

            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            window.URL.revokeObjectURL(url);
            setMessage(`${filename} exported successfully.`);
        } catch (error) {
            console.error(error);
            setMessage("Export failed. Make sure the backend is running and user ID 1 exists.");
        }
    };

    return (
        <div className="import-export-page">
            <section className="card">
                <span className="section-pill">CSV / Excel Data Portability</span>
                <h2>Import & Export Data</h2>
                <p>
                    This module allows users to export agricultural records to CSV or Excel and
                    import existing datasets into the system. It demonstrates file handling,
                    backend endpoints and database persistence.
                </p>
            </section>

            <section className="export-grid">
                {exportOptions.map((option) => (
                    <article className="export-card" key={option.endpoint}>
                        <h3>{option.title}</h3>
                        <p>{option.description}</p>
                        <button
                            type="button"
                            onClick={() => handleExport(option.endpoint, option.filename)}
                        >
                            Download
                        </button>
                    </article>
                ))}
            </section>

            <section className="import-panel">
                <div>
                    <h3>Import Data</h3>
                    <p>
                        Select the import type, choose a file and upload it to the backend service.
                    </p>
                </div>

                <div className="import-controls">
                    <div className="form-field">
                        <label htmlFor="importType">Import type</label>
                        <select
                            id="importType"
                            value={importType}
                            onChange={(event) => setImportType(event.target.value)}
                        >
                            {importOptions.map((option) => (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="file">File</label>
                        <input
                            id="file"
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button className="submit-button" type="button" onClick={handleImport} disabled={loading}>
                        {loading ? "Importing..." : "Import File"}
                    </button>
                </div>

                {message && <div className="form-message info">{message}</div>}

                {result && (
                    <div className="import-result">
                        <p>
                            Imported: <strong>{result.imported}</strong>
                        </p>
                        <p>
                            Skipped: <strong>{result.skipped}</strong>
                        </p>

                        {result.errors?.length > 0 && (
                            <div>
                                <p>Errors:</p>
                                <ul>
                                    {result.errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}