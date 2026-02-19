import { pool } from "../../db.js";
import { generateId } from "../../utils/idGenerator.js";

export async function genericCertificateFlow(message, session) {
  const step = session.step;

  // STEP 0 → Ask Name
  if (step === 0) {
    session.step = 1;
    return {
      reply: `📄 ${session.data.certificateType}\n\nEnter your full name:`,
      done: false,
    };
  }

  // STEP 1 → Save Name
  if (step === 1) {
    session.data.fullName = message.trim();
    session.step = 2;
    return {
      reply: "Enter Father’s / Husband’s Name:",
      done: false,
    };
  }

  // STEP 2 → Save Parent Name
  if (step === 2) {
    session.data.parentName = message.trim();
    session.step = 3;
    return {
      reply: "Enter Date of Birth (YYYY-MM-DD):",
      done: false,
    };
  }

  // STEP 3 → Save DOB
  if (step === 3) {
    session.data.dob = message.trim();
    session.step = 4;
    return {
      reply: "Enter your full address:",
      done: false,
    };
  }

  // STEP 4 → Save Address
  if (step === 4) {
    session.data.address = message.trim();
    session.step = 5;
    return {
      reply: "Enter your 10-digit mobile number:",
      done: false,
    };
  }

  // STEP 5 → Save Phone & Insert into DB
  if (step === 5) {
    const phone = message.trim();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return {
        reply: "⚠️ Please enter a valid 10-digit mobile number.",
        done: false,
      };
    }

    session.data.phone = phone;

    const applicationId = generateId("CERT");

    try {
      await pool.query(
        `INSERT INTO certificates
        (application_id, certificate_type, full_name, parent_name, dob, address, phone, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          applicationId,
          session.data.certificateType,
          session.data.fullName,
          session.data.parentName,
          session.data.dob,
          session.data.address,
          session.data.phone,
          "Submitted",
        ]
      );

      return {
        reply: `✅ Application Submitted Successfully!

Application ID: ${applicationId}
Status: Submitted

You can type this ID anytime to track status.`,
        done: true,
      };
    } catch (error) {
      console.error("Certificate Insert Error:", error);
      return {
        reply: "⚠️ Something went wrong while saving application.",
        done: true,
      };
    }
  }

  return { reply: "Something went wrong.", done: true };
}
