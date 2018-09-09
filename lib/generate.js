const promptsConfig = require('../configs/prompts')

const { subChooseTemplate, metasChoose } = require('./create')

exports.generate = async function generate(template, options) {
  const metaPrompts = promptsConfig.metas;
  const donwloadOptions = { name: '' };
  const templateInfos = promptsConfig.templates[template]

  await subChooseTemplate(templateInfos, donwloadOptions)
  await metasChoose(metaPrompts, donwloadOptions)
}
