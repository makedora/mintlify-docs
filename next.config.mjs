import { createMDX } from 'fumadocs-mdx/next';

const config = {
  reactStrictMode: true,
  redirects: async () => [
    { source: '/getting-started', destination: '/docs/quickstart', permanent: false },
    { source: '/quickstart', destination: '/docs/quickstart', permanent: false },
    { source: '/docs/getting-started', destination: '/docs/quickstart', permanent: false },
    { source: '/getting-started/:path*', destination: '/docs/quickstart', permanent: false },
    { source: '/reference/:path*', destination: '/docs/api-reference', permanent: false },
    { source: '/guides/:path*', destination: '/docs/quickstart', permanent: false },
    { source: '/api-reference', destination: '/docs/api-reference', permanent: true },
    { source: '/.well-known/llms.txt', destination: '/llms.txt', permanent: true },
  ],
};

const withMDX = createMDX();
export default withMDX(config);
