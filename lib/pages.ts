export const pages = [
  { path: '/docs', title: 'Overview', description: 'Core capabilities' },
  { path: '/docs/quickstart', title: 'Quickstart', description: 'Get started in 5 minutes' },
  { path: '/docs/browsers', title: 'Cloud Browsers', description: 'Browser sessions via CDP' },
  { path: '/docs/apps', title: 'Deploy Apps', description: 'Serverless browser automations with CLI' },
  { path: '/docs/troubleshooting', title: 'Troubleshooting', description: 'Common errors, package gotchas, correct doc URLs' },
  { path: '/docs/api-reference', title: 'API Reference', description: 'SDK reference, CLI commands' },
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
