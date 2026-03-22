import { useEffect, useState } from "react";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import NotificationList from "../components/NotificationList";
import "./Notifications.css";

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
    <div className="notifications-page">
      <AppHeader user={user} setUser={setUser} title="Notifications" />

      <div className="notifications-content">
        {loading ? <LoadingState label="Loading notifications…" /> : null}
        {!loading && error ? (
          <EmptyState title="Notifications unavailable" description={error} />
        ) : null}

        {!loading && !error ? (
          <>
            <div className="notifications-section">
              <h2 className="notifications-heading">Notifications</h2>
              {notifications.length === 0 ? (
                <EmptyState title="No notifications" />
              ) : (
                <NotificationList items={notifications} onMarkRead={handleMarkRead} />
              )}
            </div>

            <div className="notifications-section">
              <h2 className="notifications-heading">Recommendations</h2>
              {recommendations.length === 0 ? (
                <EmptyState title="No recommendations" />
              ) : (
                <div className="notifications-recommendations-list">
                  {recommendations.map((r, idx) => (
                    <div
                      key={`${r.type}-${idx}`}
                      className="notifications-recommendation-card"
                    >
                      <div className="notifications-recommendation-top">
                        <div>
                          <div className="notifications-recommendation-title">{r.title}</div>
                          <div className="notifications-recommendation-message">
                            {r.message}
                          </div>
                        </div>
                        <div className="notifications-priority-badge">
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
