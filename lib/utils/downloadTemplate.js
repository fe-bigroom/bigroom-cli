
const path = require('path')
// const fs = require('fs')
const fse = require('fs-extra')
const ora = require('ora')
const download = require('download-git-repo')
const rm = require('rimraf')

const { downloadTemp } = require('../../configs')
const chromeExtensionConfig = require('../../configs/chromeExtension')
const logger = require('./logger')

module.exports = function downloadTemplate({ url, name, choice }) {
  const spinner = ora('downloading...')
  spinner.start()

  const downloadDirPath = path.resolve(`${downloadTemp}/${chromeExtensionConfig[choice].repoName}`)

  rm(path.resolve(downloadDirPath), err => {
    if (err) throw err

    download(url, downloadDirPath, { clone: true }, (err) => {
      if (err) {
        logger.fatal('Failed to download repo ' + url + ': ' + err.message.trim())
      }

      // 过滤情况下的拷贝
      // const ignoreDirs = chromeExtensionConfig[choice].ignoreFiles.map(filePath => path.resolve(`${downloadDirPath}/${filePath}`))

      // fse.copySync(downloadDirPath, name, { filter: (src) => {
      //   for(let i = 0, len = ignoreDirs.length; i < len; i++) {
      //     if (ignoreDirs[i].indexOf(src) !== -1) {
      //       return false
      //     }
      //   }
      //   return true
      // }})

      fse.copySync(downloadDirPath, name)

      spinner.stop()
      process.exit(1)
    })
  })
}
