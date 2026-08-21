import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['.monkeycode-ai.live'],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@domain': path.resolve(__dirname, 'src/types'),
      '@design': path.resolve(__dirname, 'src/design'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
