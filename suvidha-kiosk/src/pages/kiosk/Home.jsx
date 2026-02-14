import React from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

const DEPTS = [
  { key: "electricity", labelKey: "deptElectricity", icon: "⚡" },
  { key: "gas", labelKey: "deptGas", icon: "🔥" },
  { key: "municipal", labelKey: "deptMunicipal", icon: "🏛️" },
];

export default function Home() {
  const navigate = useNavigate();
  const { setDepartment } = useKioskStore();
  const { t } = useTranslation();

  const open = (dept) => {
    setDepartment(dept);
    navigate(`/services/${dept}`);
  };

  return (
    <div className="page">
      <h1 className="title">{t("welcomeTitle")}</h1>
      <p className="muted">{t("welcomeSubtitle")}</p>

      <div className="grid">
        {DEPTS.map((d) => (
          <button key={d.key} className="card" onClick={() => open(d.key)}>
            <div className="card-title">
              <span style={{ fontSize: 28 }}>{d.icon}</span> {t(d.labelKey)}
            </div>
            <div className="card-sub">{t("tapToContinue")}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
