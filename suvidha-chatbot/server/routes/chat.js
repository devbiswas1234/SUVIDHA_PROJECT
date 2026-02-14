import express from "express";
import { handleMessage } from "../bot/flowEngine.js";

const router = express.Router();

const sessions = {};

router.post("/", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message required" });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = { currentFlow: null, step: 0, data: {} };
  }

  const reply = await handleMessage(message, sessions[sessionId]);

  res.json({
    reply,
    session: sessions[sessionId],
  });
});

export default router;
