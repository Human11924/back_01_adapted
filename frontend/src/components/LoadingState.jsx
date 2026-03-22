export default function LoadingState({ label = "Loading..." }) {
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
      <div style={{ color: "var(--text-h)", fontWeight: 600, fontSize: 15 }}>{label}</div>
      <div style={{ marginTop: 6, color: "var(--text)", fontSize: 13 }}>
        Please wait a moment...
      </div>
    </div>
  );
}
