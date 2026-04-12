import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: 'Hyperbrowser' },
    links: [
      { text: 'Dashboard', url: 'https://app.hyperbrowser.ai', external: true },
      { text: 'Docs', url: 'https://docs.hyperbrowser.ai', external: true },
    ],
    githubUrl: 'https://github.com/hyperbrowserai',
  };
}
