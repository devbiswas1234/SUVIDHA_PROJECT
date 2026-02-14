export function generateId(prefix) {
  return prefix + Math.floor(100000 + Math.random() * 900000);
}
