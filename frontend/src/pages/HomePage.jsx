function HomePage() {
    return (
        <>
            <section className="card">
                <h2>About the Project</h2>
                <p>
                    This web-based system is designed to help users manage agricultural data,
                    monitor crop-related information, and receive intelligent recommendations
                    based on input data, external APIs, and AI-supported analysis.
                </p>
            </section>
            <section className="card">
                <h2>Main Features</h2>
                <ul>
                    <li>User registration and login</li>
                    <li>Crop and parcel data management</li>
                    <li>External API integration for agricultural data</li>
                    <li>AI-based recommendations</li>
                    <li>Import and export of data files</li>
                </ul>
            </section>
            <section className="card">
                <h2>Current Project Status</h2>
                <p>
                    The project is currently in the initial implementation phase. The backend and
                    frontend structures have been created, and the next steps include database
                    connection, user authentication, and building core system functionalities.
                </p>
            </section>
        </>
    );
}

export default HomePage;