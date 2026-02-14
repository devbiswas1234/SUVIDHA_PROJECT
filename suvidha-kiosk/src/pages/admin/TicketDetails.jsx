import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const STATUS = ["Submitted", "In Review", "Assigned", "Resolved"];

export default function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const [status, setStatus] = useState("In Review");
  const [remark, setRemark] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Change this if you store token somewhere else
  const adminToken = localStorage.getItem("adminToken");

  // -----------------------------
  // 1) Fetch ticket details
  // -----------------------------
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");

        if (!adminToken) {
          throw new Error("Admin token missing. Please login again.");
        }

        const res = await fetch(
          `http://localhost:5000/api/admin/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load ticket");
        }

        setTicket(data.ticket);
        setTimeline(data.timeline || []);

        // sync dropdown with real status
        setStatus(data.ticket.status || "In Review");
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, adminToken]);

  // -----------------------------
  // 2) Save update
  // -----------------------------
  async function saveUpdate() {
    try {
      setSaving(true);
      setErr("");

      if (!adminToken) {
        throw new Error("Admin token missing. Please login again.");
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/tickets/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status,
            remark,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update ticket");
      }

      // ✅ backend returns updated ticket + updated timeline
      setTicket(data.ticket);
      setTimeline(data.timeline || []);

      // reset remark box
      setRemark("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p className="muted">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="admin-page">
        <Link className="btn btn-ghost" to="/admin/dashboard">
          ← Back
        </Link>

        <div className="admin-card" style={{ marginTop: 14 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,0,0,0.12)",
            }}
          >
            ❌ {err}
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="admin-page">
        <Link className="btn btn-ghost" to="/admin/dashboard">
          ← Back
        </Link>

        <div className="admin-card" style={{ marginTop: 14 }}>
          <p className="muted">Ticket not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Link className="btn btn-ghost" to="/admin/dashboard">
        ← Back
      </Link>

      <h1 className="title">{ticket.id}</h1>
      <p className="muted">
        Phone: <b>{ticket.phone || "N/A"}</b> • Current Status:{" "}
        <b>{ticket.status}</b>
      </p>

      {/* Update panel */}
      <div className="admin-card" style={{ marginTop: 14 }}>
        <label className="label">Status</label>
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={saving}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="label">Remark</label>
        <textarea
          className="textarea"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Officer remark..."
          disabled={saving}
        />

        <button
          className="btn btn-primary"
          onClick={saveUpdate}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Update"}
        </button>
      </div>

      {/* Timeline */}
      <div className="admin-card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Timeline</h3>

        {timeline.length === 0 ? (
          <p className="muted">No timeline entries.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {timeline.map((t, idx) => (
              <div
                key={idx}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontWeight: 700 }}>{t.status}</div>
                <div style={{ opacity: 0.85, marginTop: 4 }}>{t.remark}</div>
                <div style={{ opacity: 0.6, fontSize: 12, marginTop: 6 }}>
                  {new Date(t.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
