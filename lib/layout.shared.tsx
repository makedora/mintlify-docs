import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Kernel',
    },
    links: [
      { text: 'Dashboard', url: 'https://dashboard.onkernel.com', external: true },
      { text: 'Docs', url: 'https://www.kernel.sh/docs', external: true },
    ],
    githubUrl: 'https://github.com/onkernel',
  };
}
