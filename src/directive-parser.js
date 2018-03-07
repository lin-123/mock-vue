const Filters = require('./filters')
const Directives = require('./directives')
const {prefix, CONTROLLER, regexps} = require('./config')

class DirectiveParser {
  constructor(name, value) {
    this.directiveName = name.substr(prefix.length + 1)
    if(regexps.ONEWAY.test(this.directiveName)){
      this.directiveName = this.directiveName.replace(regexps.ONEWAY, '')
      this.oneway = true
    }

    // for seed
    this._buildUpdate(this.directiveName)
    // for directive 'on'
    this.expression = value
    const keyInfo = this._parseKey(value)
    for(let prop in keyInfo) {
      this[prop] = keyInfo[prop]
    }
    this._parseFilters(value)
  }

  _getVal(str, reg) {
    return str.match(reg) && str.match(reg)[0].trim()
  }

  _parseKey(value) {
    const argMatch = value.match(/(^[^:]+):(.+)/)
    let noArg, res = {}
    if(argMatch){
      res.arg = argMatch[1]
      noArg = argMatch[2]
    } else {
      noArg = value
    }

    res.inverse = regexps.INVERSE_RE.test(noArg)
    if(res.inverse) noArg = noArg.slice(1);

    res.nesting = this._getVal(noArg, regexps.ansesstor)
    res.root = this._getVal(noArg, regexps.root)
    let noNesting = noArg.replace(res.nesting, '').replace(res.root, '')
    res.key = this._getVal(noNesting, regexps.KEY_RE)
    return res
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

  refresh() {
    this.update(this.value)
  }

  update(newVal) {
    this.value = newVal
    if(typeof newVal === 'function' && !this.fn) {
      newVal = newVal()
    }
    if(this.inverse) newVal = !newVal;

    this._update(this._filters ? this._applyFilters(newVal) : newVal)
  }
}

module.exports = DirectiveParser