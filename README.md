# Intelligent Agriculture System

Team 38 project for the course **ICT Project Management**.

The **Intelligent Agriculture System** is a web-based prototype for managing agricultural data, integrating external weather data, supporting CSV/Excel import-export, and generating AI-supported agricultural recommendations. The project combines a Spring Boot backend, React frontend, PostgreSQL database, Docker Compose setup, and a separate FastAPI machine learning service.

---

## Project Overview

The purpose of this project is to support better agricultural decision-making through a digital platform that collects, stores, analyzes, and presents agricultural data in a structured way.

The system allows users to manage information about crops, parcels, and agricultural activities. It also includes import/export functionality for CSV and Excel files, dashboard statistics, external weather API integration, and a machine learning module for generating agricultural recommendations.

The project is developed as a working academic prototype and demonstrates how different system components can work together in an intelligent agriculture environment.

---

## Project Theme

**Artificial Intelligence in Agriculture**

Selected topic:

**Intelligent System for Analysis and Recommendations in Agriculture**

---

## Main Features

- User registration and login
- User logout
- Crop data management
- Parcel data management
- Agricultural activity tracking
- PostgreSQL database storage
- CSV import and export
- Excel import and export
- Dashboard statistics
- Search and filtering of agricultural data
- External weather API integration
- AI-supported recommendation interface
- FastAPI machine learning service
- Basic administrative panel
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
ML Service   FastAPI service for agricultural recommendations
```

The frontend communicates with the backend through REST API calls. The backend stores and retrieves agricultural data from the PostgreSQL database. The backend can also communicate with the FastAPI machine learning service to generate AI-supported recommendations. The weather functionality demonstrates integration with an external API.

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
- Bean Validation
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

The backend is implemented as a Spring Boot REST API. It provides endpoints for managing users, crops, parcels, agricultural activities, dashboard statistics, weather data, recommendations, administrative records, and import/export operations.

Main backend modules:

```text
controller/      REST controllers
dto/             Request and response objects
model/           JPA entities
repository/      Spring Data repositories
service/         Business logic
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
POST   /api/users/register
POST   /api/users/login
POST   /api/users/logout
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}

GET    /api/crops
GET    /api/crops?search=tomato
GET    /api/crops?userId=1
GET    /api/crops?userId=1&search=tomato
GET    /api/crops/{id}
POST   /api/crops
PUT    /api/crops/{id}
DELETE /api/crops/{id}

GET    /api/parcels
GET    /api/parcels?search=loamy
GET    /api/parcels?userId=1
GET    /api/parcels?userId=1&search=loamy
GET    /api/parcels/{id}
POST   /api/parcels
PUT    /api/parcels/{id}
DELETE /api/parcels/{id}

GET    /api/activities
GET    /api/activities?search=irrigation
GET    /api/activities?userId=1
GET    /api/activities?userId=1&search=irrigation
GET    /api/activities/{id}
POST   /api/activities
PUT    /api/activities/{id}
DELETE /api/activities/{id}

GET    /api/dashboard/stats

GET    /api/weather?latitude=41.9981&longitude=21.4254

POST   /api/recommendations

GET    /api/admin/users
GET    /api/admin/crops
GET    /api/admin/parcels
GET    /api/admin/activities
DELETE /api/admin/users/{id}
DELETE /api/admin/crops/{id}
DELETE /api/admin/parcels/{id}
DELETE /api/admin/activities/{id}

GET    /api/data/export/crops
POST   /api/data/import/crops
GET    /api/data/export/parcels
POST   /api/data/import/parcels
GET    /api/data/export/activities
POST   /api/data/import/activities
GET    /api/data/export/excel
POST   /api/data/import/excel
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
Data Entry
Recommendations
Import / Export
Weather API
Admin
Login
Register
```

The frontend includes forms for entering agricultural data, pages for importing and exporting files, dashboard statistics, search/filter functionality, weather API data display, and a recommendation page that communicates with the backend.

Frontend URL:

```text
http://localhost:5173
```

---

## Machine Learning Module Overview

The machine learning module is implemented as a separate FastAPI service. It exposes an endpoint for generating predictions or recommendations based on agricultural and environmental input data.

Important ML endpoints:

```http
GET  /health
POST /predict
```

ML service URL:

```text
http://localhost:8000
```

If FastAPI documentation is enabled, it can be opened at:

```text
http://localhost:8000/docs
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
Swagger UI:      http://localhost:8080/swagger-ui.html
ML Service:      http://localhost:8000
ML Docs:         http://localhost:8000/docs
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

