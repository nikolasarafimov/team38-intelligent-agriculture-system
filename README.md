# Intelligent Agriculture System

Team 38 project for the course **ICT Project Management**.

The **Intelligent Agriculture System** is a web-based prototype for managing agricultural data and generating irrigation-related recommendations. The project combines a Spring Boot backend, React frontend, PostgreSQL database, CSV/Excel import-export functionality, and a separate FastAPI machine learning service.

---

## Project Overview

The purpose of this project is to support better agricultural decision-making through a digital platform that collects, stores, analyzes, and presents agricultural data in a structured way.

The system allows users to manage information about crops, parcels, and agricultural activities. It also includes import/export functionality for CSV and Excel files, a dashboard based on irrigation prediction data, and a machine learning module for irrigation need prediction.

The project is developed as a working prototype and demonstrates how different system components can work together in an intelligent agriculture environment.

---

## Project Theme

**Artificial Intelligence in Agriculture**

Selected topic:

**Intelligent System for Analysis and Recommendations in Agriculture**

---

## Main Features

- Crop data management
- Parcel data management
- Activity tracking
- PostgreSQL database storage
- CSV import and export
- Excel import and export
- Dashboard based on irrigation prediction data
- Recommendation interface
- FastAPI machine learning service for irrigation prediction
- React frontend with navigation and multiple pages
- Spring Boot REST API backend
- Docker Compose setup for easier project startup

---

## System Architecture

The system is organized into four main services:

```text
Frontend     React + Vite application served through Nginx
Backend      Spring Boot REST API
Database     PostgreSQL database
ML Service   FastAPI service for irrigation prediction
```

The frontend communicates with the backend through REST API calls. The recommendation page can also communicate with the FastAPI machine learning service. The backend stores and retrieves agricultural data from the PostgreSQL database.

---

## Project Structure

```text
team38-intelligent-agriculture-system/
├── backend/                 Spring Boot backend application
├── frontend/                React + Vite frontend application
├── ml/                      FastAPI machine learning service
├── docs/                    Project documentation and supporting files
├── docker-compose.yml       Multi-service Docker Compose configuration
├── README.md                Project overview and setup instructions
└── .gitignore
```

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Gradle
- Apache POI
- OpenCSV
- Springdoc OpenAPI

### Database

- PostgreSQL

### Machine Learning Service

- Python
- FastAPI
- scikit-learn
- pandas
- joblib
- Uvicorn

### DevOps and Project Organization

- Git
- GitHub
- Jira
- Docker
- Docker Compose

---

## Backend Overview

The backend is implemented as a Spring Boot REST API. It provides endpoints for managing users, crops, parcels, activities, and import/export operations.

Main backend modules:

```text
controller/      REST controllers
model/           JPA entities
repository/      Spring Data repositories
service/         Business logic and import/export services
config/          CORS and application configuration
```

Main backend entities:

```text
User
Crop
Parcel
Activity
```

Important backend endpoints:

```http
GET    /api/health
GET    /api/users
POST   /api/users
GET    /api/crops
POST   /api/crops
GET    /api/parcels
POST   /api/parcels
GET    /api/data/export/crops?userId=1
POST   /api/data/import/crops?userId=1
GET    /api/data/export/parcels?userId=1
POST   /api/data/import/parcels?userId=1
GET    /api/data/export/activities?userId=1
POST   /api/data/import/activities?userId=1
GET    /api/data/export/excel?userId=1
POST   /api/data/import/excel?userId=1
```

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui.html
```

---

## Frontend Overview

The frontend is implemented using React and Vite. It provides the user interface for interacting with the system.

Main frontend pages:

```text
Home
Dashboard
Add Crop
Recommendations
Import / Export
Login
Register
```

The frontend includes forms for entering crop data, pages for importing and exporting files, a dashboard based on the irrigation dataset, and a recommendation page that can communicate with the machine learning service.

Frontend URL:

```text
http://localhost:5173
```

---

## Machine Learning Module Overview

The machine learning module is implemented as a separate FastAPI service. It exposes an endpoint for predicting irrigation need based on agricultural and environmental input data.

Main ML files:

```text
ml/app/main.py
ml/app/schemas.py
ml/app/feature_engineering.py
ml/app/model_loader.py
ml/app/utils.py
```

Trained model objects are stored in:

```text
ml/trained_model_objects/
```

Important ML endpoints:

```http
GET  /health
POST /predict
```

ML service URL:

```text
http://localhost:8000
```

---

## Running the Full System with Docker Compose

The recommended way to run the complete project is with Docker Compose.

This starts:

```text
PostgreSQL database
Spring Boot backend
FastAPI ML service
React frontend served through Nginx
```

From the root project folder, run:

```bash
docker compose up --build
```

After the services start, open:

```text
Frontend:        http://localhost:5173
Backend:         http://localhost:8080
Backend Health:  http://localhost:8080/api/health
Swagger UI:      http://localhost:8080/swagger-ui.html
ML Health:       http://localhost:8000/health
```

To stop the system:

```bash
docker compose down
```

To stop the system and remove the database volume:

```bash
docker compose down -v
```

Use `docker compose down -v` only when a clean database reset is needed.

---

## Running the Project Manually

The project can also be started manually without Docker.

### 1. Start PostgreSQL

Create the database:

```sql
CREATE DATABASE agriculture_db;
```

Default backend database configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agriculture_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 2. Start Backend

```bash
cd backend
gradlew.bat bootRun
```

On Linux or macOS:

```bash
cd backend
./gradlew bootRun
```

Backend runs on:

```text
http://localhost:8080
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### 4. Start ML Service

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

On Linux or macOS:

```bash
cd ml
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

ML service runs on:

```text
http://localhost:8000
```

---

## Environment Configuration

The frontend uses environment variables for API configuration.

Example frontend environment configuration:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ML_API_BASE_URL=http://localhost:8000
VITE_DEMO_USER_ID=1
```

The backend can use environment variables for database configuration:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/agriculture_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

---

## Import and Export Functionality

The system supports CSV and Excel import/export for agricultural data.

Supported CSV exports:

```text
crops.csv
parcels.csv
activities.csv
```

Supported Excel export:

```text
agriculture_data.xlsx
```

The Excel file contains separate sheets for:

```text
Crops
Parcels
Activities
```

Import endpoints return a summary in JSON format:

```json
{
  "imported": 3,
  "skipped": 0,
  "errors": []
}
```

---

## Prototype Notes

This project is a working prototype. The main system components are implemented and can be demonstrated locally or through Docker Compose.

Implemented parts include:

```text
Spring Boot backend
React frontend
PostgreSQL database connection
CSV and Excel import/export
Dashboard interface
Recommendation interface
FastAPI ML prediction service
Docker Compose configuration
```

Some parts are prepared as prototype-level functionality and can be extended in future versions.

---

## Future Improvements

Possible improvements include:

- Full authentication and authorization
- Password hashing and role-based access control
- More advanced backend validation
- Full integration of external weather APIs
- Stronger integration between backend and ML service
- More detailed analytics dashboard
- Expanded automated testing
- Production deployment configuration
- Improved error handling and logging

---

## Team Information

**Team Number:** 38

**Team Members:**

1. Nikola Sarafimov
2. Sofija Andonova
3. Atanas Vitanov
4. Marko Trajkovski
5. Kire Boškovski
6. Ivan Perchuklieski
7. Mila Todorovska
8. Barbara Popovska
9. Nikola Popov
10. Zagorka Anevska

---

## Project Status

The project is prepared as a final working prototype for demonstration. It includes the main system components, organized project structure, Docker Compose setup, and documentation for running and testing the application.