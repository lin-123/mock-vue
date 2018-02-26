const Filters = require('./filters')
const Directives = require('./directives')
const {prefix, CONTROLLER} = require('./config')

class Binding {
  constructor(name, value) {
    const key = name.substr(prefix.length + 1)

    let [, arg, noArg] = value.match(/(^\w+):(.+)/) || []
    noArg = noArg?noArg:value
    const [variable, ...filters] = noArg.split('|').map(i => i.trim())

    // for directives on method
    this.arg  = arg
    // for seed
    this.variable  = variable
    this._parseFilters(filters)
    this._buildUpdate(key)
  }

  _parseFilters(filters) {
    if(filters.length) {
      this._filters = []
      filters.forEach(filter => {
        const [name, ...args] = filter.split(/\s+/)
        const apply = Filters[name]
        if(!apply) throw new Error('invalid filter ' + name + args)
        this._filters.push({apply, args})
      })
    }
  }

  _applyFilters(value) {
    let tmpVal = value
    this._filters.forEach(({apply, args}) => {
      args.unshift(tmpVal)
      tmpVal = apply.apply(apply, args)
    })
    return tmpVal
  }

  _buildUpdate(key) {
    const def = Directives[key]
    if(typeof def == 'function') return this._update = def

    for(let prop in def) {
      this[prop == 'update' ? '_update':prop] = def[prop]
    }
  }

  update(newVal) {
    this._update(this._filters ? this._applyFilters(newVal) : newVal)
  }
}

module.exports = {
  parse(name, value) {

    return new Binding(name, value)
  }
}