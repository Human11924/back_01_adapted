import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import api from "./services/api";
import { getToken, removeToken } from "./utils/auth";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = getToken();

      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (error) {
        removeToken();
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/profile" replace />
            )
          ) : (
            <Login setUser={setUser} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} allowedRole="admin">
            <Dashboard user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user} allowedRole="employee">
            <Profile user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/profile" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}