import React from "react"
import Button from "../ui/Button"

export default function ExportPanel({ onJson, onCsv, onXlsx }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="blue" onClick={onJson}>Export JSON</Button>
      <Button variant="blue" onClick={onCsv}>Export CSV</Button>
      <Button variant="blue" onClick={onXlsx}>Export XLSX</Button>
    </div>
  )
}
