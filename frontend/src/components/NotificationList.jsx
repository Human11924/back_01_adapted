export default function NotificationList({ items = [], onMarkRead, showMarkRead = true }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            background: "var(--social-bg)",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{n.title}</div>
              <div style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
                {n.message}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6 }}>
                {n.type}{n.created_at ? ` • ${new Date(n.created_at).toLocaleString()}` : ""}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <div
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: `1px solid ${n.is_read ? "var(--border)" : "var(--accent-border)"}`,
                  background: n.is_read ? "transparent" : "var(--accent-bg)",
                  color: n.is_read ? "var(--text)" : "var(--accent)",
                }}
              >
                {n.is_read ? "Read" : "Unread"}
              </div>

              {showMarkRead && !n.is_read ? (
                <button
                  onClick={() => onMarkRead?.(n)}
                  style={{
                    cursor: "pointer",
                    borderRadius: 10,
                    padding: "8px 10px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-h)",
                  }}
                >
                  Mark as read
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
