'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const pages = [
  { path: '/docs', title: 'Overview', description: 'Core capabilities' },
  { path: '/docs/quickstart', title: 'Quickstart', description: 'Get started in 5 minutes' },
  { path: '/docs/sessions', title: 'Browser Sessions', description: 'Remote Playwright sessions over CDP' },
  { path: '/docs/agents', title: 'Web Agents', description: 'Autonomous AI agents' },
  { path: '/docs/scraping', title: 'Scraping', description: 'Structured data extraction with Pydantic' },
  { path: '/docs/troubleshooting', title: 'Troubleshooting', description: 'Common errors and fixes' },
  { path: '/docs/api-reference', title: 'API Reference', description: 'SDK reference and authentication' },
];

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function findSimilar(pathname: string) {
  const scored = pages.map((page) => ({
    ...page,
    score: levenshtein(pathname.toLowerCase(), page.path.toLowerCase()),
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, 3);
}

export default function NotFound() {
  const pathname = usePathname();
  const suggestions = findSimilar(pathname);

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>404 — Page not found</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{pathname}</code> doesn't exist.
      </p>
      <p style={{ marginBottom: 16 }}>Looking for one of these?</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {suggestions.map((s) => (
          <li key={s.path} style={{ marginBottom: 12 }}>
            <Link href={s.path} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
              {s.path}
            </Link>
            <span style={{ color: '#666' }}> — {s.title}: {s.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
