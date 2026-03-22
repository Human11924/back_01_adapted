export default function ProgressBar({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          height: 10,
          flex: 1,
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: "rgba(255,255,255,0.78)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--accent), #f3b458)",
            boxShadow: "0 0 10px rgba(183, 121, 31, 0.35)",
            transition: "width 260ms ease",
          }}
        />
      </div>
      <div style={{ width: 54, textAlign: "right", fontSize: 14, color: "var(--text-h)", fontWeight: 600 }}>
        {clamped}%
      </div>
    </div>
  );
}
