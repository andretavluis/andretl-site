// Ambient type shims for the Cloudflare Workers Durable Objects runtime,
// scoped minimally to avoid depending on @cloudflare/workers-types
// project-wide. This must be a .d.ts file (not a regular .ts module) so
// TypeScript treats `declare module 'cloudflare:workers'` as declaring a
// new ambient module rather than failing to augment one it can't resolve.

interface DurableObjectState {
  acceptWebSocket: (ws: WebSocket) => void;
  getWebSockets: () => WebSocket[];
}

declare module 'cloudflare:workers' {
  export class DurableObject<Env = unknown> {
    protected ctx: DurableObjectState;
    protected env: Env;
    constructor(ctx: DurableObjectState, env: Env);
  }
}
