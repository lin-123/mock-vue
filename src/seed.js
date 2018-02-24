const Directive = require('./directive')

class Seed {
  constructor(root, scope) {
    this.el = root
    // internal copy
    this._bindings = {}
    // external interface
    this.scope = {}
    this._compileNode(root)

    for(var variable in this._bindings){
      this.scope[variable] = scope[variable]
    }
  }

  destroy() {
    // clean scene: call directives unbind
    for( let bindKey in this._bindings) {
      this._bindings[bindKey].directives.forEach(directive => {
        if(!directive.unbind) return;
        directive.unbind()
      })

      delete this._bindings[bindKey]
    }

    // rm dom
    this.el.parentNode.removeChild(this.el)
  }

  _compileNode(el) {
    if(el.nodeType === 3) return console.log('text node');

    if(!(el.attributes && el.attributes.length)) return;
    ;[].forEach.call(el.attributes, ({name, value}) => {
      const directive = Directive.parse(name, value)
      if(!directive) return;
      this._bind(el, directive)
    })

    el.childNodes.forEach(this._compileNode.bind(this))
  }

  _bind(el, directive) {
    directive.el = el
    directive.seed = this
    const {variable} = directive

    if(!this._bindings[variable]) this._createBinding(variable);
    this._bindings[variable].directives.push(directive)
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
