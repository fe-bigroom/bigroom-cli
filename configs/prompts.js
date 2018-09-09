module.exports = {
  templates: {
    'chrome-extension': {
      message: 'select a javaScript framework',
      type: 'list',
      choices: [{
        name: 'React',
        value: 'react'
      }, {
        name: 'Vue',
        value: 'vue'
      }, {
        name: 'Null',
        value: 'null'
      }],
      afterChoose: (value) => {
        const framework = {
          react: 'gitlab:github.com:lzwaiwai/react-chrome-extension-template#master',
          vue: 'gitlab:github.com:lzwaiwai/fe-utils#master',
          null: 'gitlab:github.com:lzwaiwai/fe-utils#master'
        }
        return framework[value]
      }
    },

    'cms-client': {
    }
  },

  metas: {
    name: {
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A bigroom project',
    },
    author: {
      type: 'string',
      required: false,
      message: 'Author',
    }
  }
}
