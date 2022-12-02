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

describe("defaults behaviour", () => {
  const { filter } = getOptions();

  test.each([
    // Modules are things under node_modules
    ["/base/node_modules/a-proj/dist/index.js", ["/base/node_modules/a-proj", "a-proj"]],
    ["/base/node_modules/a-proj/dist", ["/base/node_modules/a-proj", "a-proj"]],
    ["/base/node_modules/a-proj", ["/base/node_modules/a-proj", "a-proj"]],
    ["/base/node_modules", null],
    ["/base", null],
    ["/", null],
    // Scoped names have two parts
    ["/base/node_modules/@babel/runtime/", ["/base/node_modules/@babel/runtime", "@babel/runtime"]],
    ["/base/node_modules/@babel", null],
    // Modules can be nested and deepest is retrieved
    [
      "/base/node_modules/a-proj/node_modules/b-proj/index.js",
      ["/base/node_modules/a-proj/node_modules/b-proj", "b-proj"]
    ],
    [
      "/base/node_modules/@a/proj/node_modules/b-proj/index.js",
      ["/base/node_modules/@a/proj/node_modules/b-proj", "b-proj"]
    ],
    [
      "/base/node_modules/@a/proj/node_modules/@b/proj/src/index.mjs",
      ["/base/node_modules/@a/proj/node_modules/@b/proj", "@b/proj"]
    ],
    [
      "/base/node_modules/a-proj/node_modules/@b/proj/src/index.mjs",
      ["/base/node_modules/a-proj/node_modules/@b/proj", "@b/proj"]
    ],
    // Backslashes are allowed as separators
    ["C:\\No\\node_modules\\a-proj\\dist\\index.js", ["C:\\No\\node_modules\\a-proj", "a-proj"]]
  ])("filter %#", (path, expected) => {
    const result = filter.exec(path);
    expect(result ? result.slice(1) : result).toEqual(expected);
  });
});
