export function detectIntent(text) {
  const msg = text.toLowerCase().trim();

  // Auto-detect ID
  if (msg.startsWith("cmp") || msg.startsWith("app")) {return "STATUS_TRACKING";}
  // Certificates
  if (msg.includes("birth")) return "BIRTH_CERT";
  if (msg.includes("death")) return "DEATH_CERT";
  if (msg.includes("marriage")) return "MARRIAGE_CERT";
  if (msg.includes("income")) return "INCOME_CERT";
  if (msg.includes("caste")) return "CASTE_CERT";
  if (msg.includes("domicile")) return "DOMICILE_CERT";
  if (msg.includes("character")) return "CHARACTER_CERT";

  // Complaints
  if (msg.includes("garbage")) return "GARBAGE_COMPLAINT";
  if (msg.includes("street light") || msg.includes("light not working")) return "STREET_LIGHT_COMPLAINT";
  if (msg.includes("road")) return "ROAD_DAMAGE_COMPLAINT";
  if (msg.includes("water leakage")) return "WATER_LEAKAGE_COMPLAINT";
  if (msg.includes("drain") || msg.includes("drainage")) return "DRAINAGE_COMPLAINT";

  // Tracking
  if (msg.includes("status") || msg.includes("track")) return "STATUS_TRACKING";

  // Appointment
  if (msg.includes("appointment") || msg.includes("token")) return "APPOINTMENT_BOOKING";

  return null;
}
