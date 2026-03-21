import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ProgressBar from "../components/ProgressBar";

function statusFromProgress(progressPercent) {
  const p = Number(progressPercent) || 0;
  if (p >= 100) return "completed";
  if (p > 0) return "in_progress";
  return "not_started";
}

export default function MyCourses({ user, setUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/my-progress");
        setItems(res.data?.items || []);
      } catch (err) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load your courses";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="My Courses" />

      <div style={{ padding: 24, display: "grid", gap: 14 }}>
        {loading ? <LoadingState label="Loading your courses…" /> : null}
        {!loading && error ? (
          <EmptyState title="My Courses unavailable" description={error} />
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <EmptyState
            title="No courses assigned"
            description="Once an admin enrolls you in a course, it will show up here."
          />
        ) : null}

        {!loading && !error && items.length > 0
          ? items.map((it) => (
              <div
                key={it.enrollment_id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 16,
                  background: "var(--social-bg)",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-h)" }}>
                      {it.course_title}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
                      Lessons: {it.completed_lessons}/{it.total_lessons} • Status:{" "}
                      {statusFromProgress(it.progress_percent)}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/my-courses/${it.course_id}`)}
                    style={{
                      cursor: "pointer",
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text-h)",
                      fontSize: 14,
                      height: 40,
                      alignSelf: "flex-start",
                    }}
                  >
                    Continue
                  </button>
                </div>

                <ProgressBar value={it.progress_percent} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
