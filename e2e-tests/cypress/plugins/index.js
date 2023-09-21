/* eslint-disable @typescript-eslint/no-var-requires */
// const {
// 	addMatchImageSnapshotPlugin,
// } = require('cypress-image-snapshot/plugin');
const htmlvalidate = require('cypress-html-validate/dist/plugin');

module.exports = (on) => {
  //	addMatchImageSnapshotPlugin(on, config);

  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      const headlessIndex = launchOptions.args.indexOf('--headless');
      if (headlessIndex > -1) {
        launchOptions.args[headlessIndex] = '--headless=new';
      }
      launchOptions.args.push('--version=116');
      launchOptions.args.push('--window-size=1366,768');
      launchOptions.args.push('--force-device-scale-factor=1');
    }
    return launchOptions;
  });
};

// eslint-disable-next-line  @typescript-eslint/no-var-requires
const percyHealthCheck = require('@percy/cypress/task');

module.exports = (on) => {
  const config = {
    extends: ['html-validate:document'],
  };
  on('task', percyHealthCheck);
  htmlvalidate.install(on, config);
};
