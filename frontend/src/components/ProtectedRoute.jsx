import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function ProtectedRoute({ user, allowedRole, children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "employee") {
      return <Navigate to="/profile" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}