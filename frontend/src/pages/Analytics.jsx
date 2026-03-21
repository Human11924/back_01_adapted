import { useEffect, useState } from "react";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import LoadingState from "../components/LoadingState";

export default function Analytics({ user, setUser }) {
  const [overview, setOverview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [atRiskEmployees, setAtRiskEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [overviewRes, departmentsRes, topRes, atRiskRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/departments"),
          api.get("/analytics/top-employees"),
          api.get("/analytics/at-risk"),
        ]);

        setOverview(overviewRes.data);
        setDepartments(departmentsRes.data || []);
        setTopEmployees(topRes.data || []);
        setAtRiskEmployees(atRiskRes.data || []);
      } catch (err) {
        const message =
          err?.response?.data?.detail || err?.message || "Failed to load analytics";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="Analytics" />

      <div style={{ padding: 24, display: "grid", gap: 18 }}>
        {loading ? <LoadingState label="Loading analytics…" /> : null}
        {!loading && error ? (
          <EmptyState title="Analytics unavailable" description={error} />
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
              <KpiCard label="Total courses" value={overview?.total_courses ?? "—"} />
              <KpiCard
                label="Lessons completed"
                value={overview?.total_lessons_completed ?? "—"}
              />
              <KpiCard
                label="Enrollments completed"
                value={overview?.completed_enrollments ?? "—"}
              />
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={{ margin: 0 }}>Department analytics</h2>
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
                <EmptyState title="No top employees" />
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
              <h2 style={{ margin: 0 }}>Low activity employees</h2>
              {atRiskEmployees.length === 0 ? (
                <EmptyState title="No low activity employees" />
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
