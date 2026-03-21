export default function DataTable({ columns, rows, rowKey, getRowStyle, onRowClick }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "var(--social-bg)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "12px 12px",
                  fontWeight: 600,
                  color: "var(--text-h)",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 14,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const key =
              typeof rowKey === "function" ? rowKey(row) : row[rowKey] ?? idx;

            const clickable = typeof onRowClick === "function";

            return (
              <tr
                key={key}
                onClick={clickable ? () => onRowClick(row) : undefined}
                style={{
                  borderBottom: "1px solid var(--border)",
                  cursor: clickable ? "pointer" : undefined,
                  ...(typeof getRowStyle === "function" ? getRowStyle(row) : null),
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "12px 12px", fontSize: 15 }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
