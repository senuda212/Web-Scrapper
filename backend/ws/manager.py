import json

from fastapi import WebSocket


class WebSocketManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, job_id: str):
        await websocket.accept()
        self.connections.setdefault(job_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, job_id: str):
        if job_id in self.connections:
            self.connections[job_id] = [ws for ws in self.connections[job_id] if ws != websocket]

    async def broadcast(self, job_id: str, message: dict):
        if job_id not in self.connections:
            return
        dead: list[WebSocket] = []
        for ws in self.connections[job_id]:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.connections[job_id].remove(ws)

    async def broadcast_all(self, message: dict):
        for job_id in list(self.connections.keys()):
            await self.broadcast(job_id, message)


ws_manager = WebSocketManager()
