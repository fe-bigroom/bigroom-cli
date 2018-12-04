const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const execa = require('execa')

const { downloadTemplateAndInstall, installForBuild } = require('./create')
const { downloadTemp } = require('../configs')
const prompts = require('../configs/prompts')

const cwd = process.cwd()
const packagePath = `${cwd}/package.json`

exports.dev = function dev(options) {
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
    const infosPath = path.resolve(`${templatePath}/infos.json`)


    const hasInstalled = fs.existsSync(infosPath) ? JSON.parse(fs.readFileSync(infosPath, 'utf8')).installed : false

    const callback = () => {
      console.log()
      const doneMarkPath = path.resolve(infosPath)
      fse.writeJson(doneMarkPath, { installed: true }, err => {
        if (err) return console.error(err)
        commandRun(`${templatePath}/scripts/scripts/start.js`)
      })
    }

    if (fs.existsSync(templatePath)) {
      if (!hasInstalled) {
        return installForBuild(templatePath, callback)
      }
      callback()
    } else {
      const url = prompts.templates[type].afterChoose(framework)
      const templatePathTemp = path.resolve(`${downloadTemp}/${repoName}@temp`)

      downloadTemplateAndInstall(url, templatePathTemp, templatePath, callback)
    }
  }
}