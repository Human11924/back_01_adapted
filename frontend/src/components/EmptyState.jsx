export default function EmptyState({ title = "Nothing here yet", description }) {
  return (
    <div
      style={{
        padding: 24,
        border: "1px solid var(--border)",
        borderRadius: 12,
        background: "rgba(255,255,255,0.84)",
        boxShadow: "0 8px 18px rgba(47, 38, 33, 0.06)",
        textAlign: "left",
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {description ? (
        <p style={{ marginTop: 8, color: "var(--text)", lineHeight: 1.45 }}>{description}</p>
      ) : null}
    </div>
  );
}
