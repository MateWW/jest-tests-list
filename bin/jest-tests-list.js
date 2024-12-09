#!/usr/bin/env node
const importLocal = require('import-local');

if (!importLocal(__filename)) {
  require('jest-tests-list/dist/cli.js');
}
