const HOMEDIR = require('os').homedir()

module.exports = {
  downloadTemp: `${HOMEDIR}/.bigroom-templates`,
  gitAccount: 'fe-bigroom',
  cnpmConfig: ['--registry=https://registry.npm.taobao.org', `--cache=${HOMEDIR}/.npm/.cache/cnpm`, '--disturl=https://npm.taobao.org/dist', `--userconfig=${HOMEDIR}/.cnpmrc`]
}