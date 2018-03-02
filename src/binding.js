const Filters = require('./filters')
const Directives = require('./directives')
const {prefix, CONTROLLER, regexps} = require('./config')

class Binding {
  constructor(name, value) {
    this.directiveName = name.substr(prefix.length + 1)
    // for seed
    this._buildUpdate(this.directiveName)

    // for directive 'on'
    this.expression = value
    this._parseKey(value)
    this._parseFilters(value)
  }

  _getVal(str, reg) {
    return str.match(reg) && str.match(reg)[0].trim()
  }

  _parseKey(value) {
    const argMatch = value.match(/(^\w+):(.+)/)
    let noArg
    if(argMatch){
      this.arg = argMatch[1]
      noArg = argMatch[2]
    } else {
      noArg = value
    }

    this.key = this._getVal(noArg, regexps.KEY_RE)
    const dep = this._getVal(noArg, regexps.DEP_RE)
    this.dep = dep && dep.slice(1).trim()
  }

  _parseFilters(value) {
    const filters = this._getVal(value, regexps.FILTER_RE)
    if(!filters) return;
    this._filters = []
    filters.slice(1).split('|').forEach(filter => {
      const [name, ...args] = filter.trim().split(/\s+/)
      const apply = Filters[name]
      if(!apply) throw new Error('invalid filter ' + name + args)
      this._filters.push({apply, args})
    })
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
    if(typeof newVal === 'function' && !this.fn) {
      newVal = newVal()
    }
    this._update(this._filters ? this._applyFilters(newVal) : newVal)
  }
}

module.exports = Binding