module.exports = {
  templates: {
    'chrome-extension': {
      message: 'select a javaScript framework',
      type: 'list',
      choices: [{
        name: 'React',
        value: 'react'
      }
      // , {
      //   name: 'Vue',
      //   value: 'vue'
      // }, {
      //   name: 'Null',
      //   value: 'null'
      // }
      ],
      afterChoose: (value) => {
        const framework = {
          react: 'gitlab:github.com:fe-bigroom/bigroom-react-chrome-extension#master'
          // vue: 'gitlab:github.com:fe-bigroom/bigroom-vue-chrome-extension#master',
          // null: 'gitlab:github.com:fe-bigroom/bigroom-chrome-extension#master'
        }
        return framework[value]
      }
    }
    // 'cms-client': {
    // }
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
