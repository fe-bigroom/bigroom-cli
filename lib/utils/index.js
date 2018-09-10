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