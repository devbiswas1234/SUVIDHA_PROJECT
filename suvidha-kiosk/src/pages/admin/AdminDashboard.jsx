import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  async function fetchTickets() {
    try {
      setErr("");
      setLoading(true);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load tickets");
      }

      setTickets(data.tickets || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div>
          <div className="brand-title">SUVIDHA Admin</div>
          <div className="muted">Team MEGHNATH</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={fetchTickets}>
            Refresh
          </button>

          <Link className="btn btn-ghost" to="/admin/analytics">
            Analytics →
          </Link>

          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <div className="muted">Loading tickets...</div>}

      {!loading && err && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,0,0,0.12)",
            marginTop: 12,
          }}
        >
          ❌ {err}
        </div>
      )}

      {!loading && !err && tickets.length === 0 && (
        <div className="muted" style={{ marginTop: 14 }}>
          No tickets found.
        </div>
      )}

      {!loading && !err && tickets.length > 0 && (
        <div className="admin-grid">
          {tickets.map((t) => (
            <Link
              key={t.id}
              className="admin-ticket"
              to={`/admin/tickets/${t.id}`}
            >
              <div className="receipt-title">{t.id}</div>

              <div className="muted">
                Dept: {t.department_id} | Service: {t.service_id}
              </div>

              <div className="muted" style={{ fontSize: 12 }}>
                Citizen: {t.phone || "N/A"}
              </div>

              <div className="pill">{t.status}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
