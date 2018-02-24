const Directive = require('./directive')

class Seed {
  constructor({id, scope}) {
    const root = document.getElementById(id)
    // opt.scope
    // internal copy
    this._bindings = {}
    // external interface
    this.scope = {}
    this._compileNode(root)

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
      const directive = Directive.parse(name, value)
      if(!directive) return;

      directive.el = el
      directive.seed = this
      const {variable} = directive

      if(!this._bindings[variable]) this._createBinding(variable);
      this._bindings[variable].directives.push(directive)
    })

    el.childNodes.forEach(this._compileNode.bind(this))
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
        this._bindings[variable].directives.forEach( (directive)=> {
          directive.update(newVal)
        })
      }
    })
  }
}

module.exports = Seed
