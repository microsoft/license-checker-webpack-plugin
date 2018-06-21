const WebpackError = require("webpack/lib/WebpackError");

class LicenseError extends WebpackError {
  constructor(message) {
    super(`License: ${message}`);
    this.name = "LicenseError";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = LicenseError;
