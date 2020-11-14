const {
  array,
  assert,
  boolean,
  instance,
  object,
  partial,
  record,
  string,
  union
} = require("superstruct");

const defaultOutputWriter = require("./defaultOutputWriter");

const optionsSchema = object({
  filter: instance(RegExp),
  allow: string(),
  ignore: array(string()),
  override: record(
    string(),
    partial({
      name: string(),
      version: string(),
      repository: string(),
      licenseName: string(),
      licenseText: string()
    })
  ),
  emitError: boolean(),
  outputWriter: union([string(), instance(Function)]),
  outputFilename: string()
});

const defaultOptions = {
  filter: /(^.*[/\\]node_modules[/\\]((?:@[^/\\]+[/\\])?(?:[^/\\]+)))/,
  allow: "(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT)",
  ignore: [],
  override: {},
  emitError: false,
  outputWriter: defaultOutputWriter,
  outputFilename: "ThirdPartyNotice.txt"
};

const getOptions = options => {
  const finalOptions = Object.assign({}, defaultOptions, options);

  assert(finalOptions, optionsSchema);

  return finalOptions;
};

module.exports = {
  getOptions
};
