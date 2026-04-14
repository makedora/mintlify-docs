---
name: hyperbrowser
description: Cloud browser platform for AI agents — scrape, extract, automate
compatibility: Requires Node.js 18+. Uses @hyperbrowser/sdk npm package.
allowed-tools: Bash(npm:*) Bash(npx:*) Bash(node:*) Read Write Edit
metadata:
  author: hyperbrowser
  version: "1.0"
  docs: https://docs.hyperbrowser.ai
  dashboard: https://app.hyperbrowser.ai
  npm: "@hyperbrowser/sdk"
  python: "hyperbrowser"
---

## Setup

1. Install: `npm install @hyperbrowser/sdk`
2. Set API key: `export HYPERBROWSER_API_KEY=your-key` (get one at https://app.hyperbrowser.ai)

## Scrape a page (simplest approach)

```typescript
import Hyperbrowser from "@hyperbrowser/sdk";

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const result = await client.scrape.startAndWait({
  url: "https://news.ycombinator.com",
});

console.log(result.data);
```

No browser management, no CDP, no cleanup.

## Extract structured data

```typescript
import Hyperbrowser from "@hyperbrowser/sdk";

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const result = await client.extract.startAndWait({
  urls: ["https://news.ycombinator.com"],
  schema: {
    type: "object",
    properties: {
      stories: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            url: { type: "string" },
            points: { type: "number" },
          },
        },
      },
    },
  },
  prompt: "Extract the top 5 stories",
});

console.log(result.data);
```

## Manual browser session (Playwright over CDP)

```typescript
import Hyperbrowser from "@hyperbrowser/sdk";
import { chromium } from "playwright-core";

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const session = await client.sessions.create();

try {
  const browser = await chromium.connectOverCDP(session.wsEndpoint);
  const page = browser.contexts()[0].pages()[0];
  await page.goto("https://news.ycombinator.com");
  console.log(await page.title());
  await page.screenshot({ path: "screenshot.png" });
} finally {
  await client.sessions.stop(session.id);
}
```

Always call `client.sessions.stop(session.id)` in a `finally` block. Leaked sessions consume cloud resources.

## AI browser agent

```typescript
import Hyperbrowser from "@hyperbrowser/sdk";

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const result = await client.agents.browserUse.startAndWait({
  task: "Go to Hacker News and find the top 5 stories with their titles and point counts",
});

console.log(result.data);
```

## API Reference

### Hyperbrowser(options)

```typescript
import Hyperbrowser from "@hyperbrowser/sdk";

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `apiKey` | `string` | required | API key from [app.hyperbrowser.ai](https://app.hyperbrowser.ai) |

### client.scrape.startAndWait(options)

Scrapes a page and returns content. Handles browser lifecycle automatically.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `string` | required | Page to scrape |
| `formats` | `string[]` | `["markdown"]` | `"markdown"`, `"html"`, `"links"` |
| `onlyMainContent` | `boolean` | `false` | Strip nav/footer |
| `timeout` | `number` | varies | Max wait ms |

### client.extract.startAndWait(options)

Extracts structured data using AI.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `urls` | `string[]` | required | Pages to extract from |
| `schema` | `object` | required | JSON Schema for output |
| `prompt` | `string` | optional | Extraction instructions |

### client.sessions.create(options?)

Creates a browser session for manual Playwright control.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `useStealth` | `boolean` | `false` | Anti-detection |
| `useProxy` | `boolean` | `false` | Route through proxy |
| `proxyCountry` | `string` | `undefined` | Proxy country |
| `solveCaptchas` | `boolean` | `false` | Auto-solve CAPTCHAs |
| `acceptCookies` | `boolean` | `false` | Auto-accept cookies |

**Returns:** `Session` with:
- `session.id` — session identifier (use with `sessions.stop()`)
- `session.wsEndpoint` — CDP WebSocket URL for `connectOverCDP()`

### client.sessions.stop(sessionId)

Stops a session and frees resources. Always call this in a `finally` block.

### client.agents.browserUse.startAndWait(options)

Runs an autonomous browser agent.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task` | `string` | required | Natural language task description |

## Session Options

```typescript
const session = await client.sessions.create({
  useStealth: true,
  useProxy: true,
  proxyCountry: "US",
  solveCaptchas: true,
  acceptCookies: true,
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `useStealth` | `boolean` | `false` | Anti-detection mode |
| `useProxy` | `boolean` | `false` | Route through proxy |
| `proxyCountry` | `string` | `undefined` | Proxy country code |
| `solveCaptchas` | `boolean` | `false` | Auto-solve CAPTCHAs |
| `acceptCookies` | `boolean` | `false` | Auto-accept cookie banners |

## Common Pitfalls

- **`HYPERBROWSER_API_KEY` not found** — Missing env var. Run `export HYPERBROWSER_API_KEY=your-key`. Get key from [app.hyperbrowser.ai](https://app.hyperbrowser.ai).
- **Session leaked / high usage** — Didn't stop session. Always call `client.sessions.stop(session.id)` in a `finally` block.
- **`connectOverCDP` fails** — Wrong endpoint. Use `session.wsEndpoint`, not `session.url` or `session.cdp_ws_url`.
- **Wrong package name** — Node.js: `@hyperbrowser/sdk`. Python: `hyperbrowser`. Don't mix them up.
- **OOM / Exit code 137** — Browser + Node.js exceeds memory. Allocate 2+ GB memory. Use `scrape.startAndWait()` instead of manual sessions when possible.
- **CAPTCHA blocks scraping** — Anti-bot detection. Use `solveCaptchas: true` and `useStealth: true` in session options.

## When to use what

| Use case | Method |
|----------|--------|
| Simple page scraping | `client.scrape.startAndWait()` |
| Structured data extraction | `client.extract.startAndWait()` |
| Complex multi-step tasks | `client.agents.browserUse.startAndWait()` |
| Full Playwright control | `client.sessions.create()` + CDP |
