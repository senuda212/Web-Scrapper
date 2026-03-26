import React from "react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"

export default function FieldRow({ field, onChange, onDelete }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-2"><Input label="Name" value={field.name} onChange={(e) => onChange({ ...field, name: e.target.value })} /></div>
      <div className="col-span-5"><Input label="Selector" value={field.selector} onChange={(e) => onChange({ ...field, selector: e.target.value })} /></div>
      <div className="col-span-2"><Select label="Type" value={field.type} onChange={(e) => onChange({ ...field, type: e.target.value })} options={["css", "xpath"]} /></div>
      <div className="col-span-2"><Select label="Attr" value={field.attr} onChange={(e) => onChange({ ...field, attr: e.target.value })} options={["text", "href", "src", "html"]} /></div>
      <div className="col-span-1"><Button variant="red" onClick={onDelete}>X</Button></div>
    </div>
  )
}
