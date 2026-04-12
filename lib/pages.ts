export const pages = [
  { path: '/docs', title: 'Overview', description: 'Core capabilities' },
  { path: '/docs/quickstart', title: 'Quickstart', description: 'Get started in 5 minutes' },
  { path: '/docs/sessions', title: 'Sessions', description: 'Browser sessions and CDP connection' },
  { path: '/docs/scraping', title: 'Scraping', description: 'Web scraping and data extraction' },
  { path: '/docs/troubleshooting', title: 'Troubleshooting', description: 'Common errors and fixes' },
  { path: '/docs/api-reference', title: 'API Reference', description: 'SDK reference with all params and types' },
];

export function levenshtein(a: string, b: string): number {
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

export function findSimilar(pathname: string, count = 3) {
  const scored = pages.map((page) => ({
    ...page,
    score: levenshtein(pathname.toLowerCase(), page.path.toLowerCase()),
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, count);
}
