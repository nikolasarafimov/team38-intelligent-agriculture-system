import React, { useState } from 'react';

const ImportExportPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [entity, setEntity] = useState('crops');
    const [importType, setImportType] = useState('crops');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const USER_ID = 1; // Replace with actual user ID from auth

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', USER_ID);

        try {
            const response = await fetch(`http://localhost:8080/api/data/import/${importType}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                alert('Import failed');
            }
        } catch (error) {
            console.error('Error importing:', error);
            alert('Error importing');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (endpoint, filename) => {
        try {
            const response = await fetch(`http://localhost:8080/api/data/export/${endpoint}?userId=${USER_ID}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Export failed');
            }
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Error exporting');
        }
    };

    return (
        <div>
            <h1>Import/Export Data</h1>

            {/* EXPORT SECTION */}
            <section>
                <h2>Export</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleExport('crops', 'crops.csv')}>Export Crops (CSV)</button>
                    <button onClick={() => handleExport('parcels', 'parcels.csv')}>Export Parcels (CSV)</button>
                    <button onClick={() => handleExport('activities', 'activities.csv')}>Export Activities (CSV)</button>
                    <button onClick={() => handleExport('excel', 'agriculture_data.xlsx')}>Export All (Excel)</button>
                </div>
            </section>

            <hr />

            {/* IMPORT SECTION */}
            <section>
                <h2>Import</h2>
                <label>Import type: </label>
                <select value={importType} onChange={(e) => setImportType(e.target.value)}>
                    <option value="crops">Crops (CSV)</option>
                    <option value="parcels">Parcels (CSV)</option>
                    <option value="excel">All data (Excel)</option>
                </select>
                <br />
                <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
                <br />
                <button onClick={handleImport} disabled={loading}>
                    {loading ? 'Importing...' : 'Import'}
                </button>

                {result && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4f0', borderRadius: 8 }}>
                        <p>✅ Imported: <strong>{result.imported}</strong></p>
                        <p>⚠️ Skipped: <strong>{result.skipped}</strong></p>
                        {result.errors?.length > 0 && (
                            <div>
                                <p>❌ Errors:</p>
                                <ul>
                                    {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ImportExportPage;
