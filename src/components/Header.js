import React from "react";
import { useTheme } from "../store/ThemeContext";
import { THEMES } from "../config/themes";

export default function Header({ currentPage, setPage }) {
  const { themeId, setThemeId } = useTheme();

  const nav = [
    { id: "home", label: "Início", short: "⌂" },
    { id: "form", label: "Enviar Feedback", short: "✎" },
    { id: "dashboard", label: "Dashboard", short: "◆" },
  ];

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand" onClick={() => setPage("home")}>
          <span className="header__logo">◆</span>
          <div className="header__title-wrap">
            <span className="header__title">Feedback Hub</span>
            <span className="header__subtitle">Nexus Platform</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="header__nav">
          {nav.map((item) => (
            <button
              key={item.id}
              className={`header__nav-item ${currentPage === item.id ? "header__nav-item--active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile nav (visible only on small screens via CSS) */}
        <div className="header__mobile-nav">
          {nav.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav-btn ${currentPage === item.id ? "mobile-nav-btn--active" : ""}`}
              onClick={() => setPage(item.id)}
              title={item.label}
            >
              {item.short}
            </button>
          ))}
        </div>

        <div className="header__actions">
          <div className="theme-toggle">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                className={`theme-btn ${themeId === t.id ? "theme-btn--active" : ""}`}
                onClick={() => setThemeId(t.id)}
                title={t.label}
                aria-label={`Tema: ${t.label}`}
              >
                {t.id === "dark" ? "◐" : t.id === "light" ? "◑" : "⎔"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
