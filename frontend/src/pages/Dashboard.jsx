import { useEffect, useState } from "react";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import DataTable from "../components/DataTable";
import EmployeeTable from "../components/EmployeeTable";
import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import LoadingState from "../components/LoadingState";

export default function Dashboard({ user, setUser }) {
  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [atRiskEmployees, setAtRiskEmployees] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        const [
          overviewRes,
          departmentsRes,
          topRes,
          atRiskRes,
          leaderboardRes,
        ] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/departments"),
          api.get("/analytics/top-employees"),
          api.get("/analytics/at-risk"),
          api.get("/leaderboard"),
        ]);

        if (cancelled) return;

        setOverview(overviewRes.data);
        setDepartments(departmentsRes.data || []);
        setTopEmployees(topRes.data || []);
        setAtRiskEmployees(atRiskRes.data || []);
        setLeaderboard(leaderboardRes.data || []);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load dashboard";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      setEmployeesLoading(true);
      setEmployeesError("");

      try {
        const res = await api.get("/employees");
        if (cancelled) return;
        setEmployees(res.data || []);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load employees";
        if (!cancelled) setEmployeesError(message);
      } finally {
        if (!cancelled) setEmployeesLoading(false);
      }
    };

    fetchDashboard();
    fetchEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="Admin Dashboard" />

      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        {loading ? <LoadingState label="Loading dashboard…" /> : null}
        {!loading && error ? (
          <EmptyState title="Dashboard unavailable" description={error} />
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
              <KpiCard label="Total employees" value={overview?.total_employees ?? "—"} />
              <KpiCard label="Active learners" value={overview?.active_learners ?? "—"} />
              <KpiCard
                label="Avg progress"
                value={
                  typeof overview?.avg_progress_percent === "number"
                    ? `${overview.avg_progress_percent.toFixed(1)}%`
                    : "—"
                }
              />
              <KpiCard
                label="Enrollments completed"
                value={overview?.completed_enrollments ?? "—"}
              />
              <KpiCard label="Total courses" value={overview?.total_courses ?? "—"} />
              <KpiCard
                label="Lessons completed"
                value={overview?.total_lessons_completed ?? "—"}
              />
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Employees</h2>
              <EmployeeTable
                employees={employees}
                loading={employeesLoading}
                error={employeesError}
              />
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <EmptyState
                  title="No leaderboard data"
                  description="Once employees have activity, leaderboard data will appear here."
                />
              ) : (
                <DataTable
                  rowKey="employee_id"
                  columns={[
                    { key: "rank", header: "Rank" },
                    { key: "full_name", header: "Name" },
                    { key: "department", header: "Department" },
                    { key: "level", header: "Level" },
                    { key: "total_xp", header: "Total XP" },
                    { key: "current_streak", header: "Streak" },
                    { key: "weekly_xp", header: "Weekly XP" },
                  ]}
                  rows={leaderboard}
                />
              )}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Department stats</h2>
              {departments.length === 0 ? (
                <EmptyState title="No department analytics" />
              ) : (
                <DataTable
                  rowKey={(r) => r.department || "Unknown"}
                  columns={[
                    { key: "department", header: "Department" },
                    { key: "employees_count", header: "Employees" },
                    {
                      key: "avg_progress_percent",
                      header: "Avg progress",
                      render: (r) => `${Number(r.avg_progress_percent || 0).toFixed(1)}%`,
                    },
                    { key: "total_xp", header: "Total XP" },
                    { key: "completed_lessons", header: "Lessons completed" },
                  ]}
                  rows={departments}
                />
              )}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Top employees</h2>
              {topEmployees.length === 0 ? (
                <EmptyState title="No top employees yet" />
              ) : (
                <DataTable
                  rowKey="employee_id"
                  columns={[
                    { key: "full_name", header: "Name" },
                    { key: "department", header: "Department" },
                    { key: "level", header: "Level" },
                    { key: "total_xp", header: "Total XP" },
                    { key: "completed_lessons", header: "Lessons completed" },
                  ]}
                  rows={topEmployees}
                />
              )}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>At-risk employees</h2>
              {atRiskEmployees.length === 0 ? (
                <EmptyState title="No at-risk employees" />
              ) : (
                <DataTable
                  rowKey="employee_id"
                  columns={[
                    { key: "full_name", header: "Name" },
                    { key: "department", header: "Department" },
                    {
                      key: "completion_percent",
                      header: "Completion",
                      render: (r) => `${Number(r.completion_percent || 0).toFixed(1)}%`,
                    },
                    { key: "completed_lessons", header: "Lessons completed" },
                    {
                      key: "last_activity_at",
                      header: "Last activity",
                      render: (r) =>
                        r.last_activity_at
                          ? new Date(r.last_activity_at).toLocaleDateString()
                          : "—",
                    },
                  ]}
                  rows={atRiskEmployees}
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}