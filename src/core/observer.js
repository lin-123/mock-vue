const Emitter = require('emitter')

class Observer extends Emitter {
  constructor() {
    super()
    this.paresing = false
    this.computeds = []
  }

  parseDeps (binding) {
    this.on('get', (dep, key) => {
      dep.dependents.push.apply(dep.dependents, binding.directives)
    })
    binding.value()
    this.off('get')
  }

  collect() {
    this.paresing = true
    this.computeds.forEach(binding => {
      this.parseDeps(binding)
    })
    this.computeds = []
    this.paresing = false
  }
}

module.exports = new Observer()