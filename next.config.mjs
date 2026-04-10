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
  ],
};

const withMDX = createMDX();
export default withMDX(config);
