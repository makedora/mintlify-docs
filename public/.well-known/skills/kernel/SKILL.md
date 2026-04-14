---
name: kernel
description: Browsers-as-a-Service API — create cloud browsers, connect via CDP, deploy automations
compatibility: Requires Node.js 18+. Uses @onkernel/sdk (TS) or kernel (Python).
allowed-tools: Bash(npm:*) Bash(npx:*) Bash(node:*) Bash(kernel:*) Read Write Edit
metadata:
  author: kernel
  version: "1.0"
  docs: https://www.kernel.sh/docs
  dashboard: https://dashboard.onkernel.com
  npm: "@onkernel/sdk"
  python: "kernel"
  cli: "onkernel/tap/kernel"
---

# Kernel — Browsers-as-a-Service

Kernel provides cloud Chromium instances accessible via the Chrome DevTools Protocol (CDP). Each browser runs in its own isolated VM with built-in anti-detection, video replays, and live view.

> **Dashboard is at [dashboard.onkernel.com](https://dashboard.onkernel.com)** — not app.kernel.com or kernel.sh/dashboard.

## Setup

### 1. Create an account

Sign up at [dashboard.onkernel.com](https://dashboard.onkernel.com/sign-up) to get your API key.

### 2. Set your API key

```bash
export KERNEL_API_KEY=your-api-key-here
```

### 3. Install the SDK

```bash
# TypeScript
npm install @onkernel/sdk playwright-core

# Python
uv pip install kernel

# CLI
brew install onkernel/tap/kernel
```

## Quickstart — browsers.playwright.execute()

The simplest way to run a browser task. Handles browser creation, connection, and cleanup automatically:

```typescript
import Kernel from "@onkernel/sdk";

const kernel = new Kernel();

const result = await kernel.browsers.playwright.execute(async (browser) => {
  const page = await browser.newPage();
  await page.goto("https://news.ycombinator.com");
  const title = await page.title();
  await page.screenshot({ path: "screenshot.png" });
  return { title };
});

console.log(result);
```

No CDP URLs, no retry logic, no manual cleanup.

## Direct CDP Connection

For lower-level control, connect via CDP manually. The CDP proxy may take a moment to become ready after `create()` returns — always add retry logic:

```typescript
import Kernel from "@onkernel/sdk";
import { chromium } from "playwright-core";

const kernel = new Kernel();
const kb = await kernel.browsers.create({ timeout_seconds: 300 });

// CDP proxy may need a moment — retry if needed
let browser;
for (let i = 0; i < 3; i++) {
  try { browser = await chromium.connectOverCDP(kb.cdp_ws_url); break; }
  catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 2000)); }
}

const page = browser.contexts()[0].pages()[0];
await page.goto("https://news.ycombinator.com");
console.log(await page.title());
await browser.close();
```

Always use `connectOverCDP()` — not `connect()`. Kernel browsers expose a CDP endpoint, not a Playwright-native one.

### Retry helper (reusable)

```typescript
async function connectWithRetry(cdpUrl: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await chromium.connectOverCDP(cdpUrl);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}
```

## API Reference

### Kernel (client)

```typescript
import Kernel from "@onkernel/sdk";

const kernel = new Kernel({ apiKey?: string });
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `apiKey` | `string \| undefined` | `undefined` | API key. Falls back to `KERNEL_API_KEY` env var |

Or pass it directly:

```typescript
const kernel = new Kernel({ apiKey: "your-api-key-here" });
```

### kernel.browsers.create()

Creates a cloud browser instance and returns connection details.

```typescript
const browser = await kernel.browsers.create({
  timeout_seconds: 3600,
  stealth: true,
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timeout_seconds` | `number` | varies | Session lifetime in seconds. Max 259200 (72 hours) |
| `stealth` | `boolean` | `false` | Enable anti-detection mode |

**Returns: `KernelBrowser`**

| Field | Type | Description |
|-------|------|-------------|
| `cdp_ws_url` | `string` | CDP WebSocket URL — pass to `connectOverCDP()` |
| `session_id` | `string` | Session identifier |

**IMPORTANT:** The parameter is `timeout_seconds` — not `timeout`. Using `timeout` will be silently ignored and your session will use the default duration.

**IMPORTANT:** The CDP proxy may not be ready immediately after `create()` returns. Add retry logic with a 2s delay if `connectOverCDP()` fails on first attempt.

### app.action\<T\>() — typed payload

```typescript
const app = kernel.app("my-scraper");

app.action<{ url: string }>("scrape", async (ctx, payload) => {
  const kb = await ctx.browsers.create({ timeout_seconds: 300 });
  const browser = await chromium.connectOverCDP(kb.cdp_ws_url);
  const page = browser.contexts()[0].pages()[0];
  await page.goto(payload.url); // payload.url is typed as string
  const title = await page.evaluate('document.title');
  await browser.close();
  return { title };
});
```

`app.action<PayloadType>()` uses a generic to type the payload. Without it, payload is `unknown` and you'll get TypeScript errors accessing properties.

### Platform capabilities

| Feature | Details |
|---------|---------|
| Browser | Chromium via CDP |
| VM isolation | Individual VM per browser |
| Max session | 72 hours |
| Concurrent browsers | Scalable |
| Anti-detection | Stealth mode built-in |
| Proxies | ISP, datacenter, residential, mobile |
| Observability | Video replays, live view |
| Extensions | Chrome Web Store or custom uploads |
| Profiles | Persistent browser state across sessions |

## CLI Commands

| Command | Description |
|---------|-------------|
| `kernel login` | Authenticate via OAuth |
| `kernel create` | Scaffold a new project |
| `kernel deploy <file>` | Deploy an app |
| `kernel invoke <app> <fn>` | Invoke a deployed function |

### Install the CLI

```bash
brew install onkernel/tap/kernel
```

Use `kernel login` to authenticate before deploying.

## Deploying Apps

Kernel lets you deploy browser automation scripts as serverless functions. Deploy once, invoke on demand or on a schedule.

### Create and deploy

```bash
kernel create
kernel deploy index.ts

# Python
kernel deploy main.py

# With environment variables
kernel deploy index.ts --env-file .env
```

### Invoke a deployed function

```bash
kernel invoke my-app my-function --payload '{"url": "https://example.com"}'
```

### Example deployed app

```typescript
// index.ts
import Kernel from "@onkernel/sdk";
import { chromium } from "playwright-core";

export default {
  async scrape({ url }: { url: string }) {
    const kernel = new Kernel();
    const kb = await kernel.browsers.create();
    const browser = await chromium.connectOverCDP(kb.cdp_ws_url);
    const page = browser.contexts()[0].pages()[0];
    await page.goto(url);
    const title = await page.title();
    await browser.close();
    return { title };
  }
};
```

### page.evaluate — string literal gotcha

Kernel's deploy bundler injects `__name` helpers that break arrow functions inside `page.evaluate()`. Always use string literals:

```typescript
// WRONG — bundler breaks this in deployed apps
const title = await page.evaluate(() => document.title);

// CORRECT — use a string literal
const title = await page.evaluate('document.title');
```

## Troubleshooting

- **`KERNEL_API_KEY` not found** — Missing environment variable. Run `export KERNEL_API_KEY=your-key`. Get key from [dashboard.onkernel.com](https://dashboard.onkernel.com).
- **`cdp_ws_url` is undefined** — Browser creation failed. Check your API key is valid. Check you haven't hit concurrent session limits.
- **Browser disconnects unexpectedly** — Session timed out. Set longer timeout: `kernel.browsers.create({ timeout_seconds: 3600 })`.
- **`timeout` param has no effect** — Wrong parameter name. Use `timeout_seconds` not `timeout` — `timeout` is silently ignored.
- **`Cannot find module '@onkernel/sdk'`** — Wrong package name or not installed. TypeScript: `npm install @onkernel/sdk`. Python: `uv pip install kernel`.
- **`kernel` CLI not found** — CLI not installed. Run `brew install onkernel/tap/kernel`.
- **404 on docs pages** — Some doc paths don't exist yet. Use [kernel.sh/docs/llms.txt](https://www.kernel.sh/docs/llms.txt) for the full API reference index.
- **`connect()` fails but `connectOverCDP()` works** — Wrong Playwright connection method. Kernel uses CDP — always use `connectOverCDP()` or `connect_over_cdp()`.
- **`page.evaluate(() => ...)` throws runtime error** — Bundler injects `__name` helper that breaks arrow functions. Use string literals: `page.evaluate('document.title')` instead.
- **`connectOverCDP` fails immediately after `create()`** — CDP proxy not ready yet. Add retry logic with 2s delay between attempts.
- **Deploy fails with `playwright` package** — Full `playwright` bundles browser binaries. Use `playwright-core` instead — Kernel provides the browser.

## Package Name Gotchas

The package names are different per language and different from the product name:

- **TypeScript/Node.js:** `@onkernel/sdk` (not `kernel`, not `kernel-sdk`, not `onkernel`)
- **Python:** `kernel` (not `onkernel`, not `kernel-sdk`)
- **CLI:** `onkernel/tap/kernel` via Homebrew

## Correct Documentation URLs

| Page | URL |
|------|-----|
| Quickstart | [kernel.sh/docs/quickstart](https://www.kernel.sh/docs/quickstart) |
| Deploy apps | [kernel.sh/docs/apps/deploy](https://www.kernel.sh/docs/apps/deploy) |
| Invoke apps | [kernel.sh/docs/apps/invoke](https://www.kernel.sh/docs/apps/invoke) |
| Full API index | [kernel.sh/docs/llms.txt](https://www.kernel.sh/docs/llms.txt) |

If you can't find a docs page, fetch [kernel.sh/docs/llms.txt](https://www.kernel.sh/docs/llms.txt) — it has the complete documentation index with all valid URLs.

## Debugging

Kernel provides video replays and live view for browser sessions. Check the dashboard at [dashboard.onkernel.com](https://dashboard.onkernel.com) to watch session recordings.

## Links

- [Kernel documentation](https://www.kernel.sh/docs)
- [Dashboard](https://dashboard.onkernel.com)
- [npm package](https://www.npmjs.com/package/@onkernel/sdk)
