const Binding = require('./binding')
const Controllers = require('./controllers')
const {prefix, BLOCK, EACH, CONTROLLER} = require('./config')

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

  _compileNode(el) {
    if(el.nodeType === 3) return;

    // if has controller attribute : should build by relation scope
    if(el.attributes && el.attributes.length){
      const build = (name, value) => {
        const directive =Binding.parse(name, value.trim())
        if(!directive) return;
        this._bind(el, directive)
        el.removeAttribute(name)
      }

      // this should have concept of scope
      const ctrl = el.getAttribute(CONTROLLER)
      const isEach = el.getAttribute(EACH)
      // if not current controller, build controller
      if(ctrl != this.controllerName && isEach) return build(EACH, isEach);

      // normal compile node
      // attrs should copy out
      const attrs = [].map.call(el.attributes, ({name, value}) => ({name, value}))
      attrs.forEach(({name, value}) => {
        if(name.indexOf(prefix+'-') == -1 || name == CONTROLLER) return;
        value.split(',').forEach(expression => build(name, expression))
      })
      el.childNodes.forEach(this._compileNode.bind(this))
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

  _extension() {
    const controller = Controllers[this.controllerName]
    if(!controller) throw new Error('controller not exist');
    controller.call(null, this.scope, this)
  }

  _bind(el, directive) {
    directive.el = el
    directive.seed = this

    let scopeOwner = this
    const epr = this._options.eachPrefixRE
    let {variable} = directive
    if(epr) {
      // current scope
      variable = variable.replace(epr, '')
    } else if(this._options.parentScope) {
      // parent scope
      debugger
      scopeOwner = this._options.parentScope
    }

    if(!scopeOwner._bindings[variable]) scopeOwner._createBinding(variable);
    scopeOwner._bindings[variable].directives.push(directive)
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
        this._bindings[variable].directives.forEach( (directive)=> {``
          directive.update(newVal)
        })
      }
    })
  }
}

module.exports = Seed
