export default function BadgeList({ badges = [] }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {badges.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            background: "var(--social-bg)",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--text-h)" }}>
            {b.badge?.title || "Badge"}
          </div>
          <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
            {b.badge?.description || ""}
          </div>
          {b.earned_at ? (
            <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6 }}>
              Earned: {new Date(b.earned_at).toLocaleDateString()}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
