const { RawSource } = require("webpack-sources");
const {
  getLicenseInformationForCompilation,
  getLicenseViolations,
  getSortedLicenseInformation,
  ignoreLicenses,
  overrideLicenses,
  writeLicenseInformation
} = require("./licenseUtils");
const { getOptions } = require("./optionsUtils");

class LicenseCheckerWebpackPlugin {
  constructor(options) {
    this.options = getOptions(options);
  }

  apply(compiler) {
    const {
      filter,
      allow,
      ignore,
      override,
      emitError,
      outputFilename,
      outputWriter
    } = this.options;

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
      // eslint-disable-next-line require-atomic-updates
      compilation.assets[outputFilename] = new RawSource(
        await writeLicenseInformation(outputWriter, sortedLicenseInformation)
      );
    });
  }
}

module.exports = LicenseCheckerWebpackPlugin;
