import React from "react"
import { format } from "date-fns"
import Badge from "../ui/Badge"
import Button from "../ui/Button"
import Card from "../ui/Card"

export default function SpiderCard({ spider, onRun, onEdit, onDelete }) {
  return (
    <Card className="p-4 flex flex-col gap-4">
      <div>
        <h3 className="font-display text-lg">{spider.name}</h3>
        <p className="text-text-secondary text-sm mt-1">{spider.description || "No description"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge>URLs: {(spider.start_urls || []).length}</Badge>
        <Badge>Fields: {(spider.fields || []).length}</Badge>
      </div>
      <p className="text-xs text-text-muted">
        Created {spider.created_at ? format(new Date(spider.created_at), "PPpp") : "-"}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="green" onClick={onRun}>Run</Button>
        <Button variant="blue" onClick={onEdit}>Edit</Button>
        <Button variant="red" onClick={onDelete}>Delete</Button>
      </div>
    </Card>
  )
}
