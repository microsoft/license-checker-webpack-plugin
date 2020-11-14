const webpack = require("webpack");
const { RawSource } = webpack.sources || require("webpack-sources");
const {
  getLicenseInformationForCompilation,
  getLicenseViolations,
  getSortedLicenseInformation,
  ignoreLicenses,
  overrideLicenses,
  writeLicenseInformation
} = require("./licenseUtils");
const { getOptions } = require("./optionsUtils");

async function buildAsset(compilation, options) {
  const { filter, allow, ignore, override, emitError, outputFilename, outputWriter } = options;

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
  return [
    outputFilename,
    new RawSource(await writeLicenseInformation(outputWriter, sortedLicenseInformation))
  ];
}

class LicenseCheckerWebpackPlugin {
  constructor(options) {
    this.options = getOptions(options);
  }

  apply(compiler) {
    const { name } = this.constructor;
    if (webpack.version.startsWith("4.")) {
      compiler.hooks.emit.tapPromise(name, async compilation => {
        const [filename, source] = await buildAsset(compilation, this.options);
        compilation.assets[filename] = source;
      });
    } else {
      compiler.hooks.thisCompilation.tap(name, compilation => {
        const hook = {
          name,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        };
        compilation.hooks.processAssets.tapPromise(hook, async () => {
          const [filename, source] = await buildAsset(compilation, this.options);
          compilation.emitAsset(filename, source);
        });
      });
    }
  }
}

module.exports = LicenseCheckerWebpackPlugin;
