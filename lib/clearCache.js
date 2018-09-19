const rf = require('rimraf')

const { downloadTemp } = require('../configs')

exports.clearCache = function clearCache(options) {
  rf(downloadTemp, (err) => {
    if (err) {
      throw err
    }
    console.log('clear cache done!')
  })
}