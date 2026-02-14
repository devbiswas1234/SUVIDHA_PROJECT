import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const { setCitizenPhone } = useKioskStore();
  const { t } = useTranslation();

  const [phone, setPhone] = useState("");

  const sendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert(t("invalidPhone"));
      return;
    }
    setCitizenPhone(phone);
    navigate("/otp");
  };

  return (
    <div className="page">
      <h1 className="title">{t("loginTitle")}</h1>
      <p className="muted">{t("loginSubtitle")}</p>

      <div className="panel">
        <label className="label">{t("mobileNumber")}</label>
        <input
          className="input"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value.trim())}
        />

        <button className="btn btn-primary" onClick={sendOTP}>
          {t("sendOTP")}
        </button>

        <div className="hint">
          Demo OTP mode is enabled for now (free). Later we will plug real SMS.
        </div>
      </div>
    </div>
  );
}
