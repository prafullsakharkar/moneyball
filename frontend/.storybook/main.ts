import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@app': path.resolve(__dirname, '../src/app'),
      '@core': path.resolve(__dirname, '../src/core'),
      '@shared': path.resolve(__dirname, '../src/shared'),
      '@modules': path.resolve(__dirname, '../src/modules'),
      '@api': path.resolve(__dirname, '../src/api'),
      '@providers': path.resolve(__dirname, '../src/providers'),
      '@layouts': path.resolve(__dirname, '../src/layouts'),
      '@routes': path.resolve(__dirname, '../src/routes'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@stores': path.resolve(__dirname, '../src/stores'),
      '@domain': path.resolve(__dirname, '../src/types'),
      '@design': path.resolve(__dirname, '../src/design'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    };
    return config;
  },
};

export default config;
