import { useEffect, useState } from "react";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import BadgeList from "../components/BadgeList";
import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import LoadingState from "../components/LoadingState";

export default function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(null);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="Profile" />

      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        {loading ? <LoadingState label="Loading profile…" /> : null}
        {!loading && error ? (
          <EmptyState title="Profile unavailable" description={error} />
        ) : null}

        {!loading && !error ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <KpiCard label="Total XP" value={points?.total_xp ?? "—"} />
              <KpiCard label="Level" value={points?.level ?? "—"} />
              <KpiCard label="Streak" value={points?.current_streak ?? "—"} />
              <KpiCard label="Weekly XP" value={points?.weekly_xp ?? "—"} />
            </div>

            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                background: "var(--social-bg)",
              }}
            >
              <h2 style={{ marginTop: 0 }}>Details</h2>
              <div style={{ display: "grid", gap: 8 }}>
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

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Badges</h2>
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