import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/index.js";
import { signCitizenToken, signAdminToken } from "../utils/jwt.js";

const router = Router();

/**
 * Citizen OTP SEND
 * body: { phone }
 */
router.post("/otp/send", async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length < 10) {
    return res.status(400).json({ ok: false, message: "Invalid phone" });
  }

  // Sandbox mode OTP
  if (process.env.OTP_MODE === "sandbox") {
    return res.json({ ok: true, mode: "sandbox", otp: "123456" });
  }

  // Later: integrate real SMS gateway
  return res.json({ ok: true, mode: "real", message: "OTP sent" });
});

/**
 * Citizen OTP VERIFY
 * body: { phone, otp, fullName? }
 */
router.post("/otp/verify", async (req, res) => {
  const { phone, otp, fullName } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ ok: false, message: "Missing fields" });
  }

  // Sandbox OTP check
  if (process.env.OTP_MODE === "sandbox" && otp !== "123456") {
    return res.status(401).json({ ok: false, message: "Invalid OTP" });
  }

  // Ensure citizen exists
  const existing = await pool.query("SELECT * FROM citizens WHERE phone=$1", [
    phone,
  ]);

  let citizen = existing.rows[0];

  if (!citizen) {
    const created = await pool.query(
      "INSERT INTO citizens (phone, full_name) VALUES ($1,$2) RETURNING *",
      [phone, fullName || null]
    );
    citizen = created.rows[0];
  }

  const token = signCitizenToken({
    type: "CITIZEN",
    citizenId: citizen.id,
    phone: citizen.phone,
  });

  res.json({
    ok: true,
    token,
    citizen: { id: citizen.id, phone: citizen.phone, fullName: citizen.full_name },
  });
});

/**
 * Admin login
 * body: { username, password }
 */
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM admin_users WHERE username=$1",
    [username]
  );

  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const token = signAdminToken({
    type: "ADMIN",
    adminId: user.id,
    username: user.username,
    role: user.role,
  });

  res.json({ ok: true, token, admin: { username: user.username, role: user.role } });
});

export default router;
