const Seed = require('./seed')
const Filters = require('./filters')

class Main {
  constructor(root, scope) {
    if(typeof root == 'string') root = document.getElementById(root)

    return new Seed(root, scope)
  }

  static filter(name, fn) {
    Filters[name] = fn
  }
}

module.exports = Main