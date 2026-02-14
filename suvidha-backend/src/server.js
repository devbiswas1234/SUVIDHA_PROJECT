import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { dbHealthCheck } from "./db/index.js";

import authRoutes from "./routes/auth.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/uploads.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Serve uploads folder properly
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", async (req, res) => {
  try {
    const db = await dbHealthCheck();
    res.json({ ok: true, db });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SUVIDHA backend running on ${PORT}`));
