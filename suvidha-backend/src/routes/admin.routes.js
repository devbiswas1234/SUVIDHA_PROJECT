import { Router } from "express";
import { pool } from "../db/index.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

/**
 * List tickets
 */
router.get("/tickets", requireAdmin, async (req, res) => {
  const result = await pool.query(
    `SELECT t.id, t.status, t.department_id, t.service_id, t.created_at,
            c.phone
     FROM tickets t
     LEFT JOIN citizens c ON c.id = t.citizen_id
     ORDER BY t.created_at DESC
     LIMIT 200`
  );

  res.json({ ok: true, tickets: result.rows });
});

/**
 * Ticket details
 */
router.get("/tickets/:ticketId", requireAdmin, async (req, res) => {
  const { ticketId } = req.params;

  const ticketRes = await pool.query(
    `SELECT t.*, c.phone
     FROM tickets t
     LEFT JOIN citizens c ON c.id = t.citizen_id
     WHERE t.id=$1`,
    [ticketId]
  );

  const ticket = ticketRes.rows[0];
  if (!ticket) return res.status(404).json({ ok: false, message: "Not found" });

  const timelineRes = await pool.query(
    `SELECT status, remark, created_at 
     FROM ticket_timeline 
     WHERE ticket_id=$1 
     ORDER BY created_at ASC`,
    [ticketId]
  );

  res.json({ ok: true, ticket, timeline: timelineRes.rows });
});

/**
 * Update ticket status
 * body: { status, remark, assignedTo? }
 */
router.patch("/tickets/:ticketId/status", requireAdmin, async (req, res) => {
  const { ticketId } = req.params;
  const { status, remark, assignedTo } = req.body;

  const allowed = ["Submitted", "In Review", "Assigned", "Resolved"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ ok: false, message: "Invalid status" });
  }

  // 1) Update ticket main table
  const updated = await pool.query(
    `UPDATE tickets
     SET status=$1, assigned_to=COALESCE($2, assigned_to), updated_at=NOW()
     WHERE id=$3
     RETURNING *`,
    [status, assignedTo || null, ticketId]
  );

  const updatedTicket = updated.rows[0];

  if (!updatedTicket) {
    return res.status(404).json({ ok: false, message: "Ticket not found" });
  }

  // 2) Insert timeline entry
  const safeRemark =
    remark?.trim() ||
    `Status updated to "${status}" by ${req.admin?.username || "admin"}`;

  await pool.query(
    `INSERT INTO ticket_timeline (ticket_id, status, remark)
     VALUES ($1,$2,$3)`,
    [ticketId, status, safeRemark]
  );

  // 3) Return updated timeline also (IMPORTANT for frontend)
  const timelineRes = await pool.query(
    `SELECT status, remark, created_at
     FROM ticket_timeline
     WHERE ticket_id=$1
     ORDER BY created_at ASC`,
    [ticketId]
  );

  res.json({
    ok: true,
    ticket: updatedTicket,
    timeline: timelineRes.rows,
  });
});

export default router;
