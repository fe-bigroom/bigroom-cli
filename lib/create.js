const path = require('path')
const execa = require('execa')
const Listr = require('listr')
const fs = require('fs')
const fse = require('fs-extra')
const chalk = require('chalk')
const download = require('download-git-repo')
const inquirer = require('inquirer')

const { downloadTemp, gitAccount, cnpmConfig } = require('../configs')
const logger = require('./utils/logger')
const ask = require('./utils/ask')
const promptsConfig = require('../configs/prompts')
const { getRepoNameByUrl, getPackageJsonForGit } = require('./utils')

exports.create = async function create(appName, options) {
  const metaPrompts = promptsConfig.metas
  const donwloadOptions = { name: appName }

  const template = await chooseTemplate(promptsConfig.templates)
  const templateInfos = promptsConfig.templates[template]

  donwloadOptions.template = template

  await subChooseTemplate(templateInfos, donwloadOptions)
  metasChoose(metaPrompts, donwloadOptions)
}

exports.chooseTemplate = chooseTemplate
exports.subChooseTemplate = subChooseTemplate
exports.metasChoose = metasChoose
exports.downloadAndGenerateAndInstall = downloadAndGenerateAndInstall
exports.downloadTemplateAndInstall = downloadTemplateAndInstall
exports.installForBuild = installForBuild

async function chooseTemplate(templates) {
  const choices = Object.keys(templates).reduce((choices, key) => {
    choices.push({ name: key, value: key })
    return choices
  }, [])

  const { template } = await inquirer.prompt([{
    type: 'list',
    message: 'select a template',
    choices,
    name: 'template'
  }])
  return template
}

async function subChooseTemplate(templateInfos, options) {
  const { message, choices } = templateInfos
  const { choice } = await inquirer.prompt([{
    type: 'list',
    message,
    choices,
    name: 'choice'
  }])
  options.choice = choice
  options.url = templateInfos.afterChoose(choice)
}

function metasChoose(metaPrompts, donwloadOptions) {
  ask(metaPrompts, donwloadOptions, () => downloadAndGenerateAndInstall(donwloadOptions))
}

function generateProjectAndInstall(templatePath, projectName, callback = () => {}) {
  const newProjectPath = path.resolve(projectName)
  const generateTask = () => fse.copySync(`${templatePath}/templates/`, newProjectPath)
  const installForProjectTask = () => execa('npm', ['install'].concat(cnpmConfig), { cwd: newProjectPath }).catch((err) => logger.fatal(`Failed to install for porject: ${err}`))

  new Listr([
    {
      title: 'generating the project...',
      task: generateTask
    },
    {
      title: 'installing dependencies for project',
      task: installForProjectTask
    }
  ]).run().then(() => callback())
}

function downloadTemplateAndInstall(url, templatePathTemp, templatePath, callback = () => {}) {
  const downloadTask = () => new Promise((resolve, reject) => download(url, templatePathTemp, { clone: true }, (err) => {
    if (err) {
      logger.fatal(`Failed to download repo ${url}: ${err.message.trim()}`)
      reject()
    }
    fs.renameSync(templatePathTemp, templatePath)
    resolve()
  }))

  const installForBuildTask = () => execa('npm', ['install'].concat(cnpmConfig), { cwd: `${templatePath}/scripts` }).catch((err) => logger.fatal(`Failed to install for build: ${err}`))

  console.log()
  new Listr([
    {
      title: 'downloading the template...',
      task: downloadTask
    },
    {
      title: 'installing dependencies for build',
      task: installForBuildTask
    }
  ]).run().then(() => callback())
}

function installForBuild(templatePath, callback) {
  const installForBuildTask = () => execa('npm', ['install'].concat(cnpmConfig), { cwd: `${templatePath}/scripts` }).catch((err) => logger.fatal(`Failed to install for build: ${err}`))

  console.log()
  new Listr([
    {
      title: 'installing dependencies for build',
      task: installForBuildTask
    }
  ]).run().then(() => callback())
}

function downloadTemplateAndGenerateProjectAndInstall(url, templatePathTemp, templatePath, projectName, callback = () => {}) {
  const newProjectPath = path.resolve(projectName)

  const downloadTask = () => new Promise((resolve, reject) => download(url, templatePathTemp, { clone: true }, (err) => {
    if (err) {
      logger.fatal(`Failed to download repo ${url}: ${err.message.trim()}`)
      reject()
    }
    fs.renameSync(templatePathTemp, templatePath)
    resolve()
  }))

  const generateTask = () => fse.copySync(`${templatePath}/templates/`, newProjectPath)
  const installForProjectTask = () => execa('npm', ['install'].concat(cnpmConfig), { cwd: newProjectPath }).catch((err) => logger.fatal(`Failed to install for porject: ${err}`))
  const installForBuildTask = () => execa('npm', ['install'].concat(cnpmConfig), { cwd: `${templatePath}/scripts` }).catch((err) => logger.fatal(`Failed to install for build: ${err}`))

  console.log()
  new Listr([
    {
      title: 'downloading the template...',
      task: downloadTask
    },
    {
      title: 'installing dependencies for build',
      task: installForBuildTask
    },
    {
      title: 'generating the project...',
      task: generateTask
    },
    {
      title: 'installing dependencies for project',
      task: installForProjectTask
    }
  ]).run().then(() => callback())
}

function downloadAndGenerateAndInstall({ url, name, choice }) {
  const repo = getRepoNameByUrl(url)

  getPackageJsonForGit(gitAccount, repo).then((package) => {
    const templateName = `${package.name}@${package.version}`
    const templatePath = path.resolve(`${downloadTemp}/${templateName}`)
    const templatePathTemp = path.resolve(`${downloadTemp}/${repo}@temp`)
    const templateScriptDependencyPath = path.resolve(`${downloadTemp}/${templateName}/scripts/node_modules`)
    const projectName = name
    const endOut = () => {
      // output install successfully
      const doneMarkPath = path.resolve(`${downloadTemp}/${templateName}/infos.json`)
      fse.writeJson(doneMarkPath, { installed: true }, err => {
        if (err) return console.error(err)
        console.log()
        console.log(chalk.green(
          `  cd ${projectName} & bigroom dev\n`
        ))
      })
    }

    if (fs.existsSync(templatePath)) {
      if (!fs.existsSync(templateScriptDependencyPath)) {
        installForBuild(templatePath, () => generateProjectAndInstall(templatePath, projectName, endOut))
      } else {
        generateProjectAndInstall(templatePath, projectName, endOut)
      }
    } else {
      downloadTemplateAndGenerateProjectAndInstall(url, templatePathTemp, templatePath, projectName, endOut)
    }
  })
}
