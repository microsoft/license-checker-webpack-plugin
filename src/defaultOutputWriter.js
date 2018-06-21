const { readFileSync } = require("fs");
const { resolve } = require("path");

const template = require("lodash.template");

const defaultLicenseTemplate = readFileSync(resolve(__dirname, "./defaultOutputTemplate.ejs"));
const defaultLicenseWriter = dependencies => template(defaultLicenseTemplate)({ dependencies });

module.exports = defaultLicenseWriter;
