const Binding = require('./binding')
const Controllers = require('./controllers')
const {BLOCK, CONTROLLER} = require('./config')

class Seed {
  constructor({el, data, options}) {
    if(typeof el == 'string') el = document.querySelector(el)
    this.el = el
    this.controllerName = this.el.getAttribute(CONTROLLER)
    // internal copy
    this._bindings = {}
    // external interface
    this.scope = {}
    this._options = options || {}
    this._compileNode(this.el)

    for(var variable in data){
      this.scope[variable] = data[variable]
    }
    // 时序问题， 必须要在this.scope = scope 之后再去extension
    this._extension()
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

  _extension() {
    const controller = Controllers[this.controllerName]
    if(!controller) throw new Error('controller not exist');
    controller.call(null, this.scope, this)
  }

  _compileNode(el) {
    if(el.nodeType === 3) return;

    // sd-each node should not build in parent workpace
    if(el.attributes && el.attributes.length){
      // attrs should copy out
      const attrs = [].map.call(el.attributes, ({name, value}) => ({name, value}))

      // if(attrs.find(({name, value}) => name == CONTROLLER && value != this.controllerName ))
      //   return console.log(name, 'controller', attrs, CONTROLLER);

      attrs.forEach(({name, value}) => {
        const directive = Binding.parse(name, value)
        if(!directive) return;

        this._bind(el, directive)
        // should not remove on this place
        el.removeAttribute(name)
      })
    }

    // debugger
    if(el[BLOCK]) return console.log(el, 'BLOCK');
    el.childNodes.forEach(this._compileNode.bind(this))
  }

  _bind(el, directive) {
    directive.el = el
    directive.seed = this

    const epr = this._options.eachPrefixRE
    let {variable} = directive
    variable = epr ? variable.replace(epr, ''):variable

    if(!this._bindings[variable]) this._createBinding(variable);
    this._bindings[variable].directives.push(directive)
    if(directive.bind) directive.bind.call(directive);
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
