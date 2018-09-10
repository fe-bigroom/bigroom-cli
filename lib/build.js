const fs = require('fs')
const path = require('path')
const execa = require('execa')

const { downloadTemp } = require('../configs')
const cwd = process.cwd()
const packagePath = `${cwd}/package.json`

exports.build = function build(options) {
  let commandPath = ''
  const { template: { type, framework } } = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

  if (type === 'chrome-extension') {
    commandPath = path.resolve(`${downloadTemp}/bigroom-${framework}-${type}/scripts/scripts/build.js`)
  }

  const child = execa('node', [commandPath])

  child.stdout.on('data', (data) => {
    console.log(data.toString().trim())
  })

  child.stderr.on('data', (data) => {
    console.log(data.toString().trim())
  })
}