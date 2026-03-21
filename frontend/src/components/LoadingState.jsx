export default function LoadingState({ label = "Loading..." }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ color: "var(--text)" }}>{label}</div>
    </div>
  );
}
