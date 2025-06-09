# Publishing Guide

This document explains how to publish a new version of `license-checker-webpack-plugin` to npm.

## Current Status

- **Package version**: 0.3.0 (in package.json)
- **Latest published version**: 0.2.1 (on npm)
- **Changes since v0.2.1**: Security fix - replaced `lodash.template` with `lodash` to address vulnerability

## Prerequisites

1. Ensure you have npm publish permissions for the `license-checker-webpack-plugin` package
2. Have access to the npm token secret in the repository settings (NPM_TOKEN)

## Automated Publishing Process

This repository is configured with GitHub Actions for automated publishing:

### Option 1: Create a GitHub Release (Recommended)

1. Go to the repository's [Releases page](https://github.com/microsoft/license-checker-webpack-plugin/releases)
2. Click "Create a new release"
3. Tag version: `v0.3.0`
4. Release title: `v0.3.0`
5. Release notes:
   ```markdown
   ## What's Changed
   
   ### Security
   - Fixed security vulnerability by replacing `lodash.template` with `lodash` dependency
   
   ### Infrastructure  
   - Added GitHub Actions workflows for automated testing and publishing
   - Added security policy documentation
   
   **Full Changelog**: https://github.com/microsoft/license-checker-webpack-plugin/compare/v0.2.1...v0.3.0
   ```
6. Click "Publish release"

This will automatically trigger the GitHub Action workflow that will:
- Run tests
- Publish to npm if tests pass

### Option 2: Manual Publishing

If the automated workflow fails or you need to publish manually:

1. Ensure you're on the correct branch with the latest changes
2. Run tests: `npm test`
3. Login to npm: `npm login`
4. Publish: `npm publish`

## Verification

After publishing, verify:

1. Check that the package appears on npm: https://www.npmjs.com/package/license-checker-webpack-plugin
2. Verify the version shows as 0.3.0
3. Test installation: `npm install license-checker-webpack-plugin@0.3.0`

## Post-Release Tasks

1. Update any documentation that references the old version
2. Consider announcing the security fix to users who may need to upgrade