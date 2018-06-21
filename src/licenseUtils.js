const { existsSync, readFileSync } = require("fs");
const satisfiesGlob = require("minimatch");
const { satisfies: isSatisfiedVersion } = require("semver");
const isValidLicense = require("spdx-expression-validate");
const isSatisfiedLicense = require("spdx-satisfies");
const LicenseError = require("./LicenseError");

const licenseFilenames = [
  "LICENSE",
  "LICENSE.md",
  "LICENSE.txt",
  "license",
  "license.md",
  "license.txt"
];

const getLicenseContents = dependencyPath => {
  const licenseFilename = licenseFilenames.find(licenseFilename =>
    existsSync(`${dependencyPath}/${licenseFilename}`)
  );
  return licenseFilename && readFileSync(`${dependencyPath}/${licenseFilename}`).toString();
};

const getLicenseInformationForDependency = dependencyPath => {
  const package = require(`${dependencyPath}/package.json`);
  return {
    name: package.name,
    version: package.version,
    author: (package.author && package.author.name) || package.author,
    repository: (package.repository && package.repository.url) || package.repository,
    licenseName: package.license,
    licenseText: getLicenseContents(dependencyPath)
  };
};

const getLicenseInformationForCompilation = (compilation, filter) => {
  const fileDependencies = Array.from(compilation.fileDependencies);
  return fileDependencies.reduce((memo, dependencyPath) => {
    const match = dependencyPath.match(filter);
    if (match) {
      const [, rootPath, dependencyName] = match;
      memo[dependencyName] = getLicenseInformationForDependency(rootPath);
    }
    return memo;
  }, {});
};

const getLicenseViolations = (licenseInformation, allow) => {
  return Object.keys(licenseInformation).reduce((memo, name) => {
    const { version, licenseName } = licenseInformation[name];
    if (!licenseName || licenseName === "UNLICENSED") {
      memo.push(new LicenseError(`${name}@${version} is unlicensed`));
    } else if (!isValidLicense(licenseName) || !isSatisfiedLicense(licenseName, allow)) {
      memo.push(new LicenseError(`${name}@${version} has disallowed license ${licenseName}`));
    }
    return memo;
  }, []);
};

const getSortedLicenseInformation = licenseInformation => {
  const licenses = Object.values(licenseInformation);
  licenses.sort(({ name: nameA }, { name: nameB }) => (nameA < nameB ? -1 : nameA > nameB ? 1 : 0));
  return licenses;
};

const parseVersionExpression = expr => expr.split(/(?!^)@/);

const ignoreLicenses = (licenseInformation, ignore) => {
  return Object.keys(licenseInformation).reduce(
    (memo, dependencyName) =>
      ignore.reduce((memo, ignoredExpression) => {
        const { version: dependencyVersion } = licenseInformation[dependencyName];
        const [ignoredName, ignoredVersionRange] = parseVersionExpression(ignoredExpression);
        const matchesName = satisfiesGlob(dependencyName, ignoredName);
        const matchesVersion =
          !ignoredVersionRange || isSatisfiedVersion(dependencyVersion, ignoredVersionRange);
        if (matchesName && matchesVersion) {
          delete memo[dependencyName];
        }
        return memo;
      }, memo),
    JSON.parse(JSON.stringify(licenseInformation))
  );
};

const overrideLicenses = (licenseInformation, override) => {
  return Object.keys(licenseInformation).reduce(
    (memo, dependencyName) =>
      Object.keys(override).reduce((memo, overriddenKey) => {
        const { version: dependencyVersion } = licenseInformation[dependencyName];
        const [overriddenName, overriddenVersionRange] = parseVersionExpression(overriddenKey);
        const matchesName = dependencyName === overriddenName;
        const matchesVersion =
          !overriddenVersionRange || isSatisfiedVersion(dependencyVersion, overriddenVersionRange);
        if (matchesName && matchesVersion) {
          Object.assign(memo[dependencyName], override[overriddenKey]);
        }
        return memo;
      }, memo),
    JSON.parse(JSON.stringify(licenseInformation))
  );
};

module.exports = {
  getLicenseInformationForCompilation,
  getLicenseViolations,
  getSortedLicenseInformation,
  ignoreLicenses,
  overrideLicenses
};
