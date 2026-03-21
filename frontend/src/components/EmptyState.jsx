export default function EmptyState({ title = "Nothing here yet", description }) {
  return (
    <div
      style={{
        padding: 24,
        border: "1px solid var(--border)",
        borderRadius: 10,
        background: "var(--social-bg)",
        textAlign: "left",
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {description ? (
        <p style={{ marginTop: 8, color: "var(--text)" }}>{description}</p>
      ) : null}
    </div>
  );
}
