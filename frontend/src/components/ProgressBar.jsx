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
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: "var(--accent)",
            opacity: 0.7,
          }}
        />
      </div>
      <div style={{ width: 54, textAlign: "right", fontSize: 14 }}>
        {clamped}%
      </div>
    </div>
  );
}
