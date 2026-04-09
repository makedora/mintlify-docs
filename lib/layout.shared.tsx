import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Yolocode',
    },
    links: [
      { text: 'Support', url: 'mailto:support@yolocode.ai' },
      { text: 'Launch App', url: 'https://yolocode.ai', external: true },
    ],
    githubUrl: 'https://github.com/makedora',
  };
}
