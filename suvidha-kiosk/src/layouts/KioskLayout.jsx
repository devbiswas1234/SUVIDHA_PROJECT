import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "../shared/TopBar";
import KioskFooter from "../shared/KioskFooter";
import { useKioskStore } from "../store/kioskStore";

export default function KioskLayout() {
  const navigate = useNavigate();
  const { resetSession, lastActivity, bumpActivity } = useKioskStore();

  // Auto logout after inactivity (2 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > 2 * 60 * 1000) {
        resetSession();
        navigate("/language");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [lastActivity, resetSession, navigate]);

  // Track touch/click activity
  useEffect(() => {
    const onAny = () => bumpActivity();
    window.addEventListener("click", onAny);
    window.addEventListener("touchstart", onAny);
    window.addEventListener("keydown", onAny);
    return () => {
      window.removeEventListener("click", onAny);
      window.removeEventListener("touchstart", onAny);
      window.removeEventListener("keydown", onAny);
    };
  }, [bumpActivity]);

  return (
    <div className="kiosk">
      <TopBar />
      <main className="kiosk-main">
        <Outlet />
      </main>
      <KioskFooter />
    </div>
  );
}
