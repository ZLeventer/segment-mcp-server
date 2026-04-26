const CONFIG_API_URL = "https://api.segmentapis.com";
const TRACKING_API_URL = "https://api.segment.io/v1";

export class SegmentError extends Error {
  constructor(public status: number, public body: unknown, message: string) {
    super(message);
    this.name = "SegmentError";
  }
}

export class SegmentClient {
  constructor(
    private token: string,
    readonly writeKey?: string,
  ) {
    if (!token) throw new Error("SEGMENT_TOKEN is required");
  }

  async configRequest<T = unknown>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    opts: { query?: Record<string, unknown>; body?: unknown } = {},
  ): Promise<T> {
    const url = new URL(`${CONFIG_API_URL}${path}`);
    if (opts.query) {
      for (const [k, v] of Object.entries(opts.query)) {
        if (v === undefined || v === null) continue;
        url.searchParams.set(k, String(v));
      }
    }
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const text = await res.text();
    const parsed = text ? safeJson(text) : null;
    if (!res.ok) {
      throw new SegmentError(res.status, parsed, `Segment ${method} ${path} → ${res.status}`);
    }
    return parsed as T;
  }

  async trackRequest<T = unknown>(path: string, body: unknown): Promise<T> {
    if (!this.writeKey) {
      throw new Error("SEGMENT_WRITE_KEY is required for tracking API calls");
    }
    const credentials = Buffer.from(`${this.writeKey}:`).toString("base64");
    const res = await fetch(`${TRACKING_API_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const parsed = text ? safeJson(text) : null;
    if (!res.ok) {
      throw new SegmentError(res.status, parsed, `Segment track ${path} → ${res.status}`);
    }
    return parsed as T;
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
