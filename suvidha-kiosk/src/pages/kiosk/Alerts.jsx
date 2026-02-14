import React from "react";
import { useTranslation } from "react-i18next";

const ALERTS = [
  { type: "Electricity", msg: "Planned outage in Ward 12 from 2PM–4PM." },
  { type: "Water", msg: "Water supply delayed due to pipeline maintenance." },
  { type: "Gas", msg: "Safety advisory: Check regulator for leakage." },
  { type: "Municipal", msg: "Waste pickup schedule updated for Zone B." },
];

export default function Alerts() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <h1 className="title">{t("alertsTitle")}</h1>
      <p className="muted">{t("alertsSubtitle")}</p>

      <div className="grid">
        {ALERTS.map((a, idx) => (
          <div key={idx} className="card" style={{ cursor: "default" }}>
            <div className="card-title">{a.type}</div>
            <div className="card-sub">{a.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
