import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pages, findSimilar } from './lib/pages';

const knownPaths = new Set([
  '/',
  '/llms.txt',
  '/favicon.svg',
  ...pages.map((p) => p.path),
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    knownPaths.has(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/logo/') ||
    pathname.match(/\.\w+$/)
  ) {
    return NextResponse.next();
  }

  const suggestions = findSimilar(pathname, 5);
  const body = [
    `# Page not found`,
    ``,
    `\`${pathname}\` does not exist. Similar pages:`,
    ``,
    ...suggestions.map((s) => `- [${s.title}](${s.path}): ${s.description}`),
    ``,
    `All pages: [/llms.txt](/llms.txt)`,
  ].join('\n');

  return new NextResponse(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
