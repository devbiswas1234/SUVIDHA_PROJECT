import express from "express";
import { handleMessage } from "../bot/flowEngine.js";

const router = express.Router();

const sessions = {};

router.post("/", async (req, res) => {
  const { message } = req.body;

  const text = message.toLowerCase();

  // 🔥 Detect Services
  if (text.includes("birth")) {
    return res.json({
      type: "service",
      service: "birth_certificate",
      redirect: "/birth-certificate",
    });
  }

  if (text.includes("complaint")) {
    return res.json({
      type: "service",
      service: "complaint",
      redirect: "/complaint",
    });
  }

  if (text.includes("status")) {
    return res.json({
      type: "service",
      service: "status",
      redirect: "/status",
    });
  }

  // Default fallback
  res.json({
    type: "text",
    reply: "I can help you with certificates, complaints, or status checks.",
  });
});

export default router;
