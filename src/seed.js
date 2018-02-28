const Emitter = require('emitter')
const Binding = require('./binding')
const Controllers = require('./controllers')
const {prefix, regexps, BLOCK, DATA, EACH, CONTROLLER, constance} = require('./config')

class Seed {
  constructor({el, data, options}) {
    if(typeof el == 'string') el = document.querySelector(el)
    this.el = el

    const controllerName = this.el.getAttribute(CONTROLLER)
    this.el.removeAttribute(CONTROLLER)

    // internal copy
    this._bindings = {}
    // external interface
    this.scope = {}
    this._options = options || {}
    this._compileNode(this.el, true)

    if(options) {
      ;['eachIdx', 'collection'].forEach(key => {
        this[key] = options[key]
      })
    }

    for(var variable in data){
      this.scope[variable] = data[variable]
    }
    // 时序问题， 必须要在this.scope = scope 之后再去extension
    this._extension(controllerName)
  }

  _compileNode(el, root) {
    if(el.nodeType === 3) return;

    // if has controller attribute : should build by relation scope
    if(el.attributes && el.attributes.length){
      const build = (name, value) => {
        const directive =new Binding(name, value.trim())
        if(!directive) return;
        this._bind(el, directive)
        el.removeAttribute(name)
      }

      // this should have concept of scope
      const ctrl = el.getAttribute(CONTROLLER)
      const isEach = el.getAttribute(EACH)
      if(isEach) return build(EACH, isEach);
      if(ctrl) {
        const seed = new Seed({el, options: {parentSeed: this}});
        if(el.id) this[constance.child + id] = seed
        return;
      }

      // normal compile node
      // attrs should copy out
      const attrs = [].map.call(el.attributes, ({name, value}) => ({name, value}))
      attrs.forEach(({name, value}) => {
        if(name.indexOf(prefix+'-') == -1 || name == CONTROLLER) return;
        value.split(',').forEach(expression => build(name, expression))
      })
    }
    el.childNodes.forEach(this._compileNode.bind(this))

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

    if(this._options.parentSeed) delete this._options.parentSeed[constance.child + this.el.id]
    // rm dom
    this.el.parentNode.removeChild(this.el)
  }

  _extension(controllerName) {
    const controller = Controllers[controllerName]

    if(!controller) return;
    controller.call(null, this.scope, this)
  }

  _bind(el, directive) {
    directive.el = el
    directive.seed = this

    let scopeOwner = this._getScopeOwner(directive)
    let {variable} = directive

    if(!scopeOwner._bindings[variable]) scopeOwner._createBinding(variable);
    scopeOwner._bindings[variable].directives.push(directive)
    if(directive.bind) directive.bind.call(directive);
  }

  _getScopeOwner(directive) {
    let scopeOwner = this
    const epr = this._options.eachPrefixRE
    let {variable} = directive

    if(epr && epr.test(variable)) {
      variable = variable.replace(epr, '')
      directive.variable = variable
    }

    while(regexps.ansesstor.test(directive.variable) && scopeOwner._options.parentSeed) {
      scopeOwner = scopeOwner._options.parentSeed
      directive.variable = directive.variable.replace(regexps.ansesstor, '')
    }

    if(regexps.root.test(variable)) {
      while(scopeOwner._options.parentSeed) { scopeOwner = scopeOwner._options.parentSeed}
      directive.variable = variable.replace(regexps.root, '')
    }
    return scopeOwner
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

Emitter(Seed.prototype)
module.exports = Seed
