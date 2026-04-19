import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

export function registerRoutes(app: Hono) {
  app.post("/api/test", async (c) => {
    await tryRequirePayment(0.002);
    const body = await c.req.json().catch(() => null);
    if (!body?.url) return c.json({ error: "Missing required field: url" }, 400);
    let parsed: URL;
    try { parsed = new URL(body.url); } catch { return c.json({ error: "Invalid URL format" }, 400); }
    if (!["http:", "https:"].includes(parsed.protocol)) return c.json({ error: "URL must use http or https" }, 400);
    const hostname = parsed.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10."))
      return c.json({ error: "Cannot test internal/private URLs" }, 400);
    const method = (body.method || "POST").toUpperCase();
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return c.json({ error: "Method must be POST, PUT, PATCH, or DELETE" }, 400);
    const timeout = Math.min(30, Math.max(1, body.timeout || 10)) * 1000;
    const headers: Record<string, string> = { "Content-Type": "application/json", "User-Agent": "WebhookTester/1.0 (x402-api)", ...body.headers };
    const requestBody = body.body ? JSON.stringify(body.body) : undefined;
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const resp = await fetch(body.url, { method, headers, body: requestBody, signal: controller.signal, redirect: "follow" });
      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);
      let responseBody: string;
      try { responseBody = await resp.text(); } catch { responseBody = "[unable to read]"; }
      let parsedResponse: unknown = responseBody;
      if ((resp.headers.get("content-type") || "").includes("application/json")) {
        try { parsedResponse = JSON.parse(responseBody); } catch {}
      }
      const responseHeaders: Record<string, string> = {};
      resp.headers.forEach((v, k) => { responseHeaders[k] = v; });
      return c.json({
        url: body.url, method, requestHeaders: headers, requestBody: body.body || null,
        response: { statusCode: resp.status, statusText: resp.statusText, headers: responseHeaders, body: parsedResponse, contentType: resp.headers.get("content-type") || "", bodySize: responseBody.length },
        latencyMs, tls: parsed.protocol === "https:", redirected: resp.redirected, finalUrl: resp.url, success: resp.status >= 200 && resp.status < 300,
      });
    } catch (e: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return c.json({ url: body.url, method, error: e.name === "AbortError" ? `Timeout after ${timeout / 1000}s` : e.message, errorType: e.name === "AbortError" ? "timeout" : "connection_error", latencyMs, success: false });
    }
  });
}
