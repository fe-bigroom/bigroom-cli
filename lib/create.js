const inquirer = require('inquirer')

const ask = require('./utils/ask')
const promptsConfig = require('../configs/prompts')
const downloadTemplate = require('./utils/downloadTemplate')

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
  ask(metaPrompts, donwloadOptions, () => downloadTemplate(donwloadOptions))
}
