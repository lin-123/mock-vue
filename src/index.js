const Seed = require('./seed')
const Filters = require('./filters')
const Directives = require('./directives')

class Main {
  constructor(...args) {
    return new Seed(...args)
  }

  static filter(name, fn) {
    Filters[name] = fn
  }

  static directive(name, fn) {
    Directives[name] = fn
  }
}

module.exports = Main