import { Router } from "express";
import { pool } from "../db/index.js";
import { requireCitizen } from "../middlewares/auth.js";

const router = Router();

function makeTicketId() {
  return "SVD-" + Math.floor(100000 + Math.random() * 900000);
}

/**
 * Create ticket
 * body: { departmentId, serviceId, title, description, ward, address }
 */
router.post("/", requireCitizen, async (req, res) => {
  console.log("HIT /api/tickets", req.body);
  const citizenId = req.citizen.citizenId;

  const { departmentId, serviceId, title, description, ward, address } = req.body;

  if (!departmentId || !serviceId) {
    return res.status(400).json({ ok: false, message: "Missing service info" });
  }

  const ticketId = makeTicketId();

  const created = await pool.query(
    `INSERT INTO tickets
      (id, citizen_id, department_id, service_id, title, description, ward, address, status)
     VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,'Submitted')
     RETURNING *`,
    [
      ticketId,
      citizenId,
      departmentId,
      serviceId,
      title || null,
      description || null,
      ward || null,
      address || null,
    ]
  );

  await pool.query(
    `INSERT INTO ticket_timeline (ticket_id, status, remark)
     VALUES ($1,'Submitted','Ticket created from kiosk')`,
    [ticketId]
  );

  res.json({ ok: true, ticket: created.rows[0] });
});

/**
 * Track ticket by id
 */
router.get("/:ticketId", async (req, res) => {
  const { ticketId } = req.params;

  const ticketRes = await pool.query("SELECT * FROM tickets WHERE id=$1", [
    ticketId,
  ]);

  const ticket = ticketRes.rows[0];
  if (!ticket) return res.status(404).json({ ok: false, message: "Not found" });

  const timelineRes = await pool.query(
    "SELECT status, remark, created_at FROM ticket_timeline WHERE ticket_id=$1 ORDER BY created_at ASC",
    [ticketId]
  );

  res.json({ ok: true, ticket, timeline: timelineRes.rows });
});

export default router;
