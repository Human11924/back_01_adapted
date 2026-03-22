export default function KpiCard({ label, value, hint }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
        background: "rgba(255,255,255,0.85)",
        boxShadow: "0 8px 18px rgba(47, 38, 33, 0.06)",
        textAlign: "left",
      }}
    >
      <div style={{ fontSize: 13, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, color: "var(--text-h)", marginTop: 6, fontWeight: 700 }}>
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
