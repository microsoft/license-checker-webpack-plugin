const { getLicenseName } = require("./licenseUtils");

describe("getLicenseName", () => {
  let pkg;
  let licenseName;
  describe("with valid license format", () => {
    beforeEach(() => {
      pkg = { license: "MIT" };
      licenseName = getLicenseName(pkg);
    });
    it(`should return "MIT" license name`, () => {
      expect(licenseName).toBe("MIT");
    });
  });
  describe("with deprecated license format (as object)", () => {
    beforeEach(() => {
      pkg = { license: { type: "MIT" } };
      licenseName = getLicenseName(pkg);
    });
    it(`should return "MIT" license name`, () => {
      expect(licenseName).toBe("MIT");
    });
  });
  describe("with deprecated license format (as array)", () => {
    describe("with only one license", () => {
      beforeEach(() => {
        pkg = { licenses: [{ type: "MIT" }] };
        licenseName = getLicenseName(pkg);
      });
      it(`should return "MIT" license name`, () => {
        expect(licenseName).toBe("MIT");
      });
    });
    describe("with multiple licenses", () => {
      beforeEach(() => {
        pkg = { licenses: [{ type: "MIT" }, { type: "BSD-3-Clause" }] };
        licenseName = getLicenseName(pkg);
      });
      it("should return composite license names as OR", () => {
        expect(licenseName).toBe("(MIT OR BSD-3-Clause)");
      });
    });
  });
  describe("with unknown license value of format", () => {
    beforeEach(() => {
      pkg = { foo: "bar" };
      licenseName = getLicenseName(pkg);
    });
    it("should return empty string", () => {
      expect(licenseName).toBe("");
    });
  });
});
