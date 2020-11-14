const { getOptions } = require("./optionsUtils");

const defaults = {
  allow: "(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT)",
  emitError: false,
  filter: expect.any(RegExp),
  ignore: [],
  outputFilename: "ThirdPartyNotice.txt",
  outputWriter: expect.any(String),
  override: {}
};

describe("getOptions", () => {
  it("should provide defaults when undefined", () => {
    expect(getOptions()).toStrictEqual(defaults);
  });

  it("should provide defaults when empty", () => {
    expect(getOptions({})).toStrictEqual(defaults);
  });

  it("should throw for unknown property", () => {
    expect(() => getOptions({ bad: 1 })).toThrowErrorMatchingInlineSnapshot(
      `"Expected a value of type \`never\` for \`bad\` but received \`1\`."`
    );
  });

  it("should accept 'ignore' property", () => {
    const options = { ignore: ["assignment@^2.0.0"] };
    expect(getOptions(options)).toStrictEqual(Object.assign({}, defaults, options));
  });

  it("should accept 'outputWriter' property as function", () => {
    const options = { outputWriter: () => "some output" };
    expect(getOptions(options)).toStrictEqual(Object.assign({}, defaults, options));
  });

  it("should accept 'override' property", () => {
    const options = { override: { "assignment@^2.0.0": { licenseName: "MIT" } } };
    expect(getOptions(options)).toStrictEqual(Object.assign({}, defaults, options));
  });

  it("should throw for unknown 'override' value property", () => {
    const options = { override: { "assignment@^2.0.0": { licenceName: "MIT" } } };
    expect(() => getOptions(options)).toThrowErrorMatchingInlineSnapshot(
      `"Expected a value of type \`never\` for \`override.assignment@^2.0.0.licenceName\` but received \`\\"MIT\\"\`."`
    );
  });
});
