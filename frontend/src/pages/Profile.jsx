import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import BadgeList from "../components/BadgeList";
import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import LoadingState from "../components/LoadingState";
import { removeCurrentUser, removeToken } from "../utils/auth";
import "./Profile.css";

export default function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(null);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setUser?.(null);
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, pointsRes, badgesRes] = await Promise.all([
          api.get("/profile/me"),
          api.get("/leaderboard/me"),
          api.get("/badges/me"),
        ]);

        setProfile(profileRes.data);
        setPoints(pointsRes.data);
        setBadges(badgesRes.data || []);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load profile";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <AppHeader user={user} setUser={setUser} title="Profile" />

      <div className="profile-content">
        {loading ? <LoadingState label="Loading profile…" /> : null}
        {!loading && error ? (
          <EmptyState title="Profile unavailable" description={error} />
        ) : null}

        {!loading && !error ? (
          <>
            <div className="profile-actions">
              <button className="profile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="profile-kpi-grid">
              <KpiCard label="Total XP" value={points?.total_xp ?? "—"} />
              <KpiCard label="Level" value={points?.level ?? "—"} />
              <KpiCard label="Streak" value={points?.current_streak ?? "—"} />
              <KpiCard label="Weekly XP" value={points?.weekly_xp ?? "—"} />
            </div>

            <div className="profile-details-card">
              <h2 className="profile-details-title">Details</h2>
              <div className="profile-details-grid">
                <div>
                  <strong>Name:</strong> {profile?.full_name || "—"}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email || "—"}
                </div>
                <div>
                  <strong>Position:</strong> {profile?.position || "—"}
                </div>
                <div>
                  <strong>Department:</strong> {profile?.department || "—"}
                </div>
                <div>
                  <strong>CEFR level:</strong> {profile?.cefr_level || "—"}
                </div>
              </div>
            </div>

            <div className="profile-badges">
              <h2 className="profile-badges-title">Badges</h2>
              {badges.length === 0 ? (
                <EmptyState
                  title="No badges yet"
                  description="Complete lessons and keep your streak going to earn badges."
                />
              ) : (
                <BadgeList badges={badges} />
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}