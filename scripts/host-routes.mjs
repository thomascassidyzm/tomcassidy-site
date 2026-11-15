// Runs after `astro build`. The Vercel adapter writes .vercel/output/config.json itself and
// ignores rewrites in vercel.json, so a whole-host route has to be added here: the root of
// wol.tomcassidy.co serves the static wheel of life page (public/wol/index.html), and every
// other host is untouched. Placed first, ahead of the adapter's own routes.
import fs from 'node:fs';

const file = '.vercel/output/config.json';
if (!fs.existsSync(file)) { console.log('[host-routes] no Vercel output, skipped'); process.exit(0); }
const config = JSON.parse(fs.readFileSync(file, 'utf8'));
const HOST_ROUTES = [
  { src: '^/(?:index\\.html)?$', has: [{ type: 'host', value: 'wol.tomcassidy.co' }], dest: '/wol/index.html' },
];
config.routes = [...HOST_ROUTES, ...(config.routes || []).filter((r) => !r.has?.some((h) => h.type === 'host' && h.value === 'wol.tomcassidy.co'))];
fs.writeFileSync(file, JSON.stringify(config, null, 2));
console.log(`[host-routes] ${HOST_ROUTES.length} host route(s) added`);
