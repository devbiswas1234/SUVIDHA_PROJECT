import { Router } from "express";
import { pool } from "../db/index.js";

const router = Router();

// Get departments
router.get("/departments", async (req, res) => {
  const result = await pool.query("SELECT * FROM departments ORDER BY name ASC");
  res.json(result.rows);
});

// Get services for a department
router.get("/services/:deptId", async (req, res) => {
  const { deptId } = req.params;

  const result = await pool.query(
    "SELECT * FROM services WHERE department_id=$1 ORDER BY name ASC",
    [deptId]
  );

  res.json(result.rows);
});

export default router;
