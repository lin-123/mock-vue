const Filters = require('./filters')
const Directives = require('./directives')
const {prefix} = require('./config')

class Seed {
  constructor({id, scope}) {
    const root = document.getElementById(id)
    // opt.scope
    // internal copy
    this._bindings = {}
    // external interface
    this.scope = {}

    this._compileNode(root)

    // Object.keys(Directives).forEach(directiveKey => this._bind(directiveKey))

    for(var variable in this._bindings){
      this.scope[variable] = scope[variable]
    }
  }

  _compileNode(el) {
    if(el.nodeType === 3) {
      return console.log('text node');
    }
    if(!(el.attributes && el.attributes.length)) return;

    ;[].forEach.call(el.attributes, ({name, value}) => {
      const directive = this._parseDirective(el, name, value)
      if(!directive) return;

      const {variable} = directive
      if(!this._bindings[variable]) this._createBinding(variable);
      this._bindings[variable].directives.push(directive)
    })

    el.childNodes.forEach(this._compileNode.bind(this))
  }

  _parseDirective(el, name, value) {
    if(name.indexOf(prefix+'-') == -1) return;
    const noPrefix = name.substr(prefix.length + 1)
    const [key, ...arg] = noPrefix.split('-')
    const [variable, filter] = value.split('|').map(i => i.trim())
    return {
      filter: filter && Filters[filter],
      directive: Directives[key],
      arg,
      variable,
      el
    }
  }

  _createBinding(variable) {
    this._bindings[variable] = {
      directives: [],
      value: null
    }
    Object.defineProperty(this.scope, variable, {
      get: () => this._bindings[variable].value,
      set: (newVal) => {
        this._bindings[variable].value = newVal
        this._bindings[variable].directives.forEach( (directiveObj)=> {
          const {directive, arg, filter, el} = directiveObj
          if(typeof directive == 'function')
            return directive(el, filter ? filter(newVal) : newVal)

          directive.update(el, this.scope[variable], arg, directiveObj)
        })
      }
    })
  }
}

module.exports = Seed
