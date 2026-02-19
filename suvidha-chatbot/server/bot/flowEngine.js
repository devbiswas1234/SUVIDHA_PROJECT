import { detectIntent } from "./intents.js";
import { statusTrackingFlow } from "./flows/statusTracking.js";
import { genericComplaintFlow } from "./flows/genericComplaint.js";
import { genericCertificateFlow } from "./flows/genericCertificateFlow.js";

const flowMap = {
  // Complaints
  COMPLAINT_GARBAGE: genericComplaintFlow,
  COMPLAINT_STREET_LIGHT: genericComplaintFlow,
  COMPLAINT_ROAD: genericComplaintFlow,
  COMPLAINT_WATER_LEAK: genericComplaintFlow,
  COMPLAINT_DRAINAGE: genericComplaintFlow,
  COMPLAINT_ELECTRICITY: genericComplaintFlow,
  COMPLAINT_NUISANCE: genericComplaintFlow,
  COMPLAINT_ENCROACHMENT: genericComplaintFlow,
  COMPLAINT_TRAFFIC: genericComplaintFlow,
  COMPLAINT_STRAY_ANIMAL: genericComplaintFlow,

  // Certificates
  CERT_BIRTH: genericCertificateFlow,
  CERT_INCOME: genericCertificateFlow,
  CERT_CASTE: genericCertificateFlow,
  CERT_DOMICILE: genericCertificateFlow,
  CERT_CHARACTER: genericCertificateFlow,
  CERT_DEATH: genericCertificateFlow,
  CERT_MARRIAGE: genericCertificateFlow,

  // Tracking
  STATUS_TRACKING: statusTrackingFlow,
};

export async function handleMessage(message, session) {
  if (!session.currentFlow) {
    const intent = detectIntent(message);

    if (!intent) {
      return `I didn’t understand 😅  
You can type like:  
• Birth Certificate  
• Street Light Complaint  
• Garbage Complaint  
• Check Status`;
    }

    session.currentFlow = intent;
    session.step = 0;
    session.data = {};

    // Complaint mapping
    if (intent.startsWith("COMPLAINT_")) {
      const map = {
        COMPLAINT_GARBAGE: "Garbage Pickup Complaint",
        COMPLAINT_STREET_LIGHT: "Street Light Not Working",
        COMPLAINT_ROAD: "Road Damage Complaint",
        COMPLAINT_WATER_LEAK: "Water Leakage Complaint",
        COMPLAINT_DRAINAGE: "Drainage Blockage Complaint",
        COMPLAINT_ELECTRICITY: "Electricity Bill Complaint",
        COMPLAINT_NUISANCE: "Public Nuisance Complaint",
        COMPLAINT_ENCROACHMENT: "Encroachment Complaint",
        COMPLAINT_TRAFFIC: "Traffic Signal Issue",
        COMPLAINT_STRAY_ANIMAL: "Stray Animal Complaint",
      };

      session.data.complaintType = map[intent] || "General Complaint";
    }

    // Certificate mapping
    if (intent.startsWith("CERT_")) {
      const map = {
        CERT_BIRTH: "Birth Certificate",
        CERT_INCOME: "Income Certificate",
        CERT_CASTE: "Caste Certificate",
        CERT_DOMICILE: "Domicile Certificate",
        CERT_CHARACTER: "Character Certificate",
        CERT_DEATH: "Death Certificate",
        CERT_MARRIAGE: "Marriage Certificate",
      };

      session.data.certificateType = map[intent] || "Certificate";
    }
  }

  const flowHandler = flowMap[session.currentFlow];

  if (!flowHandler) {
    session.currentFlow = null;
    return "This service is not configured yet.";
  }

  const result = await flowHandler(message, session);

  if (result.done) {
    session.currentFlow = null;
    session.step = 0;
    session.data = {};
  }

  return result.reply;
}
