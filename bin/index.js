#!/usr/bin/env node

const requiredVersion = require('../package.json').engines.node
const { checkNodeVersion, checkUpdate } = require('../lib/utils/check')
const cliService = require('../lib/cli')


(async () => {
  checkNodeVersion(requiredVersion, 'bigroom')

  await checkUpdate()
  cliService()
})
