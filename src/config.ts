import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "webhook-tester",
  slug: "webhook-tester",
  description: "Test webhook endpoints -- send POST/PUT/PATCH/DELETE with custom headers and payloads. Measure latency and TLS.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/test",
      price: "$0.002",
      description: "Send a test request to a webhook URL and analyze the response",
      toolName: "api_test_webhook",
      toolDescription: `Use this when you need to test a webhook endpoint by sending a request with custom headers, body, and method. Returns full response data in JSON.

Returns: 1. statusCode 2. responseBody (parsed JSON or text) 3. responseHeaders (key-value map) 4. latency in ms 5. tlsInfo (protocol, cipher) 6. method used 7. requestSize and responseSize in bytes.

Example output: {"url":"https://hooks.example.com/callback","method":"POST","statusCode":200,"responseBody":{"received":true},"latency":142,"tlsInfo":{"protocol":"TLSv1.3","cipher":"AES-256-GCM"},"requestSize":256,"responseSize":48}

Use this FOR testing webhook integrations, debugging API callbacks, validating endpoint availability, and measuring webhook response times.

Do NOT use for web scraping -- use web_scrape_to_markdown instead. Do NOT use for screenshot capture -- use capture_screenshot instead. Do NOT use for HTTP header security audit -- use network_analyze_headers instead.`,
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Webhook URL to test (must be https)" },
          method: { type: "string", description: "HTTP method: POST, PUT, PATCH, DELETE (default: POST)" },
          headers: { type: "object", description: "Custom headers as key-value pairs" },
          body: { type: "object", description: "JSON body to send" },
          timeout: { type: "number", description: "Timeout in seconds (default: 10, max: 30)" },
        },
        required: ["url"],
      },
    },
  ],
};
