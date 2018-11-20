#!/usr/bin/env node

(async () => {
  const requiredVersion = require('../package.json').engines.node
  const { checkNodeVersion, checkUpdate } = require('../lib/utils/check')

  const cliService = require('../lib/cli')

  checkNodeVersion(requiredVersion, 'bigroom')

  await checkUpdate()

  cliService()
})()