export function createCrawlWebSocket(jobId, handlers) {
  const ws = new WebSocket(`ws://localhost:8000/api/crawls/ws/${jobId}`)
  ws.onopen = () => handlers.onOpen?.()
  ws.onclose = () => handlers.onClose?.()
  ws.onerror = (e) => handlers.onError?.(e)
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      if (msg.type === "log") handlers.onLog?.(msg.line)
      if (msg.type === "status") handlers.onStatus?.(msg.status)
      if (msg.type === "item") handlers.onItem?.(msg.data)
    } catch {
      // Ignore malformed payloads
    }
  }
  return ws
}
