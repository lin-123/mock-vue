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
    let el = true, n=0, seed
    const app = {}
    while(el) {
      el = document.querySelector(`[${config.CONTROLLER}]`)
      if(!el) continue;
      n++
      seed = new Seed({el})
      if(el.id) app[el.id] = seed;
    }
    return n > 1 ? app : seed
  }
}

module.exports = Main