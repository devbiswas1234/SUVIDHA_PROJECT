import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function login() {
    try {
      setErr("");
      setLoading(true);

      if (!user.trim() || !pass.trim()) {
        throw new Error("Username and password required.");
      }

      const res = await fetch("http://localhost:5000/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.trim(),
          password: pass.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // ✅ store token for requireAdmin routes
      localStorage.setItem("adminToken", data.token);

      // optional: store admin info
      if (data.admin) {
        localStorage.setItem("adminUser", JSON.stringify(data.admin));
      }

      navigate("/admin/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1 className="title">SUVIDHA Admin</h1>
        <p className="muted">Login to manage tickets and kiosk operations.</p>

        <label className="label">Username</label>
        <input
          className="input"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          disabled={loading}
        />

        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          disabled={loading}
        />

        {err && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,0,0,0.12)",
            }}
          >
            ❌ {err}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={login}
          disabled={loading}
          style={{ marginTop: 12 }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
