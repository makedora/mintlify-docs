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
  ],
};

const withMDX = createMDX();
export default withMDX(config);
