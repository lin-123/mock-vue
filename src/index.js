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

  static plant() {
    return this.controller.apply(this, arguments)
  }

  static sprout(opt) {
    return new Seed(opt)
  }
}

module.exports = Main