import { pool } from "../../db.js";
import { generateId } from "../../utils/idGenerator.js";

export async function genericComplaintFlow(message, session) {
  const step = session.step;

  // STEP 0 → Ask Area
  if (step === 0) {
    session.step++;
    return {
      reply: `📝 ${session.data.complaintType || "Complaint"}\nEnter your area/locality:`,
      done: false,
    };
  }

  // STEP 1 → Save Area
  if (step === 1) {
    session.data.area = message.trim();
    session.step++;
    return {
      reply: "Enter nearby landmark (optional, type NA if none):",
      done: false,
    };
  }

  // STEP 2 → Save Landmark
  if (step === 2) {
    session.data.landmark = message.trim();
    session.step++;
    return {
      reply: "Describe the issue in detail:",
      done: false,
    };
  }

  // STEP 3 → Save Description
  if (step === 3) {
    session.data.description = message.trim();
    session.step++;
    return {
      reply: "Enter your mobile number:",
      done: false,
    };
  }

  // STEP 4 → Save Phone + Insert into DB
  if (step === 4) {
    session.data.phone = message.trim();

    const complaintId = generateId("CMP");

    try {
      await pool.query(
        `INSERT INTO complaints
        (complaint_id, complaint_type, area, landmark, description, phone, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          complaintId,
          session.data.complaintType || "General Complaint",
          session.data.area,
          session.data.landmark,
          session.data.description,
          session.data.phone,
          "Submitted", // default status
        ]
      );

      return {
        reply: `✅ Complaint Registered Successfully!\n\nComplaint ID: ${complaintId}\nStatus: Submitted\n\nYou can type this ID anytime to track status.`,
        done: true,
      };
    } catch (error) {
      console.error("DB Insert Error:", error);
      return {
        reply: "⚠️ Something went wrong while saving complaint. Please try again.",
        done: true,
      };
    }
  }

  return { reply: "Something went wrong.", done: true };
}
