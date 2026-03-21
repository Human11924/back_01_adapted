import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeDepartment(value) {
  const dept = String(value ?? "").trim();
  return dept.length > 0 ? dept : "Unassigned";
}

export default function EmployeeTable({ employees, loading, error }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [active, setActive] = useState("all"); // all | active | inactive

  const departmentOptions = useMemo(() => {
    const set = new Set();
    (employees || []).forEach((e) => set.add(normalizeDepartment(e.department)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [employees]);

  const filtered = useMemo(() => {
    const q = normalizeText(search);

    return (employees || []).filter((e) => {
      const matchesQuery =
        q.length === 0 ||
        normalizeText(e.full_name).includes(q) ||
        normalizeText(e.email).includes(q);

      const dept = normalizeDepartment(e.department);
      const matchesDept = department === "all" || dept === department;

      const matchesActive =
        active === "all" ||
        (active === "active" ? e.is_active : !e.is_active);

      return matchesQuery && matchesDept && matchesActive;
    });
  }, [employees, search, department, active]);

  if (loading) return <LoadingState label="Loading employees…" />;

  if (error) {
    return <EmptyState title="Employees unavailable" description={error} />;
  }

  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        title="No employees yet"
        description="Employees will appear here once they have accounts and profiles."
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 220px 180px",
          gap: 10,
          alignItems: "end",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 13, color: "var(--text)" }}>Search</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--social-bg)",
              color: "var(--text-h)",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 13, color: "var(--text)" }}>Department</div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--social-bg)",
              color: "var(--text-h)",
              outline: "none",
            }}
          >
            <option value="all">All</option>
            {departmentOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 13, color: "var(--text)" }}>Status</div>
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--social-bg)",
              color: "var(--text-h)",
              outline: "none",
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching employees"
          description="Try adjusting search or filters."
        />
      ) : (
        <DataTable
          rowKey="employee_id"
          getRowStyle={(r) => (!r.is_active ? { opacity: 0.65 } : null)}
          onRowClick={(r) => navigate(`/employees/${r.employee_id}`)}
          columns={[
            { key: "full_name", header: "Name" },
            { key: "email", header: "Email" },
            {
              key: "department",
              header: "Department",
              render: (r) => normalizeDepartment(r.department),
            },
            {
              key: "position",
              header: "Position",
              render: (r) => r.position || "—",
            },
            {
              key: "cefr_level",
              header: "CEFR",
              render: (r) => r.cefr_level || "—",
            },
            { key: "total_xp", header: "Total XP" },
            { key: "level", header: "Level" },
            {
              key: "is_active",
              header: "Active",
              render: (r) => (r.is_active ? "Yes" : "No"),
            },
          ]}
          rows={filtered}
        />
      )}
    </div>
  );
}
