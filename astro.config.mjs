import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import svelte from '@astrojs/svelte';
import { execSync } from 'child_process';

// Build-number injection — copied from distinction-physics. Combines a UTC
// timestamp (monotonic across deploys even on Vercel's shallow clone, so the
// indicator always moves when a new build ships) with the short git hash.
function getBuildNumber() {
  try {
    const shortHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const stamp = new Date().toISOString().slice(2, 16).replace(/[-:T]/g, '').replace(/(\d{6})(\d{4})/, '$1-$2');
    return `${stamp}.${shortHash}`;
  } catch {
    return 'dev';
  }
}

const buildNumber = getBuildNumber();

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [svelte()],
  // The teaching programme was briefly live at /exceptional-teaching before the
  // rebrand to Reasonable Teaching; keep the old URL pointing at the new one.
  redirects: {
    '/exceptional-teaching': '/reasonable-teaching',
  },
  vite: {
    define: {
      '__BUILD_NUMBER__': JSON.stringify(buildNumber),
    },
  },
});
