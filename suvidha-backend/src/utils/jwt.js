import jwt from "jsonwebtoken";

export function signCitizenToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
}

export function signAdminToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6h" });
}
