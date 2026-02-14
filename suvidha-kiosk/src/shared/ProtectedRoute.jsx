import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allow, redirectTo = "/home", children }) {
  if (!allow) return <Navigate to={redirectTo} replace />;
  return children;
}
