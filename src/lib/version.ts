// Site version + build number. BUILD is injected by astro.config.mjs's
// `define` at build time (git short-hash + UTC timestamp); falls back to
// 'dev' in the editor / when the global is absent.
export const VERSION = 'v0.1.0';

declare const __BUILD_NUMBER__: string;
export const BUILD = typeof __BUILD_NUMBER__ !== 'undefined' ? __BUILD_NUMBER__ : 'dev';
