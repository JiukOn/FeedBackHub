import React, { useState } from "react";
import { ThemeProvider } from "./store/ThemeContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import DashboardPage from "./pages/DashboardPage";
import "./styles.css";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} />;
      case "form":
        return (
          <FormPage onSubmit={() => setPage("dashboard")} setPage={setPage} />
        );
      case "dashboard":
        return <DashboardPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Header currentPage={page} setPage={setPage} />
        <main className="main">{renderPage()}</main>
        <footer className="footer">
          <div className="footer__inner">
            <span>◆ Feedback Hub — Nexus Platform</span>
            <span className="footer__version">v1.2.0</span>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
