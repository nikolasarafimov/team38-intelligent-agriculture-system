import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import CropForm from "./pages/CropFormPage.jsx";
import Recommendations from "./pages/RecommendationsPage.jsx";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

function LandingPage() {
  return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="nav">
            <div className="navbar-nav">
              <Link className="nav-link" to="/">
                Home
              </Link>
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
              <Link className="nav-link" to="/recommendations">
                Recommendations
              </Link>
              <Link className="nav-link" to="/cropform">
                Add Crop
              </Link>
            </div>
          </div>

          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/auth/login">
              Login
            </Link>
            <Link className="nav-link" to="/auth/register">
              Register
            </Link>
          </div>
        </nav>

        <div className="app-container">
          <header className="hero-section">
            <h1>Intelligent Agriculture System</h1>
            <p className="subtitle">
              Team 38 project for agricultural data analysis and AI-based recommendations.
            </p>
          </header>

          <main className="content-section">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cropform" element={<CropForm />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>© 2026 Team 38 – Intelligent Agriculture System</p>
          </footer>
        </div>
      </>
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