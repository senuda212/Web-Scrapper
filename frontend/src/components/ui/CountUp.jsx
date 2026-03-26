import React, { useEffect, useMemo, useRef, useState } from "react"

export default function CountUp({ end = 0, duration = 900, suffix = "", prefix = "" }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  const formatter = useMemo(
    () => new Intl.NumberFormat("en-US", { maximumFractionDigits: Number.isInteger(end) ? 0 : 1 }),
    [end]
  )

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame
    let startTs = 0

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()

        const tick = (ts) => {
          if (!startTs) startTs = ts
          const progress = Math.min((ts - startTs) / duration, 1)
          setValue(end * progress)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [duration, end])

  return <span ref={ref}>{prefix}{formatter.format(value)}{suffix}</span>
}
