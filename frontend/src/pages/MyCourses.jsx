import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ProgressBar from "../components/ProgressBar";
import "./MyCourses.css";

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
  const [bootstrappingDemo, setBootstrappingDemo] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/my-progress");
        const nextItems = res.data?.items || [];

        if (nextItems.length === 0) {
          setBootstrappingDemo(true);

          try {
            await api.post("/courses/demo/bootstrap");
            const retryRes = await api.get("/my-progress");
            setItems(retryRes.data?.items || []);
          } catch {
            setItems(nextItems);
          } finally {
            setBootstrappingDemo(false);
          }
        } else {
          setItems(nextItems);
        }
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
    <div className="my-courses-page">
      <AppHeader user={user} setUser={setUser} title="My Courses" />

      <div className="my-courses-content">
        {loading ? <LoadingState label="Loading your courses…" /> : null}
        {!loading && bootstrappingDemo ? <LoadingState label="Preparing your demo course…" /> : null}
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
                className="my-courses-card"
              >
                <div className="my-courses-card__header">
                  <div>
                    <div className="my-courses-card__title">
                      {it.course_title}
                    </div>
                    {it.course_title === "English for F&B Staff" ? (
                      <div className="my-courses-card__demo-badge">
                        Demo Ready
                      </div>
                    ) : null}
                    <div className="my-courses-card__meta">
                      Lessons: {it.completed_lessons}/{it.total_lessons} • Status:{" "}
                      {statusFromProgress(it.progress_percent)}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/my-courses/${it.course_id}`)}
                    className="my-courses-card__cta"
                  >
                    {it.course_title === "English for F&B Staff" ? "Start Demo" : "Continue"}
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
