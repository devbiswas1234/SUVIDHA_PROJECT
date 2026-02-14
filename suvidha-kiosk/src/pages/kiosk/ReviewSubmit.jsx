import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

export default function ReviewSubmit() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    department,
    service,
    formData,
    citizen,
    token,
    setLastReceipt,
    setTicket,
  } = useKioskStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    try {
      setErr("");

      if (!token) throw new Error("Citizen token missing. Please login again.");
      if (!department?.id) throw new Error("Department missing.");
      if (!service?.id) throw new Error("Service missing.");
      if (!citizen?.phone) throw new Error("Citizen phone missing.");

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departmentId: department.id,
          serviceId: service.id,

          // OPTIONAL FIELDS (from formData)
          title: formData?.title || formData?.subject || null,
          description: formData?.description || formData?.details || null,
          ward: formData?.ward || null,
          address: formData?.address || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Ticket creation failed");
      }

      const ticket = data.ticket;

      // Save ticket in store (needed for QR upload + receipt doc fetch)
      setTicket(ticket);

      // Create receipt using REAL ticket id
      const receipt = {
        requestId: ticket.id,
        serviceName: service?.labelKey,
        phone: citizen.phone,
        date: new Date().toLocaleString(),
        status: ticket.status || "Submitted",
      };

      setLastReceipt(receipt);

      navigate("/upload-qr");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="title">{t("reviewTitle")}</h1>
      <p className="muted">{t("reviewSubtitle")}</p>

      <div className="panel">
        {!!err && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,0,0,0.12)",
              marginBottom: 12,
            }}
          >
            ❌ {err}
          </div>
        )}

        <div className="kv">
          <span>{t("service")}</span>
          <b>{service ? t(service.labelKey) : "N/A"}</b>
        </div>

        <div className="kv">
          <span>{t("mobileNumber")}</span>
          <b>{citizen.phone}</b>
        </div>

        <div className="divider" />

        {Object.entries(formData || {}).map(([k, v]) => (
          <div className="kv" key={k}>
            <span>{k}</span>
            <b>{String(v || "-")}</b>
          </div>
        ))}

        <button
          className="btn btn-primary"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting..." : t("submitRequest")}
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => navigate("/upload-qr")}
          disabled={loading}
        >
          ← {t("back")}
        </button>
      </div>
    </div>
  );
}
