import jwt from "jsonwebtoken";

export function requireCitizen(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Missing token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "CITIZEN") {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    req.citizen = decoded;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Missing token" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "ADMIN") {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}
