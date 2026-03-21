import { Link, useNavigate } from "react-router-dom";
import { removeCurrentUser, removeToken } from "../utils/auth";

function navLinkStyle(isActive) {
  return {
    textDecoration: "none",
    color: isActive ? "var(--accent)" : "var(--text-h)",
    padding: "6px 10px",
    borderRadius: 8,
    border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border)"}`,
    background: isActive ? "var(--accent-bg)" : "transparent",
    fontSize: 14,
  };
}

export default function AppHeader({ user, setUser, title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setUser?.(null);
    navigate("/login");
  };

  const role = user?.role;
  const path = window.location.pathname;

  const links = [];
  if (role === "admin") {
    links.push({ to: "/dashboard", label: "Dashboard" });
    links.push({ to: "/analytics", label: "Analytics" });
    links.push({ to: "/leaderboard", label: "Leaderboard" });
    links.push({ to: "/notifications", label: "Notifications" });
  } else if (role === "employee") {
    links.push({ to: "/profile", label: "Profile" });
    links.push({ to: "/my-courses", label: "My Courses" });
    links.push({ to: "/leaderboard", label: "Leaderboard" });
    links.push({ to: "/notifications", label: "Notifications" });
  }

  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ fontSize: 14, color: "var(--text)" }}>AdaptEd</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "var(--text-h)" }}>
          {title}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} style={navLinkStyle(path === l.to)}>
            {l.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          style={{
            cursor: "pointer",
            borderRadius: 10,
            padding: "8px 12px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-h)",
            fontSize: 14,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
