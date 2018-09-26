const semver = require('semver')
const chalk = require('chalk')
const latestVersion = require('latest-version')
const updateNotifier = require('update-notifier')

const pkg = require('../../package.json')

exports.checkUpdate = async () => {
  const { version } = pkg
  const remoteVersion = await latestVersion('bigroom-cli')

  const semverRemoteVersion = semver(remoteVersion)
  const semverVersion = semver(version)

  if (semverRemoteVersion.major > semverVersion.major) {
    updateNotifier({ pkg: { name: 'bigroom-cli', version } }).notify()
    process.exit(1)
  } else if (semverRemoteVersion.major >= semverVersion.major && semverRemoteVersion.minor > semverVersion.minor) {
    updateNotifier({ pkg: { name: 'bigroom-cli', version } }).notify()
  }
}

exports.checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}