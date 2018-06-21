const { RawSource } = require("webpack-sources");
const {
  getLicenseInformationForCompilation,
  getLicenseViolations,
  getSortedLicenseInformation,
  ignoreLicenses,
  overrideLicenses
} = require("./licenseUtils");
const defaultOutputWriter = require("./defaultOutputWriter");

class LicenseCheckerWebpackPlugin {
  constructor(options) {
    this.filter = options.filter || /(^.*\/node_modules\/((?:@[^/]+\/)?(?:[^/]+)))/;
    this.allow = options.allow || "(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT)";
    this.ignore = options.ignore || {};
    this.override = options.override || {};
    this.emitError = options.emitError || false;
    this.outputWriter = options.outputWriter || defaultOutputWriter;
    this.outputFilename = options.outputFilename || "ThirdPartyNotices.txt";
  }

  apply(compiler) {
    const { filter, allow, ignore, override, emitError, outputFilename, outputWriter } = this;

    compiler.hooks.emit.tapPromise("LicenseCheckerWebpackPlugin", async compilation => {
      let licenseInformation = getLicenseInformationForCompilation(compilation, filter);
      licenseInformation = ignoreLicenses(licenseInformation, ignore);
      licenseInformation = overrideLicenses(licenseInformation, override);

      const licenseViolations = getLicenseViolations(licenseInformation, allow);
      if (emitError) {
        compilation.errors.push(...licenseViolations);
      } else {
        compilation.warnings.push(...licenseViolations);
      }

      const sortedLicenseInformation = getSortedLicenseInformation(licenseInformation);
      console.log(JSON.stringify(sortedLicenseInformation, null, 2));
      compilation.assets[outputFilename] = new RawSource(outputWriter(sortedLicenseInformation));
    });
  }
}

module.exports = LicenseCheckerWebpackPlugin;
