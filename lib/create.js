const path = require('path')
const execa = require('execa')
const Listr = require('listr')
const fse = require('fs-extra')
const chalk = require('chalk')
const download = require('download-git-repo')
const rm = require('rimraf')
const inquirer = require('inquirer')

const { downloadTemp } = require('../configs')
const logger = require('./utils/logger')
const ask = require('./utils/ask')
const promptsConfig = require('../configs/prompts')
const { getRepoNameByUrl } = require('./utils')

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
exports.downloadAndGenerateTemplate = downloadAndGenerateTemplate

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
  ask(metaPrompts, donwloadOptions, () => downloadAndGenerateTemplate(donwloadOptions))
}

function downloadAndGenerateTemplate({ url, name, choice }) {
  const downloadDirPath = path.resolve(`${downloadTemp}/${getRepoNameByUrl(url)}`)
  const newProjectPath = path.resolve(name)

  const downloadTask = () => new Promise((resolve, reject) => {
    download(url, downloadDirPath, { clone: true }, (err) => {
      if (err) {
        logger.fatal(`Failed to download repo ${url}: ${err.message.trim()}`)
        reject()
      }
      resolve()
    })
  })

  const generateTask = () => fse.copySync(`${downloadDirPath}/templates/`, newProjectPath)
  const installForProjectTask = () => execa('npm', ['install'], { cwd: newProjectPath }).catch((err) => logger.fatal(`Failed to install for porject: ${err}`))
  const installForScaffoldTask = () => execa('npm', ['install'], { cwd: `${downloadDirPath}/scripts` }).catch((err) => logger.fatal(`Failed to install for scaffold: ${err}`))

  console.log()
  rm(path.resolve(downloadDirPath), err => {
    if (err) throw err

    new Listr([
      {
        title: 'downloading the template...',
        task: downloadTask
      },
      {
        title: 'generating the project...',
        task: generateTask
      },
      {
        title: 'installing dependencies for scaffold',
        task: installForScaffoldTask
      },
      {
        title: 'installing dependencies for project',
        task: installForProjectTask
      }
    ]).run().then(() => {
      console.log()
      console.log(chalk.green(
        `  cd ${name} & bigroom dev\n`
      ))
    })
  })
}
