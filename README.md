# danger-plugin-ktlint-report

[![Build Status](https://travis-ci.org/damian-burke/danger-plugin-ktlint-report.svg?branch=master)](https://travis-ci.org/damian-burke/danger-plugin-ktlint-report)
[![npm version](https://badge.fury.io/js/danger-plugin-ktlint-report.svg)](https://badge.fury.io/js/danger-plugin-ktlint-report)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> This plugin reads ktlint reports and posts inline comments in pull requests.

The plugin is still under active development and testing.

## Requirements

The plugin does not execute ktlint on any source set. Instead, the plugin will search the file tree for ktlint reports and parse them.

At the moment the plugin is searching using the following file mask: `**/reports/ktlint/*.xml`.

It is limited to XML checkstyle reports.

## Usage

Install:

```sh
yarn add danger-plugin-ktlint-report --dev
```

At a glance:

```js
// dangerfile.js
const ktlintReport  = require("danger-plugin-ktlint-report")
ktlintReport.scan()
```
## Changelog

See the GitHub [release history](https://github.com/damian-burke/danger-plugin-ktlint-report/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
