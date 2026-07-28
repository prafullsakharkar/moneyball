require('tsconfig-paths/register');

module.exports = {
  compilerOptions: {
    baseUrl: './src',
    paths: {
      '@shared/*': ['../shared/src/*'],
      '@identity/*': ['./*']
    }
  }
};
