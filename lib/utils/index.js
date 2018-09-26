const rp = require('request-promise')

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
