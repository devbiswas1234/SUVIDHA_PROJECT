import { pool } from "../../db.js";
import { generateId } from "../../utils/idGenerator.js";

export async function birthCertFlow(message, session) {
  const step = session.step;

  if (step === 0) {
    session.step++;
    return {
      reply: `🧾 Birth Certificate Application  
Choose option:
1) Required Documents  
2) Apply Now`,
      done: false,
    };
  }

  if (step === 1) {
    const msg = message.toLowerCase();

    if (msg.includes("1") || msg.includes("document")) {
      return {
        reply: `📌 Required Documents:
• Hospital Birth Proof  
• Parents Aadhaar  
• Address Proof  
• Mobile Number  

Type "apply" to register application.`,
        done: false,
      };
    }

    if (msg.includes("2") || msg.includes("apply")) {
      session.step++;
      return { reply: "Enter Child Full Name:", done: false };
    }

    return { reply: "Please type 1 or 2.", done: false };
  }

  if (step === 2) {
    session.data.childName = message;
    session.step++;
    return { reply: "Enter Date of Birth (DD/MM/YYYY):", done: false };
  }

  if (step === 3) {
    session.data.dob = message;
    session.step++;
    return { reply: "Enter Parent Mobile Number:", done: false };
  }

  if (step === 4) {
    session.data.phone = message;

    const appId = generateId("APP");

    await pool.query(
      `INSERT INTO applications 
      (application_id, application_type, applicant_name, details, phone)
      VALUES ($1, $2, $3, $4, $5)`,
      [
        appId,
        "Birth Certificate",
        session.data.childName,
        { dob: session.data.dob },
        session.data.phone,
      ]
    );

    return {
      reply: `✅ Application Submitted!\nApplication ID: ${appId}\n\nType: "Application status ${appId}" to track.`,
      done: true,
    };
  }

  return { reply: "Something went wrong.", done: true };
}
