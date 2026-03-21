import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  removeCurrentUser,
  removeToken,
  saveCurrentUser,
  setToken,
} from "../utils/auth";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const loginResponse = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = loginResponse.data.access_token;
      setToken(token);

      const meResponse = await api.get("/users/me");
      const currentUser = meResponse.data;

      setUser(currentUser);
      saveCurrentUser(currentUser);

      if (currentUser.role === "admin") {
        navigate("/dashboard");
      } else if (currentUser.role === "employee") {
        navigate("/profile");
      } else {
        setError("Unknown user role");
      }
    } catch (err) {
      removeToken();
      removeCurrentUser();

      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, textAlign: "left" }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>

      <div
        style={{
          maxWidth: 420,
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16,
          background: "var(--social-bg)",
        }}
      >
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error ? (
            <div
              style={{
                marginBottom: 12,
                padding: 10,
                borderRadius: 10,
                border: "1px solid var(--accent-border)",
                background: "var(--accent-bg)",
                color: "var(--text-h)",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: 10,
              padding: "10px 12px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-h)",
              width: "100%",
              fontSize: 15,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}