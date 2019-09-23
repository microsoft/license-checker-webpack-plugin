const Joi = require("@hapi/joi");

const defaultOutputWriter = require("./defaultOutputWriter");

const optionsSchema = Joi.object().keys({
  filter: Joi.object()
    .instance(RegExp)
    .required(),
  allow: Joi.string().required(),
  ignore: Joi.array()
    .items(Joi.string())
    .required(),
  override: Joi.object().required(),
  emitError: Joi.boolean().required(),
  outputWriter: Joi.alternatives()
    .try(Joi.string(), Joi.func())
    .required(),
  outputFilename: Joi.string().required()
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

  const result = optionsSchema.validate(finalOptions);
  if (result.error != null) {
    throw result.error;
  }

  return finalOptions;
};

module.exports = {
  getOptions
};
