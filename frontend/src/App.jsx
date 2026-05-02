import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
      <BrowserRouter>
        <div className="app-container">
          <header className="hero-section">
            <h1>Intelligent Agriculture System</h1>
            <p className="subtitle">
              Team 38 project for agricultural data analysis and AI-based recommendations.
            </p>
            <nav>
              <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
            </nav>
          </header>

          <main className="content-section">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>© 2026 Team 38 – Intelligent Agriculture System</p>
          </footer>
        </div>
      </BrowserRouter>
  );
}

export default App;