// Identity Service Start Script

import { register } from 'tsconfig-paths';

register({
  baseUrl: '../shared/src',
  paths: {
    '@shared/*': ['*'],
    '@identity/*': ['./*']
  }
});

import('./src/server.js');
