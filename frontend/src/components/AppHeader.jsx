import { Link, useNavigate } from "react-router-dom";
import { removeCurrentUser, removeToken } from "../utils/auth";
import "./AppHeader.css";

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
    <header className="app-header">
      <div className="app-header__brand-wrap">
        <img className="app-header__logo" src="/logo.svg" alt="AdaptEd logo" width="86" height="86" />
        <div className="app-header__brand-block">
          <div className="app-header__brand">AdaptEd</div>
          <div className="app-header__title">{title}</div>
        </div>
      </div>

      <div className="app-header__actions">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`app-header__nav-link ${path === l.to ? "is-active" : ""}`}
          >
            {l.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="app-header__logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
