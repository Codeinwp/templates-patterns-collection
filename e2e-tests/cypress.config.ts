import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'od347f',
  viewportWidth: 1920,
  viewportHeight: 1080,
  retries: 1,
  screenshotsFolder: 'visual-regression/screenshots',
  numTestsKeptInMemory: 0,
  watchForFileChanges: false,
  experimentalStudio: true,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
