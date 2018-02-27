const Seed = require('./seed')
const Filters = require('./filters')
const Directives = require('./directives')
const Controllers = require('./controllers')
const config = require('./config')

class Main extends Seed {
  static controller(name, extensions) {
    Controllers[name] = extensions
  }

  static filter(name, fn) {
    Filters[name] = fn
  }

  static directive(name, fn) {
    Directives[name] = fn
  }

  static bootstrap(opt) {
    let traversaling = true
    const app = {}
    let n = 0
    while(traversaling) {
      let el = document.querySelector(`[${config.CONTROLLER}]`)
      if(!el) return traversaling = false;

      const seed = new Seed({el})
      app[el.id || n++] = seed
    }
    return n>1 ? app:app[0]
  }
}

module.exports = Main