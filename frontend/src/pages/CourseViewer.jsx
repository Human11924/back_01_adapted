import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ProgressBar from "../components/ProgressBar";

function sortByOrderIndex(items = []) {
  return [...items].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
}

function flattenLessons(course) {
  const modules = sortByOrderIndex(course?.modules || []);
  const lessons = [];
  for (const mod of modules) {
    for (const lesson of sortByOrderIndex(mod.lessons || [])) {
      lessons.push({ ...lesson, moduleId: mod.id, moduleTitle: mod.title });
    }
  }
  return lessons;
}

export default function CourseViewer({ user, setUser }) {
  const params = useParams();
  const courseId = Number(params.courseId);

  const [course, setCourse] = useState(null);
  const [enrollmentProgress, setEnrollmentProgress] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [markingComplete, setMarkingComplete] = useState(false);

  const progressByLessonId = useMemo(() => {
    const map = new Map();
    for (const item of enrollmentProgress?.lesson_progress || []) {
      map.set(item.lesson_id, item);
    }
    return map;
  }, [enrollmentProgress]);

  const lessonsFlat = useMemo(() => flattenLessons(course), [course]);

  const selectedLesson = useMemo(() => {
    if (!selectedLessonId) return null;
    return lessonsFlat.find((l) => l.id === selectedLessonId) || null;
  }, [lessonsFlat, selectedLessonId]);

  const refreshEnrollmentProgress = async (enrollmentId) => {
    const res = await api.get(`/enrollments/${enrollmentId}/progress`);
    setEnrollmentProgress(res.data);
    return res.data;
  };

  useEffect(() => {
    const run = async () => {
      if (!courseId || Number.isNaN(courseId)) {
        setError("Invalid course");
        setLoading(false);
        return;
      }

      try {
        const [courseRes, myProgressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get("/my-progress"),
        ]);

        setCourse(courseRes.data);

        const myItem = (myProgressRes.data?.items || []).find(
          (it) => Number(it.course_id) === courseId
        );

        if (!myItem) {
          setError("You are not enrolled in this course.");
          return;
        }

        await refreshEnrollmentProgress(myItem.enrollment_id);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load course";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (!course || !enrollmentProgress) return;
    if (selectedLessonId) return;

    const lessons = flattenLessons(course);
    if (lessons.length === 0) return;

    const firstIncomplete = lessons.find((l) => {
      const p = progressByLessonId.get(l.id);
      return p?.status !== "completed";
    });

    setSelectedLessonId(firstIncomplete?.id || lessons[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, enrollmentProgress, progressByLessonId, selectedLessonId]);

  useEffect(() => {
    const run = async () => {
      if (!selectedLessonId || !enrollmentProgress) return;

      setActionError("");
      setActivities([]);

      try {
        // Mark this lesson as started (in_progress) when opened.
        // If it already exists, backend will update it.
        await api.post(`/progress/start/${selectedLessonId}`);

        // Refresh progress so the sidebar highlights in-progress.
        await refreshEnrollmentProgress(enrollmentProgress.enrollment_id);

        const actsRes = await api.get(`/lessons/${selectedLessonId}/activities`);
        setActivities(actsRes.data || []);
      } catch (err) {
        const message = err?.response?.data?.detail || err?.message;
        if (message) setActionError(message);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId]);

  const handleMarkCompleted = async () => {
    if (!selectedLessonId || !enrollmentProgress) return;

    setMarkingComplete(true);
    setActionError("");

    try {
      await api.post(`/progress/complete/${selectedLessonId}`);
      const updatedProgress = await refreshEnrollmentProgress(
        enrollmentProgress.enrollment_id
      );

      const updatedProgressByLessonId = new Map();
      for (const item of updatedProgress?.lesson_progress || []) {
        updatedProgressByLessonId.set(item.lesson_id, item);
      }

      // Auto-advance to the next incomplete lesson (minimal convenience).
      const lessons = flattenLessons(course);
      const currentIdx = lessons.findIndex((l) => l.id === selectedLessonId);

      for (let i = currentIdx + 1; i < lessons.length; i += 1) {
        const p = updatedProgressByLessonId.get(lessons[i].id);
        if (p?.status !== "completed") {
          setSelectedLessonId(lessons[i].id);
          return;
        }
      }

      // If nothing left after current, jump to the first incomplete.
      const firstIncomplete = lessons.find((l) => {
        const p = updatedProgressByLessonId.get(l.id);
        return p?.status !== "completed";
      });
      if (firstIncomplete) setSelectedLessonId(firstIncomplete.id);
    } catch (err) {
      const message =
        err?.response?.data?.detail || err?.message || "Failed to complete lesson";
      setActionError(message);
    } finally {
      setMarkingComplete(false);
    }
  };

  const courseTitle = course?.title || "Course";

  if (loading) {
    return (
      <div style={{ textAlign: "left" }}>
        <AppHeader user={user} setUser={setUser} title={courseTitle} />
        <LoadingState label="Loading course viewer…" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "left" }}>
        <AppHeader user={user} setUser={setUser} title={courseTitle} />
        <div style={{ padding: 24 }}>
          <EmptyState title="Course unavailable" description={error} />
        </div>
      </div>
    );
  }

  if (!course || !enrollmentProgress) {
    return (
      <div style={{ textAlign: "left" }}>
        <AppHeader user={user} setUser={setUser} title={courseTitle} />
        <div style={{ padding: 24 }}>
          <EmptyState title="No course data" />
        </div>
      </div>
    );
  }

  const modules = sortByOrderIndex(course.modules || []);

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title={courseTitle} />

      <div style={{ padding: 24, display: "grid", gap: 14 }}>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            background: "var(--social-bg)",
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>Progress</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-h)" }}>
                {enrollmentProgress.completed_lessons}/{enrollmentProgress.total_lessons} lessons
              </div>
            </div>
            <div style={{ fontSize: 14, color: "var(--text)" }}>
              {enrollmentProgress.progress_percent}%
            </div>
          </div>
          <ProgressBar value={enrollmentProgress.progress_percent} />
        </div>

        {modules.length === 0 ? (
          <EmptyState title="This course has no modules yet" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(260px, 340px) 1fr",
              gap: 14,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "transparent",
                overflow: "hidden",
                minHeight: 420,
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderBottom: "1px solid var(--border)",
                  background: "var(--social-bg)",
                  fontWeight: 600,
                  color: "var(--text-h)",
                }}
              >
                Modules & lessons
              </div>

              <div style={{ maxHeight: 560, overflowY: "auto" }}>
                {modules.map((m) => (
                  <div key={m.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <div
                      style={{
                        padding: "10px 12px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-h)",
                      }}
                    >
                      {m.title}
                    </div>

                    <div style={{ display: "grid" }}>
                      {sortByOrderIndex(m.lessons || []).map((l) => {
                        const p = progressByLessonId.get(l.id);
                        const status = p?.status || "not_started";
                        const isSelected = l.id === selectedLessonId;

                        return (
                          <button
                            key={l.id}
                            onClick={() => setSelectedLessonId(l.id)}
                            style={{
                              cursor: "pointer",
                              textAlign: "left",
                              padding: "10px 12px",
                              border: "none",
                              borderTop: "1px solid var(--border)",
                              background: isSelected ? "var(--accent-bg)" : "transparent",
                              color: "var(--text-h)",
                              display: "grid",
                              gap: 4,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <div style={{ fontSize: 15, fontWeight: isSelected ? 700 : 500 }}>
                                {l.title}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  border: "1px solid var(--border)",
                                  color:
                                    status === "completed"
                                      ? "var(--accent)"
                                      : "var(--text)",
                                  background:
                                    status === "completed" ? "var(--accent-bg)" : "transparent",
                                  height: 18,
                                }}
                              >
                                {status.replace("_", " ")}
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text)" }}>
                              {l.lesson_type}
                              {typeof p?.progress_percent === "number"
                                ? ` • ${p.progress_percent}%`
                                : ""}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "transparent",
                overflow: "hidden",
                minHeight: 420,
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderBottom: "1px solid var(--border)",
                  background: "var(--social-bg)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-h)" }}>
                    {selectedLesson?.title || "Select a lesson"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>
                    {selectedLesson?.lesson_type || ""}
                  </div>
                </div>

                <button
                  onClick={handleMarkCompleted}
                  disabled={
                    markingComplete ||
                    (selectedLessonId
                      ? progressByLessonId.get(selectedLessonId)?.status === "completed"
                      : true)
                  }
                  style={{
                    cursor: markingComplete ? "not-allowed" : "pointer",
                    borderRadius: 10,
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-h)",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  {progressByLessonId.get(selectedLessonId)?.status === "completed"
                    ? "Completed"
                    : markingComplete
                      ? "Marking…"
                      : "Mark completed"}
                </button>
              </div>

              <div style={{ padding: 16, display: "grid", gap: 12 }}>
                {actionError ? (
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid var(--accent-border)",
                      background: "var(--accent-bg)",
                      color: "var(--text-h)",
                      fontSize: 14,
                    }}
                  >
                    {actionError}
                  </div>
                ) : null}

                {!selectedLesson ? (
                  <EmptyState title="Select a lesson" />
                ) : activities.length === 0 ? (
                  <EmptyState
                    title="No lesson content yet"
                    description="This lesson has no activities yet. You can still mark it completed."
                  />
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {activities.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          padding: 12,
                          background: "var(--social-bg)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{a.title}</div>
                          <div
                            style={{
                              fontSize: 12,
                              padding: "2px 8px",
                              borderRadius: 999,
                              border: "1px solid var(--border)",
                              color: "var(--text)",
                              height: 18,
                            }}
                          >
                            {a.type}
                          </div>
                        </div>
                        {a.description ? (
                          <div style={{ marginTop: 6, fontSize: 14, color: "var(--text)" }}>
                            {a.description}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
