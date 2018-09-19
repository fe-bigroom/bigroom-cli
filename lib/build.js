const fs = require('fs')
const path = require('path')
const execa = require('execa')

const { downloadTemplateAndInstall } = require('./create')
const { downloadTemp } = require('../configs')
const prompts = require('../configs/prompts')
const cwd = process.cwd()
const packagePath = `${cwd}/package.json`

exports.build = function build(options) {
  const { template: { version, type, framework } } = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const commandRun = (commandPath) => {
    const child = execa('node', [commandPath])

    child.stdout.on('data', (data) => {
      console.log(data.toString().trim())
    })

    child.stderr.on('data', (data) => {
      console.log(data.toString().trim())
    })
  }

  if (type === 'chrome-extension') {
    const repoName = `bigroom-${framework}-${type}`
    const templateName = `${repoName}@${version}`
    const templatePath = path.resolve(`${downloadTemp}/${templateName}`)

    if (fs.existsSync(templatePath)) {
      commandRun(`${templatePath}/scripts/scripts/build.js`)
    } else {
      const url = prompts.templates[type].afterChoose(framework)
      const templatePathTemp = path.resolve(`${downloadTemp}/${repoName}@temp`)

      downloadTemplateAndInstall(url, templatePathTemp, templatePath, () => {
        commandRun(`${templatePath}/scripts/scripts/build.js`)
      })
    }
  }
}