import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import BadgeList from "../components/BadgeList";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ProgressBar from "../components/ProgressBar";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function EmployeeDetail({ user, setUser }) {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [badgesError, setBadgesError] = useState("");

  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [enrollmentsError, setEnrollmentsError] = useState("");

  const [progressItems, setProgressItems] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setEmployeeLoading(true);
      setEmployeeError("");
      setBadgesLoading(true);
      setBadgesError("");
      setEnrollmentsLoading(true);
      setEnrollmentsError("");
      setProgressLoading(true);
      setProgressError("");
      setProgressItems([]);

      try {
        const [employeeRes, badgesRes, enrollmentsRes] = await Promise.all([
          api.get(`/employees/${employeeId}`),
          api.get(`/badges/employee/${employeeId}`),
          api.get(`/employees/${employeeId}/courses`),
        ]);

        if (cancelled) return;

        setEmployee(employeeRes.data);
        setBadges(badgesRes.data || []);
        setEnrollments(enrollmentsRes.data || []);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load employee";
        if (!cancelled) setEmployeeError(message);
      } finally {
        if (!cancelled) {
          setEmployeeLoading(false);
          setBadgesLoading(false);
          setEnrollmentsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!enrollments || enrollments.length === 0) {
        setProgressItems([]);
        setProgressLoading(false);
        setProgressError("");
        return;
      }

      setProgressLoading(true);
      setProgressError("");

      try {
        const res = await Promise.all(
          enrollments.map((e) => api.get(`/enrollments/${e.id}/progress`))
        );

        if (cancelled) return;

        const items = res.map((r) => r.data).filter(Boolean);
        setProgressItems(items);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load progress";
        if (!cancelled) setProgressError(message);
      } finally {
        if (!cancelled) setProgressLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [enrollments]);

  const progressSummary = useMemo(() => {
    if (!progressItems || progressItems.length === 0) return null;

    const totalCourses = progressItems.length;
    const avgProgress =
      progressItems.reduce((sum, it) => sum + (Number(it.progress_percent) || 0), 0) /
      totalCourses;

    const totalLessons = progressItems.reduce((sum, it) => sum + (Number(it.total_lessons) || 0), 0);
    const completedLessons = progressItems.reduce(
      (sum, it) => sum + (Number(it.completed_lessons) || 0),
      0
    );

    return {
      totalCourses,
      avgProgress,
      totalLessons,
      completedLessons,
    };
  }, [progressItems]);

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="Employee Detail" />

      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        {employeeLoading ? <LoadingState label="Loading employee…" /> : null}
        {!employeeLoading && employeeError ? (
          <EmptyState title="Employee unavailable" description={employeeError} />
        ) : null}

        {!employeeLoading && !employeeError && !employee ? (
          <EmptyState title="Employee not found" />
        ) : null}

        {!employeeLoading && !employeeError && employee ? (
          <>
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                background: "var(--social-bg)",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 10 }}>Details</h2>
              <div style={{ display: "grid", gap: 8 }}>
                <div>
                  <strong>Name:</strong> {employee.full_name || "—"}
                </div>
                <div>
                  <strong>Email:</strong> {employee.email || "—"}
                </div>
                <div>
                  <strong>Department:</strong> {employee.department || "—"}
                </div>
                <div>
                  <strong>Position:</strong> {employee.position || "—"}
                </div>
                <div>
                  <strong>CEFR level:</strong> {employee.cefr_level || "—"}
                </div>
                <div>
                  <strong>Active:</strong> {employee.is_active ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(employee.created_at)}
                </div>
                <div>
                  <strong>Total XP:</strong> {employee.total_xp ?? "—"}
                </div>
                <div>
                  <strong>Level:</strong> {employee.level || "—"}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Badges</h2>
              {badgesLoading ? <LoadingState label="Loading badges…" /> : null}
              {!badgesLoading && badgesError ? (
                <EmptyState title="Badges unavailable" description={badgesError} />
              ) : null}
              {!badgesLoading && !badgesError && badges.length === 0 ? (
                <EmptyState title="No badges yet" />
              ) : null}
              {!badgesLoading && !badgesError && badges.length > 0 ? (
                <BadgeList badges={badges} />
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Enrolled courses</h2>
              {enrollmentsLoading ? <LoadingState label="Loading enrollments…" /> : null}
              {!enrollmentsLoading && enrollmentsError ? (
                <EmptyState title="Enrollments unavailable" description={enrollmentsError} />
              ) : null}
              {!enrollmentsLoading && !enrollmentsError && enrollments.length === 0 ? (
                <EmptyState
                  title="No courses assigned"
                  description="This employee is not enrolled in any courses yet."
                />
              ) : null}

              {!enrollmentsLoading && !enrollmentsError && enrollments.length > 0
                ? enrollments.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: 16,
                        background: "var(--social-bg)",
                        display: "grid",
                        gap: 6,
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-h)" }}>
                        {e.course?.title || `Course #${e.course_id}`}
                      </div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>
                        Status: {e.status || "—"}
                        {e.course?.level ? ` • Level: ${e.course.level}` : ""}
                      </div>
                    </div>
                  ))
                : null}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Progress summary</h2>

              {progressLoading ? <LoadingState label="Loading progress…" /> : null}
              {!progressLoading && progressError ? (
                <EmptyState title="Progress unavailable" description={progressError} />
              ) : null}

              {!progressLoading && !progressError && enrollments.length === 0 ? (
                <EmptyState title="No progress yet" description="No enrollments found." />
              ) : null}

              {!progressLoading && !progressError && enrollments.length > 0 && progressItems.length === 0 ? (
                <EmptyState
                  title="No progress data"
                  description="Progress will appear once lessons have been started."
                />
              ) : null}

              {!progressLoading && !progressError && progressItems.length > 0 ? (
                <>
                  {progressSummary ? (
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: 16,
                        background: "var(--social-bg)",
                        display: "grid",
                        gap: 6,
                      }}
                    >
                      <div style={{ fontSize: 14, color: "var(--text)" }}>
                        Courses: {progressSummary.totalCourses} • Lessons: {progressSummary.completedLessons}/
                        {progressSummary.totalLessons} • Avg progress: {progressSummary.avgProgress.toFixed(1)}%
                      </div>
                      <ProgressBar value={progressSummary.avgProgress} />
                    </div>
                  ) : null}

                  {progressItems.map((it) => (
                    <div
                      key={it.enrollment_id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: 16,
                        background: "var(--social-bg)",
                        display: "grid",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-h)" }}>
                          {it.course_title}
                        </div>
                        <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
                          Lessons: {it.completed_lessons}/{it.total_lessons} • Progress: {it.progress_percent}%
                        </div>
                      </div>
                      <ProgressBar value={it.progress_percent} />
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
