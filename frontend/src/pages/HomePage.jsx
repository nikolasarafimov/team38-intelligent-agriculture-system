function HomePage() {
    return (
        <>
            <section className="card status-card">
                <div>
                    <h2>Project Overview</h2>
                    <p>
                        The Intelligent Agriculture System is a web application for
                        managing crop, parcel and agricultural activity data. The system combines a
                        Spring Boot backend, PostgreSQL database, React frontend, CSV/Excel
                        import-export functionality and an AI/ML recommendation module.
                    </p>
                </div>

                <div className="status-list">
                    <div className="status-item">
                        <span className="status-dot"></span>
                        Backend service running
                    </div>
                    <div className="status-item">
                        <span className="status-dot"></span>
                        PostgreSQL database connected
                    </div>
                    <div className="status-item">
                        <span className="status-dot"></span>
                        Frontend interface available
                    </div>
                    <div className="status-item">
                        <span className="status-dot"></span>
                        ML module prepared for recommendations
                    </div>
                </div>
            </section>

            <section className="home-grid">
                <article className="feature-card">
                    <h3>Crop Management</h3>
                    <p>
                        Record and manage crop information such as crop name, type and planting
                        date through the application interface.
                    </p>
                </article>

                <article className="feature-card">
                    <h3>Soil & Field Analysis</h3>
                    <p>
                        Monitor soil moisture, pH, rainfall, temperature and other indicators from
                        the agricultural dataset.
                    </p>
                </article>

                <article className="feature-card">
                    <h3>AI Recommendations</h3>
                    <p>
                        Use machine learning logic and rule-based analysis to support irrigation
                        and agricultural decision-making.
                    </p>
                </article>

                <article className="feature-card">
                    <h3>Dashboard</h3>
                    <p>
                        View agricultural metrics, filters and visual indicators in a centralized
                        dashboard designed for project demonstration.
                    </p>
                </article>

                <article className="feature-card">
                    <h3>Import / Export</h3>
                    <p>
                        Export crop, parcel and activity data to CSV or Excel and import existing
                        records into the system.
                    </p>
                </article>

                <article className="feature-card">
                    <h3>External Data Support</h3>
                    <p>
                        The project structure is prepared for future integration with external
                        APIs such as weather services.
                    </p>
                </article>
            </section>
        </>
    );
}

export default HomePage;