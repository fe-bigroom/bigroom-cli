const HOMEDIR = require('os').homedir()

module.exports = {
  downloadTemp: `${HOMEDIR}/.bigroom-templates`,
  gitAccount: 'fe-bigroom',
  cnpmConfig: ['--registry=https://registry.npm.taobao.org', '--cache=$HOME/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist', '--userconfig=$HOME/.cnpmrc']
}