// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [

    './test/homepage.spec.js',
     './test/registerAndLoginAndCar.spec.js',
     './test/driverslist-nearby.spec.js',
    './test/otherDriversAndrange.spec.js',
     './test/driverslist-sorting.spec.js',
    './test/userStatus.spec.js',
    './test/profile-location.spec.js',
    './test/update-address.spec.js',
    './test/update-contact-information.spec.js',
    './test/update-car.spec.js',





  ],
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
