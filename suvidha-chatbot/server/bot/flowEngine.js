import { detectIntent } from "./intents.js";
import { streetLightFlow } from "./flows/streetLightComplaint.js";
import { birthCertFlow } from "./flows/birthCertificate.js";
import { statusTrackingFlow } from "./flows/statusTracking.js";

const flowMap = {
  STREET_LIGHT_COMPLAINT: streetLightFlow,
  BIRTH_CERT: birthCertFlow,
  STATUS_TRACKING: statusTrackingFlow,
};

export async function handleMessage(message, session) {
  // If no flow running, detect intent
  if (!session.currentFlow) {
    const intent = detectIntent(message);

    if (!intent) {
      return `I didn’t understand 😅  
You can type like:  
• Birth Certificate  
• Street Light Complaint  
• Check Status  
• Appointment Booking`;
    }

    session.currentFlow = intent;
    session.step = 0;
    session.data = {};
  }

  // Run flow
  const flowHandler = flowMap[session.currentFlow];

  if (!flowHandler) {
    session.currentFlow = null;
    return "This service is not configured yet.";
  }

  const result = await flowHandler(message, session);

  // If flow finished
  if (result.done) {
    session.currentFlow = null;
    session.step = 0;
    session.data = {};
  }

  return result.reply;
}
