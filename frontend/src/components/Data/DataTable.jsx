import React from "react"

export default function DataTable({ items }) {
  const dynamicKeys = Object.keys(items?.[0]?.data || {})
  return (
    <div className="overflow-auto border border-border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-surface text-text-secondary">
          <tr>
            <th className="px-3 py-2 text-left">URL</th>
            {dynamicKeys.map((k) => (
              <th key={k} className="px-3 py-2 text-left">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row.id} className="border-t border-border">
              <td className="px-3 py-2 text-text-secondary">{row.url}</td>
              {dynamicKeys.map((k) => (
                <td key={k} className="px-3 py-2">{String(row.data?.[k] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
