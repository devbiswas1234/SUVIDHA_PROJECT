import React from "react";
import { Link } from "react-router-dom";

export default function Analytics() {
  return (
    <div className="admin-page">
      <Link className="btn btn-ghost" to="/admin/dashboard">
        ← Dashboard
      </Link>

      <h1 className="title">Analytics</h1>
      <p className="muted">
        In final version: SLA charts, dept-wise tickets, ward heatmap, kiosk usage logs.
      </p>

      <div className="admin-grid">
        <div className="admin-ticket" style={{ cursor: "default" }}>
          <div className="receipt-title">Today Tickets</div>
          <div className="muted">128</div>
        </div>
        <div className="admin-ticket" style={{ cursor: "default" }}>
          <div className="receipt-title">Resolved</div>
          <div className="muted">74%</div>
        </div>
        <div className="admin-ticket" style={{ cursor: "default" }}>
          <div className="receipt-title">Avg SLA</div>
          <div className="muted">18 hours</div>
        </div>
      </div>
    </div>
  );
}
