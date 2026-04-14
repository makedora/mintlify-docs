---
name: notte
description: Browser platform for AI agents — sessions via CDP, autonomous web agents, structured scraping
compatibility: Requires Python >= 3.11. Uses notte-sdk pip package.
allowed-tools: Bash(pip:*) Bash(python:*) Read Write Edit
metadata:
  author: notte
  version: "1.0"
  docs: https://docs.notte.cc
  console: https://console.notte.cc
  pip: "notte-sdk"
  npm: "notte-sdk"
---

# Notte SDK

Browser platform for AI agents. Cloud Chromium sessions via CDP, autonomous web agents, and structured scraping with Pydantic models.

> The marketing site is notte.cc. Technical docs are at [docs.notte.cc](https://docs.notte.cc).

## Setup

### 1. Get an API key

Sign up at [console.notte.cc](https://console.notte.cc). Free tier includes 100 browser hours — no credit card required.

### 2. Set environment variable

```bash
export NOTTE_API_KEY=your-api-key-here
```

The SDK reads `NOTTE_API_KEY` from your environment automatically.

### 3. Install the SDK

```bash
# Python (requires >= 3.11)
pip install notte-sdk

# JavaScript
npm install notte-sdk
```

For browser sessions with Playwright, also install it:

```bash
pip install playwright
```

## Browser Sessions

Browser sessions give you a cloud Chromium instance accessible via Chrome DevTools Protocol (CDP). Connect with Playwright, Puppeteer, or any CDP-compatible tool.

### Basic session with Playwright

```python
from playwright.sync_api import sync_playwright
from notte_sdk import NotteClient

client = NotteClient()

with client.Session() as session:
    cdp_url = session.cdp_url()

    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(cdp_url)
        page = browser.contexts[0].pages[0]
        page.goto("https://example.com")
        content = page.content()
        print(content)
```

### Session lifecycle

Sessions are managed with a context manager (`with` block). The session is created on entry and destroyed on exit. This ensures cleanup even if your script crashes.

```python
with client.Session() as session:
    # ... your code here
    pass
# Session destroyed here
```

### Session timeouts

```python
with client.Session(
    idle_timeout_minutes=30,      # close after 30min idle
    max_duration_minutes=120,     # hard limit: 2 hours
) as session:
    # ...
```

### Live viewer for debugging

Use `open_viewer=True` to get a live view URL:

```python
with client.Session(open_viewer=True) as session:
    # Viewer URL is printed to stdout
    ...
```

### Session features

| Feature | Value |
|---------|-------|
| Protocol | Chrome DevTools Protocol (CDP) |
| Browser | Chromium |
| Connection method | `connect_over_cdp(cdp_url)` |
| Auto-cleanup | Yes (context manager) |
| Timeout params | `idle_timeout_minutes`, `max_duration_minutes` |
| Anti-detection | Built-in |
| Proxies | Residential, included |
| Concurrent sessions (free) | Up to 5 |

## Web Agents

Autonomous AI agents that browse and complete tasks from natural language prompts. No CSS selectors, no XPath, no maintenance.

### Basic usage

```python
from notte_sdk import NotteClient

client = NotteClient()

with client.Session() as session:
    agent = client.Agent(session=session, max_steps=5)
    response = agent.run(
        task="Find the pricing page and extract all plan names and prices",
        url="https://example.com"
    )
    print(response)
```

### Important: keyword arguments only

`agent.run()` takes keyword arguments — not a positional string:

```python
# Correct
response = agent.run(task="...", url="https://...")

# Wrong — raises TypeError
response = agent.run("Find the top stories")
```

### Agent tips

- Keep `max_steps` low (3-5) for simple tasks. Increase for multi-page workflows.
- Higher step counts use more tokens and browser time.
- Agents are model-agnostic — they work with OpenAI, Anthropic, and Gemini. The model is configured on the Notte platform side.

## Scraping with Pydantic

One-shot structured data extraction. Define a Pydantic model for your output schema, and Notte handles navigation, extraction, and parsing.

### Basic scraping

```python
from pydantic import BaseModel
from notte_sdk import NotteClient

class Story(BaseModel):
    title: str
    url: str
    points: int

class Feed(BaseModel):
    stories: list[Story]

client = NotteClient()

result = client.scrape(
    url="https://news.ycombinator.com",
    response_format=Feed,
    instructions="Extract the top 5 posts from the front page"
)

for i, story in enumerate(result.data.stories, 1):
    print(f"{i}. {story.points}pts - {story.title}")
```

### Scraping tips

- Be specific in your `instructions`. "Extract the top 5 posts" works better than "get posts".
- Include field names if the page is ambiguous.
- The `response_format` model is enforced — Notte will return data matching your exact schema or raise an error. No need to validate manually.

## API Reference

### NotteClient

```python
from notte_sdk import NotteClient

client = NotteClient(api_key: str | None = None)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | `str \| None` | `None` | API key. Falls back to `NOTTE_API_KEY` env var |

Or pass it directly:

```python
client = NotteClient(api_key="your-api-key-here")
```

### client.Session()

Creates a cloud browser session. Use as a context manager.

```python
with client.Session(
    open_viewer=False,
    idle_timeout_minutes=30,
    max_duration_minutes=120,
) as session:
    cdp_url = session.cdp_url()
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `open_viewer` | `bool` | `False` | Print a live view URL for debugging |
| `idle_timeout_minutes` | `int` | `30` | Close session after N minutes idle |
| `max_duration_minutes` | `int` | `120` | Hard session time limit |

**Returns:** `Session` object with:
- `session.cdp_url() -> str` — CDP WebSocket URL for Playwright

### client.Agent()

Creates an autonomous web agent bound to a session.

```python
agent = client.Agent(session=session, max_steps=5)
response = agent.run(task="...", url="https://...")
```

**`client.Agent()` parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `session` | `Session` | required | An active Notte session |
| `max_steps` | `int` | `5` | Maximum navigation steps |

**`agent.run()` parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task` | `str` | required | Natural language task description |
| `url` | `str` | required | Starting URL |

**Returns:** `str` — agent's response text

### client.scrape()

One-shot structured data extraction with Pydantic models.

```python
result = client.scrape(
    url="https://news.ycombinator.com",
    response_format=MyModel,
    instructions="Extract the top 5 posts",
)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | `str` | required | Page to scrape |
| `response_format` | `type[BaseModel]` | required | Pydantic model defining output schema |
| `instructions` | `str` | required | What to extract (natural language) |

**Returns:** `ScrapeResult` with:
- `result.data` — parsed Pydantic model instance matching `response_format`

### Pricing

| Resource | Cost |
|----------|------|
| Browser time | $0.05/hour |
| Proxy traffic | $10/GB |
| Agent tokens | Pass-through (no markup) |

Free tier: 100 browser hours, 5 concurrent sessions, no credit card required.

## Troubleshooting

- **`NOTTE_API_KEY is NOT SET`** — Missing environment variable. Run `export NOTTE_API_KEY=your-key`. Get your key from [console.notte.cc](https://console.notte.cc).
- **`'Page.enable' wasn't found` (CDP -32601)** — CDP version mismatch. Use `connect_over_cdp()` not `connect()`. Use `p.chromium` not `p.firefox` or `p.webkit`.
- **Session timeout / no response** — Session expired or network issue. Sessions auto-close after inactivity. Create a new session and retry.
- **`playwright._impl._errors.Error: Browser closed`** — Session ended before script completed. Use the `with client.Session()` context manager for proper lifecycle management.
- **`ModuleNotFoundError: No module named 'notte_sdk'`** — SDK not installed. Run `pip install notte-sdk`. Requires Python >= 3.11.
- **`ModuleNotFoundError: No module named 'playwright'`** — Playwright not installed. Run `pip install playwright` (needed for browser sessions, not for agents or scraping).
- **`TypeError` on `agent.run()`** — Passing a string instead of kwargs. Use `agent.run(task="...", url="...")` not `agent.run("...")`.
- **`timeoutMinutes` has no effect** — Wrong parameter name. Use `idle_timeout_minutes` and `max_duration_minutes` (not `timeoutMinutes`).

### Debugging tips

- Enable the live viewer to watch your session in real-time: `client.Session(open_viewer=True)`. The viewer URL is printed when the session starts.
- Verify your API key: `echo $NOTTE_API_KEY`
- Check the key hasn't expired in [console.notte.cc](https://console.notte.cc)
- Ensure you're not exceeding your plan's concurrent session limit (free: 5 sessions)

### Getting help

- [Notte documentation](https://docs.notte.cc)
- [Notte console](https://console.notte.cc)
- [GitHub](https://github.com/nottelabs)
