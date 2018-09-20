const rp = require('request-promise')
const semver = require('semver')
const chalk = require('chalk')

const packageJson = require('../../package.json')

exports.getRepoNameByUrl = (url) => {
  if (!url) {
    throw new Error('param error: url is missing!')
  }
  const match = url.match(/\/([^:#]+)/)

  if (!match) {
    throw new Error('result error: can\'t get repo-name from git-url !')
  }

  return match[1]
}

exports.getPackageJsonForGit = (account, repo) => {
  const url = `https://raw.githubusercontent.com/${account}/${repo}/master/package.json`
  return rp(url).then(data => JSON.parse(data))
}

exports.checkUpdate = () => {
  const url = `https://raw.githubusercontent.com/fe-bigroom/bigroom-cli/master/package.json`

  return rp(url)
    .then(data => JSON.parse(data))
    .then((package) => {
      const remoteVersion = package.version;
      const { version } = packageJson;

      const semverRemoteVersion = semver(remoteVersion);
      const semverVersion = semver(version);

      if (semverRemoteVersion.major > semverVersion.major) {
        // 强制更新
        console.log('\n  please update bigroom-cli: ' + chalk.red('npm install -g bigroom-cli') + '\n')
        process.exit(1);
      } else if (semverRemoteVersion.major >= semverVersion.major && semverRemoteVersion.minor > semverVersion.minor) {
        // 提示更新
        console.log('\n  ' + chalk.green('  please update bigroom-cli: npm install -g bigroom-cli') + '\n')
      }
    });
}
