import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";
import { SERVICES } from "../../services/catalog";

export default function DepartmentServices() {
  const { dept } = useParams();
  const navigate = useNavigate();
  const { setService } = useKioskStore();
  const { t } = useTranslation();

  const items = SERVICES[dept] || [];

  const choose = (service) => {
    setService(service);
    navigate("/login");
  };

  return (
    <div className="page">
      <h1 className="title">{t("chooseService")}</h1>
      <p className="muted">{t("chooseServiceHint")}</p>

      <div className="grid">
        {items.map((s) => (
          <button key={s.id} className="card" onClick={() => choose(s)}>
            <div className="card-title">{t(s.labelKey)}</div>
            <div className="card-sub">
              {t("expectedTime")}: {s.slaHours}h
            </div>
          </button>
        ))}
      </div>

      <button className="btn btn-ghost" onClick={() => navigate("/home")}>
        ← {t("back")}
      </button>
    </div>
  );
}
