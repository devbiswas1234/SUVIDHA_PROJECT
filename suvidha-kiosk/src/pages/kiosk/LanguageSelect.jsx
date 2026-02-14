import React from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
];

export default function LanguageSelect() {
  const navigate = useNavigate();
  const { setLanguage, resetSession } = useKioskStore();
  const { i18n, t } = useTranslation();

  const choose = (code) => {
    resetSession();
    setLanguage(code);
    i18n.changeLanguage(code);
    navigate("/home");
  };

  return (
    <div className="page">
      <h1 className="title">{t("chooseLanguage")}</h1>
      <p className="muted">{t("languageHint")}</p>

      <div className="grid">
        {LANGS.map((l) => (
          <button key={l.code} className="card" onClick={() => choose(l.code)}>
            <div className="card-title">{l.label}</div>
            <div className="card-sub">{l.code.toUpperCase()}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
