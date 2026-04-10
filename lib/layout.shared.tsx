import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Notte',
    },
    links: [
      { text: 'Console', url: 'https://console.notte.cc', external: true },
      { text: 'Docs', url: 'https://docs.notte.cc', external: true },
    ],
    githubUrl: 'https://github.com/nottelabs',
  };
}
