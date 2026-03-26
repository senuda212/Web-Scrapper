import React from "react"

function prettyLabel(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function getCellValue(row, key) {
  if (key === "url") return row.url
  if (key === "scraped_at") return row.scraped_at
  return row.data?.[key]
}

export default function DataTable({
  items,
  columns,
  compact = false,
  sortBy,
  sortDirection,
  onSort,
}) {
  return (
    <div className="overflow-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-surface text-text-secondary">
          <tr>
            {columns.map((key) => (
              <th
                key={key}
                className="px-3 py-2 text-left whitespace-nowrap cursor-pointer select-none"
                onClick={() => onSort?.(key)}
              >
                <span className="inline-flex items-center gap-1">
                  {prettyLabel(key)}
                  {sortBy === key ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t border-border">
              {columns.map((key) => (
                <td
                  key={`${row.id}-${key}`}
                  className={`px-3 py-2 align-top ${compact ? "text-xs max-w-[240px] truncate" : ""} ${key === "url" ? "text-text-secondary" : ""}`}
                  title={String(getCellValue(row, key) ?? "")}
                >
                  {key === "scraped_at" && row.scraped_at
                    ? new Date(row.scraped_at).toLocaleString()
                    : String(getCellValue(row, key) ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
