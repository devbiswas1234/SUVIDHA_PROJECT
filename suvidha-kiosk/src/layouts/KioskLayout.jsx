import React, { useEffect, useState } from "react";
import Chatbot from "../pages/Chatbot";
import styles from "../styles/ChatWidget.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "../shared/TopBar";
import KioskFooter from "../shared/KioskFooter";
import { useKioskStore } from "../store/kioskStore";

export default function KioskLayout() {
  const navigate = useNavigate();
  const { resetSession, lastActivity, bumpActivity } = useKioskStore();

  const [isChatOpen, setIsChatOpen] = useState(false);

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

  // Track activity
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        className={styles.chatButton}
      >
        🗨
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>Suvidha Assistant</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          <div className={styles.chatContent}>
            <Chatbot />
          </div>
        </div>
      )}
    </div>
  );
}
