# license-checker-webpack-plugin

Webpack plugin that verifies licenses of all external dependencies in a compilation, and outputs all that information to a file.

## Installation

### npm

```
npm install license-checker-webpack-plugin --save-dev
```

### yarn

```
yarn add license-checker-webpack-plugin --dev
```

## Usage

Require the plugin into your Webpack configuration, and pass it to the `plugins` array.

```js
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");

module.exports = {
  // ...
  plugins: [new LicenseCheckerWebpackPlugin({ outputFilename: "ThirdPartyNotices.txt" })]
};
```

## Options

| Property         | Type                   | Default                                                    | Description                                                                                                                                                       |
| ---------------- | ---------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allow`          | `string`               | `"(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT)"`    | SPDX expression with allowed licenses.                                                                                                                            |
| `ignore`         | `array`                | `[]`                                                       | Array of dependencies to ignore, in the format `["<dependency name>@<version range>"]`. For example, `["assignment@^2.0.0"]`.                                     |
| `override`       | `object`               | `{}`                                                       | Object of dependencies to override, in the format `{"<dependency name>@<version range>": { ... }}`. For example, `{"assignment@^2.0.0": { licenseName: "MIT" }}`. |
| `emitError`      | `boolean`              | `false`                                                    | Whether to emit errors instead of warnings.                                                                                                                       |
| `outputWriter`   | `string` or `function` | See [`defaultOutputWriter`](./src/defaultOutputWriter.js). | Path to a `.ejs` template, or function that will generate the contents of the third-party notices file.                                                           |
| `outputFilename` | `string`               | `"ThirdPartyNotices.txt"`                                  | Name of the third-party notices file with all licensing information.                                                                                              |

The data that gets passed to the `outputWriter` function looks like this:

```json
[
  {
    "name": "react",
    "version": "16.3.2",
    "repository": "git+https://github.com/facebook/react.git",
    "licenseName": "MIT",
    "licenseText": "MIT License\n\nCopyright (c) 2013-present, Facebook, Inc. [...]"
  },
  {
    "name": "webpack",
    "version": "4.8.3",
    "author": "Tobias Koppers @sokra",
    "repository": "git+https://github.com/webpack/webpack.git",
    "licenseName": "MIT",
    "licenseText": "Copyright JS Foundation and other contributors [...]"
  },
  {
    "name": "whatwg-fetch",
    "version": "2.0.4",
    "repository": "git+https://github.com/github/fetch.git",
    "licenseName": "MIT",
    "licenseText": "Copyright (c) 2014-2016 GitHub, Inc. [...]"
  }
]
```

Here's an example `webpack.config.js` file that uses all options:

```js
const path = require("path");
const LicenseCheckerWebpackPlugin = require("license-checker-webpack-plugin");
const template = require("lodash.template");

module.exports = {
  // ...
  plugins: [
    new LicenseCheckerWebpackPlugin({
      allow: "(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT)",
      ignore: ["@microsoft/*"],
      override: {
        "assignment@2.0.0": { licenseName: "MIT" },
        "intersection-observer@0.5.0": { licenseName: "MIT" },
        "querystring-es3@0.2.1": { licenseName: "MIT" }
      },
      emitError: true,
      outputWriter: path.resolve(__dirname, "customTemplate.ejs"),
      outputFilename: "ThirdPartyNotices.txt"
    })
  ]
};
```

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit <https://cla.microsoft.com>.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Licensing

All files on this repository are subject to the MIT license. Please read the `LICENSE` file at the root of the project.
