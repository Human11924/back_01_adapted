export default function KpiCard({ label, value, hint }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
        background: "var(--social-bg)",
        textAlign: "left",
      }}
    >
      <div style={{ fontSize: 14, color: "var(--text)" }}>{label}</div>
      <div style={{ fontSize: 28, color: "var(--text-h)", marginTop: 6 }}>
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: 14, color: "var(--text)", marginTop: 6 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
