import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, switchText, switchLinkText, switchTo, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <h1>Intelligent Agriculture System</h1>
        <p>
          Organize crop data, monitor progress, and prepare recommendations from one
          clean dashboard.
        </p>
      </div>

      <section className="auth-card" aria-label={title}>
        <header className="auth-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </header>

        {children}

        <p className="auth-switch">
          {switchText} <Link to={switchTo}>{switchLinkText}</Link>
        </p>
      </section>
    </div>
  );
}

export default AuthLayout;
