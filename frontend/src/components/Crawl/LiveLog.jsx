import React, { useEffect, useRef } from "react"

export default function LiveLog({ lines }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [lines])
  return (
    <div ref={ref} className="h-96 overflow-auto rounded-lg border border-border bg-black/40 p-3 font-mono text-xs text-green whitespace-pre-wrap">
      {lines.join("\n")}
    </div>
  )
}
