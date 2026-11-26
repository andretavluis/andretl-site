import { DurableObject } from 'cloudflare:workers';

declare class WebSocketPair {
  0: WebSocket;
  1: WebSocket;
}

declare global {
  interface ResponseInit {
    webSocket?: WebSocket;
  }
}

export class PresenceRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.ctx.acceptWebSocket(server);
    this.broadcastCount();

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    ws.close(code, reason);
    this.broadcastCount();
  }

  async webSocketError() {
    this.broadcastCount();
  }

  async webSocketMessage() {
    // No client-to-server messages expected for this feature.
  }

  private broadcastCount() {
    const sockets = this.ctx.getWebSockets();
    const payload = JSON.stringify({ count: sockets.length });
    for (const socket of sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    }
  }
}
