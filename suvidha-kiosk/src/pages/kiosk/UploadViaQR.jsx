import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useKioskStore } from "../../store/kioskStore";

export default function UploadViaQR() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { citizen, service, ticket } = useKioskStore();

  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // QR opens this URL on phone
  const phoneUploadUrl = useMemo(() => {
    if (!sessionId) return "";
    return `http://localhost:5173/upload/${sessionId}`;
  }, [sessionId]);

  // ✅ Create upload session
  useEffect(() => {
    async function createSession() {
      try {
        setLoading(true);
        setErr("");

        // Guard: must have ticket
        if (!ticket?.id) {
          navigate("/review", { replace: true });
          return;
        }

        if (!citizen?.phone) throw new Error("Citizen phone missing.");
        if (!service?.id) throw new Error("Service missing.");

        const res = await fetch("http://localhost:5000/api/uploads/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticketId: ticket.id,
            citizenPhone: citizen.phone,
            serviceId: service.id,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to create upload session");
        }

        setSessionId(data.session.id);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    createSession();
  }, [ticket?.id, citizen?.phone, service?.id, navigate]);

  // ✅ AUTO: detect if phone uploaded docs, then go to receipt
  useEffect(() => {
    if (!ticket?.id) return;

    let interval = null;

    async function checkDocs() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/uploads/ticket/${ticket.id}`
        );

        const data = await res.json();

        if (res.ok && Array.isArray(data.documents) && data.documents.length > 0) {
          navigate("/receipt", { replace: true });
        }
      } catch {
        // ignore (kiosk will keep polling)
      }
    }

    interval = setInterval(checkDocs, 2500);
    checkDocs();

    return () => clearInterval(interval);
  }, [ticket?.id, navigate]);

  return (
    <div className="page">
      <h1 className="title">{t("uploadDocsTitle")}</h1>
      <p className="muted">{t("uploadDocsSubtitle")}</p>

      <div className="panel center">
        {loading && <div className="muted">Creating secure upload link...</div>}

        {!loading && err && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,0,0,0.12)",
              maxWidth: 700,
            }}
          >
            ❌ {err}
          </div>
        )}

        {!loading && !err && sessionId && (
          <>
            <QRCodeCanvas value={phoneUploadUrl} size={220} />

            <div className="hint" style={{ marginTop: 12 }}>
              Scan QR with phone → upload documents → kiosk will auto-sync.
            </div>

            <div className="pill" style={{ maxWidth: 700 }}>
              {phoneUploadUrl}
            </div>

            <div className="muted" style={{ marginTop: 10 }}>
              Waiting for upload...
            </div>
          </>
        )}

        <button
          className="btn btn-primary"
          onClick={() => navigate("/receipt")}
          disabled={loading}
        >
          {t("doneContinue")}
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => navigate("/review")}
          disabled={loading}
        >
          ← {t("back")}
        </button>
      </div>
    </div>
  );
}
