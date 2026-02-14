import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

export default function Receipt() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { lastReceipt, resetSession, ticket } = useKioskStore();
  const printRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState("");

  async function fetchDocsOnce({ silent = false } = {}) {
    try {
      setDocsError("");

      const ticketId = ticket?.id || lastReceipt?.requestId;
      if (!ticketId) return;

      // ✅ Avoid flicker while polling
      if (!silent) setLoadingDocs(true);

      const res = await fetch(
        `http://localhost:5000/api/uploads/ticket/${ticketId}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to fetch documents");

      setDocs(data.documents || []);
    } catch (e) {
      setDocsError(e.message);
    } finally {
      if (!silent) setLoadingDocs(false);
    }
  }

  useEffect(() => {
    if (!lastReceipt) return;

    // First load shows loading
    fetchDocsOnce({ silent: false });

    const interval = setInterval(async () => {
      // Poll silently (no loading flicker)
      await fetchDocsOnce({ silent: true });
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.id, lastReceipt?.requestId]);

  // ✅ Now safe to return conditionally
  if (!lastReceipt) {
    return (
      <div className="page">
        <h1 className="title">No receipt found</h1>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Go Home
        </button>
      </div>
    );
  }

  const trackUrl = `https://suvidha.gov.in/track/${lastReceipt.requestId}`;

  const print = () => window.print();

  const finish = () => {
    resetSession();
    navigate("/language");
  };

  return (
    <div className="page">
      <h1 className="title">{t("receiptTitle")}</h1>
      <p className="muted">{t("receiptSubtitle")}</p>

      <div className="panel" ref={printRef}>
        <div className="receipt-head">
          <div>
            <div className="receipt-title">SUVIDHA</div>
            <div className="receipt-sub">Team MEGHNATH</div>
          </div>
          <QRCodeCanvas value={trackUrl} size={120} />
        </div>

        <div className="divider" />

        <div className="kv">
          <span>{t("requestId")}</span>
          <b>{lastReceipt.requestId}</b>
        </div>

        <div className="divider" />

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Uploaded Documents
          </div>

          {loadingDocs && <div className="muted">Loading...</div>}

          {!loadingDocs && docsError && (
            <div style={{ color: "#ffb4b4" }}>❌ {docsError}</div>
          )}

          {!loadingDocs && !docsError && docs.length === 0 && (
            <div className="muted">
              No documents uploaded yet. (Auto-sync every 3 sec)
            </div>
          )}

          {!loadingDocs && docs.length > 0 && (
            <div style={{ display: "grid", gap: 8 }}>
              {docs.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 10,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.file_name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {d.mime_type}
                    </div>
                  </div>

                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost"
                      style={{ textDecoration: "none" }}
                    >
                      Open
                    </a>
                  ) : (
                    <div className="muted">No link</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-ghost"
            onClick={() => fetchDocsOnce({ silent: false })}
          >
            Refresh documents
          </button>
        </div>

        <div className="divider" />
        <div className="hint">Track using QR / Request ID.</div>
      </div>

      <div className="row">
        <button className="btn btn-primary" onClick={print}>
          {t("printReceipt")}
        </button>

        <button className="btn btn-danger" onClick={finish}>
          {t("finishEndSession")}
        </button>
      </div>
    </div>
  );
}
