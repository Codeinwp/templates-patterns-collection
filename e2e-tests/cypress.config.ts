import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'od347f',
  viewportWidth: 1920,
  viewportHeight: 1080,
  retries: 1,
  screenshotsFolder: 'visual-regression/screenshots',
  videoUploadOnPasses: false,
  numTestsKeptInMemory: 0,
  watchForFileChanges: false,
  experimentalStudio: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  output: {
    chunkFormat: 'jsonp-array-push',
  },
});
