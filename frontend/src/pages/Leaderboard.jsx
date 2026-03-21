import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AppHeader from "../components/AppHeader";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

export default function Leaderboard({ user, setUser }) {
  const [items, setItems] = useState([]);
  const [myEmployeeId, setMyEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const reqs = [api.get("/leaderboard")];
        if (user?.role === "employee") {
          reqs.push(api.get("/leaderboard/me"));
        }

        const [leaderboardRes, myPointsRes] = await Promise.all(reqs);
        setItems(leaderboardRes.data || []);

        if (myPointsRes) {
          setMyEmployeeId(myPointsRes.data?.employee_id ?? null);
        }
      } catch (err) {
        const message =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load leaderboard";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user?.role]);

  const myRank = useMemo(() => {
    if (!myEmployeeId || items.length === 0) return null;
    const found = items.find((i) => i.employee_id === myEmployeeId);
    return found?.rank ?? null;
  }, [items, myEmployeeId]);

  return (
    <div style={{ textAlign: "left" }}>
      <AppHeader user={user} setUser={setUser} title="Leaderboard" />

      <div style={{ padding: 24, display: "grid", gap: 14 }}>
        {loading ? <LoadingState label="Loading leaderboard…" /> : null}
        {!loading && error ? (
          <EmptyState title="Leaderboard unavailable" description={error} />
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <EmptyState
            title="No leaderboard data"
            description="Leaderboard will populate once employees start earning XP."
          />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <>
            {user?.role === "employee" && myRank ? (
              <div
                style={{
                  border: "1px solid var(--accent-border)",
                  background: "var(--accent-bg)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <strong style={{ color: "var(--text-h)" }}>Your rank:</strong> #{myRank}
              </div>
            ) : null}

            <DataTable
              rowKey="employee_id"
              getRowStyle={(r) =>
                myEmployeeId && r.employee_id === myEmployeeId
                  ? { background: "var(--accent-bg)" }
                  : null
              }
              columns={[
                { key: "rank", header: "Rank" },
                { key: "full_name", header: "Name" },
                { key: "department", header: "Department" },
                { key: "level", header: "Level" },
                { key: "total_xp", header: "Total XP" },
                { key: "weekly_xp", header: "Weekly XP" },
                { key: "current_streak", header: "Streak" },
              ]}
              rows={items}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
