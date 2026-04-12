import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "webhook-tester",
  slug: "webhook-tester",
  description: "Test webhook endpoints — send POST/PUT/PATCH with custom headers and payloads, measure latency.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/test",
      price: "$0.002",
      description: "Send a test request to a webhook URL and analyze the response",
      toolName: "api_test_webhook",
      toolDescription: "Use this when you need to test a webhook endpoint by sending a request with custom headers, body, and method. Returns status code, response body, headers, latency, TLS info. Supports POST, PUT, PATCH, DELETE. Do NOT use for web scraping — use web_scrape_to_markdown instead. Do NOT use for screenshot capture — use capture_screenshot instead.",
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
