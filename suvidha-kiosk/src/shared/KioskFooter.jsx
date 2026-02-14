import React from "react";
import { useNavigate } from "react-router-dom";

export default function KioskFooter() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <button className="btn btn-ghost" onClick={() => navigate("/track")}>
        Track Status
      </button>
      <button className="btn btn-ghost" onClick={() => navigate("/alerts")}>
        City Alerts
      </button>
      <button className="btn btn-ghost" onClick={() => navigate("/admin/login")}>
        Admin
      </button>
    </footer>
  );
}
