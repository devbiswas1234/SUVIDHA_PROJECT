import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TrackStatus() {
  const { t } = useTranslation();
  const [rid, setRid] = useState("");
  const [result, setResult] = useState(null);

  const track = () => {
    if (!rid.trim()) {
      alert(t("enterRequestId"));
      return;
    }

    // Demo timeline
    setResult({
      requestId: rid.trim(),
      steps: [
        { name: "Submitted", done: true },
        { name: "In Review", done: true },
        { name: "Assigned", done: false },
        { name: "Resolved", done: false },
      ],
    });
  };

  return (
    <div className="page">
      <h1 className="title">{t("trackTitle")}</h1>
      <p className="muted">{t("trackSubtitle")}</p>

      <div className="panel">
        <label className="label">{t("requestId")}</label>
        <input
          className="input"
          placeholder="SVD-123456"
          value={rid}
          onChange={(e) => setRid(e.target.value)}
        />

        <button className="btn btn-primary" onClick={track}>
          {t("track")}
        </button>

        {result ? (
          <div style={{ marginTop: 16 }}>
            <div className="divider" />
            <div className="receipt-title">
              {t("statusFor")} {result.requestId}
            </div>

            <div className="timeline">
              {result.steps.map((s) => (
                <div key={s.name} className={`step ${s.done ? "done" : ""}`}>
                  <div className="dot" />
                  <div>{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
