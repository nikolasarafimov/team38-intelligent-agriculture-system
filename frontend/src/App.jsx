import "./App.css";
import { NavLink, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import CropForm from "./pages/CropFormPage.jsx";
import Recommendations from "./pages/RecommendationsPage.jsx";
import ImportExportPage from "./pages/ImportExportPage.jsx";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

function LandingPage() {
  return (
      <div className="app-container">
        <nav className="app-navbar">
          <div className="navbar-brand">
            <span className="brand-icon">🌱</span>
            <div>
              <h1>AgriSense AI</h1>
              <p>Team 38 Intelligent Agriculture System</p>
            </div>
          </div>

          <div className="navbar-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink to="/cropform">
              Add Crop
            </NavLink>
            <NavLink to="/recommendations">
              Recommendations
            </NavLink>
            <NavLink to="/import-export">
              Import / Export
            </NavLink>
          </div>

          <div className="navbar-auth">
            <NavLink to="/auth/login" className="auth-link">
              Login
            </NavLink>
            <NavLink to="/auth/register" className="auth-button">
              Register
            </NavLink>
          </div>
        </nav>

        <header className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">AI in Agriculture · Team 38</span>
            <h2>Intelligent Agriculture System</h2>
            <p>
              A web-based platform for managing agricultural data, analyzing soil and crop
              conditions, importing/exporting records, and generating AI-supported
              recommendations.
            </p>
            <div className="hero-actions">
              <NavLink to="/dashboard" className="primary-action">
                View Dashboard
              </NavLink>
              <NavLink to="/cropform" className="secondary-action">
                Add Crop Data
              </NavLink>
            </div>
          </div>
        </header>

        <main className="content-section">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cropform" element={<CropForm />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/import-export" element={<ImportExportPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2026 Team 38 – Intelligent Agriculture System</p>
        </footer>
      </div>
  );
}

function App() {
  return (
      <Routes>
        <Route path="/*" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Routes>
  );
}

export default App;