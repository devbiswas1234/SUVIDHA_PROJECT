import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKioskStore } from "../../store/kioskStore";
import { useTranslation } from "react-i18next";

export default function OTPVerify() {
  const navigate = useNavigate();
  const { citizen, setCitizenVerified, setToken } = useKioskStore();
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    try {
      if (!otp) return alert("Enter OTP");

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: citizen.phone,
          otp,
          fullName: "", // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "OTP verification failed");
      }

      // IMPORTANT
      setToken(data.token);
      setCitizenVerified(true);

      navigate("/form");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="title">{t("otpTitle")}</h1>
      <p className="muted">
        {t("otpSentTo")} <b>{citizen.phone}</b>
      </p>

      <div className="panel">
        <label className="label">{t("enterOTP")}</label>
        <input
          className="input"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.trim())}
        />

        <button className="btn btn-primary" onClick={verify} disabled={loading}>
          {loading ? "Verifying..." : t("verifyContinue")}
        </button>

        <div className="hint">
          For demo: OTP is <b>123456</b>
        </div>
      </div>
    </div>
  );
}
