import { useState } from "react";
import "./App.css";
import { NavLink, Routes, Route, useLocation } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import CropForm from "./pages/CropFormPage.jsx";
import Recommendations from "./pages/RecommendationsPage.jsx";
import ImportExportPage from "./pages/ImportExportPage.jsx";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const showHero = location.pathname === "/";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
      <div className="app-container">
        <nav className="app-navbar">
          <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
            <img
                src="/agriculture-icon.png"
                alt="AgriSense AI logo"
                className="brand-logo"
            />
            <div>
              <h1>AgriSense AI</h1>
              <p>Intelligent Agriculture System</p>
            </div>
          </NavLink>

          <button
              className={`mobile-menu-toggle ${menuOpen ? "open" : ""}`}
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
            <div className="navbar-links">
              <NavLink to="/" end onClick={closeMenu}>
                Home
              </NavLink>

              <NavLink to="/dashboard" onClick={closeMenu}>
                Dashboard
              </NavLink>

              <NavLink to="/cropform" onClick={closeMenu}>
                Add Crop
              </NavLink>

              <NavLink to="/recommendations" onClick={closeMenu}>
                Recommendations
              </NavLink>

              <NavLink to="/import-export" onClick={closeMenu}>
                Import / Export
              </NavLink>
            </div>

            <div className="navbar-auth">
              <NavLink to="/auth/login" className="auth-link" onClick={closeMenu}>
                Login
              </NavLink>

              <NavLink
                  to="/auth/register"
                  className="auth-button"
                  onClick={closeMenu}
              >
                Register
              </NavLink>
            </div>
          </div>
        </nav>

        {showHero && (
            <header className="hero-section">
              <div className="hero-content">
                <span className="hero-badge">AI in Agriculture · Team 38</span>
                <h2>Intelligent Agriculture System</h2>
                <p>
                  A web-based platform for managing agricultural data, analyzing soil
                  and crop conditions, importing/exporting records, and generating
                  AI-supported irrigation recommendations.
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
        )}

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
          <p>© 2026 – Intelligent Agriculture System</p>
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