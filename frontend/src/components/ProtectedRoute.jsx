import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

function defaultRouteForRole(role) {
  if (role === "admin") return "/dashboard";
  if (role === "employee") return "/profile";
  return "/login";
}

export default function ProtectedRoute({ user, allowedRole, allowedRoles, children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const normalizedAllowedRoles =
    Array.isArray(allowedRoles) && allowedRoles.length > 0
      ? allowedRoles
      : allowedRole
        ? [allowedRole]
        : null;

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(user.role)) {
    return <Navigate to={defaultRouteForRole(user.role)} replace />;
  }

  return children;
}