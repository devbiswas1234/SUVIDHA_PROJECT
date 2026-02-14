import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useKioskStore } from "../store/kioskStore";

export default function TopBar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { language, citizen, resetSession } = useKioskStore();

  const goHome = () => navigate("/home");

  const logout = () => {
    resetSession();
    navigate("/language");
  };

  return (
    <header className="topbar">
      <div className="brand" onClick={goHome} role="button" tabIndex={0}>
        <div className="brand-title">SUVIDHA</div>
        <div className="brand-sub">Team MEGHNATH</div>
      </div>

      <div className="topbar-right">
        <div className="pill">
          {t("language")}: <b>{language.toUpperCase()}</b>
        </div>

        <button
          className="btn btn-ghost"
          onClick={() => {
            const next = prompt(
              "Change language: en / hi / mr / gu / ta / te / bn",
              i18n.language
            );
            if (!next) return;
            i18n.changeLanguage(next);
          }}
        >
          {t("changeLanguage")}
        </button>

        {citizen?.verified ? (
          <div className="pill">
            {t("loggedInAs")}: <b>{citizen.phone}</b>
          </div>
        ) : (
          <div className="pill">{t("guestMode")}</div>
        )}

        <button className="btn btn-danger" onClick={logout}>
          {t("endSession")}
        </button>
      </div>
    </header>
  );
}
