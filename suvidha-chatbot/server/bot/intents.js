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
  if (msg.includes("garbage")) return "COMPLAINT_GARBAGE";
  if (msg.includes("street light") || msg.includes("light not working")) return "COMPLAINT_STREET_LIGHT";
  if (msg.includes("road") || msg.includes("pothole")) return "COMPLAINT_ROAD";
  if (msg.includes("water leakage")) return "COMPLAINT_WATER_LEAK";
  if (msg.includes("drain") || msg.includes("drainage")) return "COMPLAINT_DRAINAGE";
  if (msg.includes("electricity bill") || msg.includes("electricity complaint")) return "COMPLAINT_ELECTRICITY";
  if (msg.includes("public nuisance")) return "COMPLAINT_NUISANCE";
  if (msg.includes("encroachment")) return "COMPLAINT_ENCROACHMENT";
  if (msg.includes("traffic signal")) return "COMPLAINT_TRAFFIC";
  if (msg.includes("stray animal") || msg.includes("dog")) return "COMPLAINT_STRAY_ANIMAL";

  // Tracking
  if (msg.includes("status") || msg.includes("track")) return "STATUS_TRACKING";

  // Appointment
  if (msg.includes("appointment") || msg.includes("token")) return "APPOINTMENT_BOOKING";

  return null;
}
