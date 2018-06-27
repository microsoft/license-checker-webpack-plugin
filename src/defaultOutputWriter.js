const { resolve } = require("path");

const defaultLicenseWriter = resolve(__dirname, "./defaultOutputTemplate.ejs");

module.exports = defaultLicenseWriter;
