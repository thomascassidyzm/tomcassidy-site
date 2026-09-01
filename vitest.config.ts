import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// The source uses the `@/…` alias that tsconfig declares; vitest needs to be
// told about it separately, or anything importing across src/ fails to resolve.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
