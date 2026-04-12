import { createMDX } from 'fumadocs-mdx/next';

const config = {
  reactStrictMode: true,
  redirects: async () => [
    { source: '/getting-started', destination: '/docs/quickstart', permanent: false },
    { source: '/quickstart', destination: '/docs/quickstart', permanent: false },
    { source: '/docs/getting-started', destination: '/docs/quickstart', permanent: false },
    { source: '/guide', destination: '/docs/quickstart', permanent: false },
    { source: '/guides', destination: '/docs', permanent: false },
    { source: '/docs/guides', destination: '/docs', permanent: false },
    { source: '/docs/browsers/sessions', destination: '/docs/browsers', permanent: false },
    { source: '/docs/sdk', destination: '/docs/api-reference', permanent: false },
    { source: '/docs/deploy', destination: '/docs/apps', permanent: false },
    { source: '/docs/apps/overview', destination: '/docs/apps', permanent: false },
    { source: '/api-reference', destination: '/docs/api-reference', permanent: true },
    { source: '/cloud-browsers', destination: '/docs/browsers', permanent: true },
    { source: '/browsers', destination: '/docs/browsers', permanent: true },
    { source: '/troubleshooting', destination: '/docs/troubleshooting', permanent: true },
    { source: '/apps', destination: '/docs/apps', permanent: true },
    { source: '/getting-started/:path*', destination: '/docs/quickstart', permanent: false },
    { source: '/reference/:path*', destination: '/docs/api-reference', permanent: false },
    { source: '/guides/:path*', destination: '/docs/quickstart', permanent: false },
    { source: '/docs/reference/:path*', destination: '/docs/api-reference', permanent: false },
    { source: '/docs/guides/:path*', destination: '/docs/quickstart', permanent: false },
    { source: '/docs/getting-started/:path*', destination: '/docs/quickstart', permanent: false },
    { source: '/.well-known/llms.txt', destination: '/llms.txt', permanent: true },
  ],
};

const withMDX = createMDX();
export default withMDX(config);
