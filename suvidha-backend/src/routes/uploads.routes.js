import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { pool } from "../db/index.js";

const router = Router();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    cb(null, Date.now() + "_" + safeName);
  },
});

const upload = multer({ storage });

/**
 * Create upload session (called by kiosk)
 * body: { ticketId, citizenPhone, serviceId }
 */
router.post("/session", async (req, res) => {
  try {
    const { ticketId, citizenPhone, serviceId } = req.body;

    if (!citizenPhone || !serviceId) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    // ✅ 10 minutes expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO upload_sessions 
        (ticket_id, citizen_phone, service_id, is_active, expires_at)
       VALUES ($1,$2,$3,true,$4)
       RETURNING *`,
      [ticketId || null, citizenPhone, serviceId, expiresAt]
    );

    res.json({ ok: true, session: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * Upload documents from phone
 * POST /api/uploads/:sessionId
 * form-data: files[] (max 5)
 */
router.post("/:sessionId", upload.array("files", 5), async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sessionRes = await pool.query(
      `SELECT * FROM upload_sessions
       WHERE id=$1 AND is_active=true AND expires_at > NOW()`,
      [sessionId]
    );

    const session = sessionRes.rows[0];

    // ✅ Expired / invalid session
    if (!session) {
      return res.status(410).json({
        ok: false,
        message: "Upload session expired. Please rescan QR from kiosk.",
      });
    }

    const ticketId = session.ticket_id;

    if (!ticketId) {
      return res.status(400).json({
        ok: false,
        message: "Ticket not linked yet. Submit ticket first from kiosk.",
      });
    }

    // ✅ No files case
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No files received",
      });
    }

    const savedDocs = [];

    for (const file of req.files) {
      const doc = await pool.query(
        `INSERT INTO documents (ticket_id, file_name, mime_type, file_path)
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
        [
          ticketId,
          file.originalname,
          file.mimetype,
          file.filename, // ✅ IMPORTANT FIX: store filename only
        ]
      );

      savedDocs.push(doc.rows[0]);
    }

    // ✅ make session one-time use
    await pool.query("UPDATE upload_sessions SET is_active=false WHERE id=$1", [
      sessionId,
    ]);

    res.json({ ok: true, uploaded: savedDocs });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * Get documents for ticket (kiosk/admin)
 */
router.get("/ticket/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    const docs = await pool.query(
      "SELECT * FROM documents WHERE ticket_id=$1 ORDER BY uploaded_at DESC",
      [ticketId]
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // ✅ Correct URL: /uploads/filename
    const mapped = docs.rows.map((d) => ({
      ...d,
      url: `${baseUrl}/uploads/${d.file_path}`,
    }));

    res.json({ ok: true, documents: mapped });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

export default router;
