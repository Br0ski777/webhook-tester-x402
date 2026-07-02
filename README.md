# Webhook Tester API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://webhook-tester.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Test webhook endpoints -- send POST/PUT/PATCH/DELETE with custom headers and payloads. Measure latency and TLS. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "webhook-tester": {
      "url": "https://webhook-tester.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://webhook-tester.api.klymax402.com/api/test" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `api_test_webhook` | POST | `/api/test` | $0.002 | Send a test request to a webhook URL and analyze the response |

### `api_test_webhook`

Use this when you need to test a webhook endpoint by sending a request with custom headers, body, and method. Returns full response data in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | Webhook URL to test (must be https) |
| `method` | string | no | HTTP method: POST, PUT, PATCH, DELETE (default: POST) |
| `headers` | object | no | Custom headers as key-value pairs |
| `body` | object | no | JSON body to send |
| `timeout` | number | no | Timeout in seconds (default: 10, max: 30) |

Example response:

```json
{"url":"https://hooks.example.com/callback","method":"POST","statusCode":200,"responseBody":{"received":true},"latency":142,"tlsInfo":{"protocol":"TLSv1.3","cipher":"AES-256-GCM"},"requestSize":256,"responseSize":48}
```

**When to use**: testing webhook integrations, debugging API callbacks, validating endpoint availability, and measuring webhook response times.

**Not for**: web scraping (use `web_scrape_to_markdown`), screenshot capture (use `capture_screenshot`), HTTP header security audit (use `network_analyze_headers`).

## Example agent prompts

- "Test a webhook endpoint by sending a request with custom headers, body, and method"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
