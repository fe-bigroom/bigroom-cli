#!/usr/bin/env node

const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'bigroom')

const program = require('commander')

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description(`create a new project\n\n    ${chalk.grey('Examples:  $ bigroom create my-project')}\n`)
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/create').create(name, options)
  })

program
  .command('generate <template>')
  .alias('g')
  .description(`generate a new project\n\n    ${chalk.grey('Examples:  $ bigroom generate/g chrome-extension')}\n`)
  .action((template, cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/generate').generate(template, options)
  })

program
  .command('clear-cache')
  .description(`build the project\n\n    ${chalk.grey('Examples:  $ bigroom clear-cache')}\n`)
  .action((cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/clearCache').clearCache(options)
  })

program
  .command('dev')
  .description(`run the local project\n\n    ${chalk.grey('Examples:  $ bigroom dev')}\n`)
  .action((cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/dev').dev(options)
  })

program
  .command('build')
  .description(`build the project\n\n    ${chalk.grey('Examples:  $ bigroom build')}\n`)
  .action((cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/build').build(options)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '')
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}