import { pool } from "../../db.js";

export async function statusTrackingFlow(message, session) {
  const step = session.step;

  if (step === 0) {
      // If user already sent ID directly
    const id = message.trim().toUpperCase();
    if (id.startsWith("CMP") || id.startsWith("APP")) {
        session.step = 1;
        return await statusTrackingFlow(id, session);
    }
    session.step++;
    return {
      reply: "🔎 Enter your Complaint ID (CMPxxxxxx) or Application ID (APPxxxxxx):",
      done: false,
    };
  }

  if (step === 1) {
    const id = message.trim().toUpperCase();

    // Complaint check
    if (id.startsWith("CMP")) {
      const result = await pool.query(
        "SELECT status, complaint_type, created_at FROM complaints WHERE complaint_id=$1",
        [id]
      );

      if (result.rows.length === 0) {
        return { reply: "❌ Complaint ID not found.", done: true };
      }

      const row = result.rows[0];

      return {
        reply: `📌 Complaint Status  
ID: ${id}  
Type: ${row.complaint_type}  
Status: ${row.status}  
Created: ${new Date(row.created_at).toLocaleString()}`,
        done: true,
      };
    }

    // Application check
    if (id.startsWith("APP")) {
      const result = await pool.query(
        "SELECT status, application_type, created_at FROM applications WHERE application_id=$1",
        [id]
      );

      if (result.rows.length === 0) {
        return { reply: "❌ Application ID not found.", done: true };
      }

      const row = result.rows[0];

      return {
        reply: `📌 Application Status  
ID: ${id}  
Service: ${row.application_type}  
Status: ${row.status}  
Created: ${new Date(row.created_at).toLocaleString()}`,
        done: true,
      };
    }

    return { reply: "❌ Invalid ID format. Example: CMP123456 or APP123456", done: true };
  }

  return { reply: "Something went wrong.", done: true };
}
