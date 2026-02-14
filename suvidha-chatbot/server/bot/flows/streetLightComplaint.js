import { pool } from "../../db.js";
import { generateId } from "../../utils/idGenerator.js";

export async function streetLightFlow(message, session) {
  const step = session.step;

  if (step === 0) {
    session.step++;
    return { reply: "⚡ Street Light Complaint\nEnter your area/locality:", done: false };
  }

  if (step === 1) {
    session.data.area = message;
    session.step++;
    return { reply: "Enter nearby landmark:", done: false };
  }

  if (step === 2) {
    session.data.landmark = message;
    session.step++;
    return { reply: "Describe the issue:", done: false };
  }

  if (step === 3) {
    session.data.description = message;
    session.step++;
    return { reply: "Enter your mobile number:", done: false };
  }

  if (step === 4) {
    session.data.phone = message;

    const complaintId = generateId("CMP");

    await pool.query(
      `INSERT INTO complaints 
      (complaint_id, complaint_type, area, landmark, description, phone)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        complaintId,
        "Street Light Not Working",
        session.data.area,
        session.data.landmark,
        session.data.description,
        session.data.phone,
      ]
    );

    return {
      reply: `✅ Complaint Registered Successfully!\nComplaint ID: ${complaintId}\n\nType: "Complaint status ${complaintId}" anytime to track.`,
      done: true,
    };
  }

  return { reply: "Something went wrong.", done: true };
}
