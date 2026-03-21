import { useEffect, useState } from "react";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import NotificationList from "../components/NotificationList";

function endpointFor(role, kind) {
  // kind: 'notifications' | 'recommendations'
  if (role === "admin") return `/${kind}/admin`;
  return `/${kind}/me`;
}

export default function Notifications({ user, setUser }) {
  const [notifications, setNotifications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = user?.role;

  const fetchAll = async () => {
    try {
      const [nRes, rRes] = await Promise.all([
        api.get(endpointFor(role, "notifications")),
        api.get(endpointFor(role, "recommendations")),
      ]);

      setNotifications(nRes.data || []);
      setRecommendations(rRes.data || []);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load notifications";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleMarkRead = async (n) => {
    try {
      const res = await api.patch(`/notifications/${n.id}/read`);
      const updated = res.data;
      setNotifications((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (err) {
      // Keep page stable; errors will show next refresh.
      setError(err?.response?.data?.detail || err?.message || "Failed to mark as read");
      setTimeout(() => setError(""), 2500);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="Notifications" />

      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        {loading ? <LoadingState label="Loading notifications…" /> : null}
        {!loading && error ? (
          <EmptyState title="Notifications unavailable" description={error} />
        ) : null}

        {!loading && !error ? (
          <>
            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Notifications</h2>
              {notifications.length === 0 ? (
                <EmptyState title="No notifications" />
              ) : (
                <NotificationList items={notifications} onMarkRead={handleMarkRead} />
              )}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Recommendations</h2>
              {recommendations.length === 0 ? (
                <EmptyState title="No recommendations" />
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {recommendations.map((r, idx) => (
                    <div
                      key={`${r.type}-${idx}`}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: 12,
                        background: "var(--social-bg)",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{r.title}</div>
                          <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
                            {r.message}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            padding: "4px 8px",
                            borderRadius: 999,
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            height: 22,
                          }}
                        >
                          {r.priority || "medium"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