On Windows:

```powershell
cd backend
.\gradlew.bat bootRun
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

On Windows:

```powershell
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

If the main FastAPI file is named `app.py` instead of `app/main.py`, use:

```bash
uvicorn app:app --reload --port 8000
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

The backend can use environment variables for database and ML service configuration:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/agriculture_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=update
ML_SERVICE_URL=http://localhost:8000
```

When running with Docker Compose, the backend uses the internal Docker service names:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db:5432/agriculture_db
ML_SERVICE_URL=http://ml-service:8000
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
agriculture-data.xlsx
```

The Excel file contains separate sheets for:

```text
Crops
Parcels
Activities
```

CSV import examples:

### Crops CSV

```csv
name,type,plantingDate
Tomato,Vegetable,2026-05-15
Wheat,Cereal,2026-04-20
Apple,Fruit,2026-03-10
```

### Parcels CSV

```csv
location,size,soilType
Skopje,1200,Loamy
Bitola,850,Clay
Ohrid,600,Sandy
```

### Activities CSV

```csv
description,date,type
Morning irrigation,2026-05-15,Irrigation
Soil fertilization,2026-05-16,Fertilization
Pest inspection,2026-05-17,Protection
```

---

## Recommendation Request Example

The backend recommendation endpoint accepts agricultural and environmental input and forwards it to the ML service when available.

Endpoint:

```http
POST /api/recommendations
```

Example request body:

```json
{
  "cropType": "Tomato",
  "soilType": "Loamy",
  "temperature": 28,
  "humidity": 55,
  "rainfall": 8
}
```

Example response:

```json
{
  "recommendation": "Irrigation is recommended because temperature is high.",
  "source": "ML service or backend fallback",
  "mlServiceAvailable": true
}
```

---

## Weather API Example

The weather endpoint fetches weather data for selected coordinates.

Endpoint:

```http
GET /api/weather?latitude=41.9981&longitude=21.4254
```

Example use:

```text
Latitude: 41.9981
Longitude: 21.4254
```

These coordinates represent Skopje.

---

## Demonstration Flow

Recommended demonstration order:

1. Open the home page.
2. Register a new user.
3. Log in with the created user.
4. Add crop, parcel, and activity data.
5. Open the dashboard and show statistics.
6. Use the search/filter functionality.
7. Open the Weather API page and fetch weather data.
8. Open the Recommendations page and generate an AI-supported recommendation.
9. Export data as CSV or Excel.
10. Import sample CSV or Excel data.
11. Open the Admin page and show system records.

---

## Project Management Context

The project was developed through multiple weekly phases:

- Initial team organization and topic selection
- Jira and GitHub setup
- Backend and frontend structure setup
- Database schema development
- Login/register UI development
- CRUD functionality implementation
- ML module research and model service preparation
- Weather API research and integration
- Import/export implementation
- Final system integration and testing
- Final presentation preparation

---

## Prototype Notes

This project is a working academic prototype. The main system components are implemented and can be demonstrated locally or through Docker Compose.

Implemented parts include:

```text
Spring Boot backend
React frontend
PostgreSQL database connection
User registration and login
Crop, parcel and activity management
CSV and Excel import/export
Dashboard statistics
Search and filtering
Weather API integration
Recommendation interface
FastAPI ML prediction service
Basic admin panel
Docker Compose configuration
```

Some parts are implemented at prototype level and can be extended in future versions.

---

## Future Improvements

Possible improvements include:

- Full JWT-based authentication and authorization
- Role-based access control for admin functionality
- More advanced backend validation
- More detailed integration between weather data and recommendations
- Stronger integration between backend and ML service
- More detailed analytics dashboard
- Expanded automated testing
- Production deployment configuration
- Improved error handling and logging
- Improved UI feedback and loading states

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

```text
Status: Final academic prototype
Course: ICT Project Management
Team: 38
Theme: Artificial Intelligence in Agriculture
```