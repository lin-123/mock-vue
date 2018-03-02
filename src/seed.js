const Emitter = require('emitter')
const Binding = require('./binding')
const Controllers = require('./controllers')
const {prefix, regexps, BLOCK, DATA, EACH, CONTROLLER, constance} = require('./config')

class Seed {
  constructor({el, data = {}, options = {}}) {
    if(typeof el == 'string') el = document.querySelector(el)
    this.el = el
    const controllerName = this.el.getAttribute(CONTROLLER)
    this.el.removeAttribute(CONTROLLER)
    this._options = options

    // internal copy
    this._bindings = {}

    // external interface
    const scope = this.scope = data
    scope.$seed     = this
    scope.$destroy  = this.destroy.bind(this)
    // scope.$dump     = this._dump.bind(this)
    scope.$on       = this.on.bind(this)
    scope.$emit     = this.emit.bind(this)
    scope.$index    = options.index
    scope.$parent   = options.parentSeed && options.parentSeed.scope

    this._compileNode(this.el, true)
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

      if(ctrl) {
        const seed = new Seed({el, options: {parentSeed: this}});
        if(el.id) this[constance.child + id] = seed
        return;
      }
      if(isEach) return build(EACH, isEach);

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

      // cannot delete this, beacuse this scope varaible bind
      // delete this._bindings[bindKey]
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
    let {key} = directive

    if(!scopeOwner._bindings[key]) scopeOwner._createBinding(key);
    scopeOwner._bindings[key].directives.push(directive)
    const binding = scopeOwner._bindings[key]
    const bindingValue = binding && binding.value

    if(directive.bind) directive.bind.call(directive, bindingValue);

    if(bindingValue) directive.update(bindingValue)
  }

  _getScopeOwner(directive) {
    let scopeOwner = this
    const epr = this._options.eachPrefixRE
    let {key} = directive

    if(epr && !epr.test(key) ) scopeOwner = scopeOwner._options.parentSeed
    if(epr && epr.test(key)) key = key.replace(epr, '')

    while(regexps.ansesstor.test(key) && scopeOwner._options.parentSeed) {
      scopeOwner = scopeOwner._options.parentSeed
      key = key.replace(regexps.ansesstor, '')
    }

    if(regexps.root.test(key)) {
      while(scopeOwner._options.parentSeed) { scopeOwner = scopeOwner._options.parentSeed}
      key = key.replace(regexps.root, '')
    }

    directive.key = key
    return scopeOwner
  }

  _createBinding(key) {
    this._bindings[key] = {
      directives: [],
      value: this.scope[key]
    }

    Object.defineProperty(this.scope, key, {
      get: () => this._bindings[key].value,
      set: (newVal) => {
        this._bindings[key].value = newVal
        this._bindings[key].directives.forEach( (directive)=> {
          directive.update(newVal)
        })
      }
    })
  }
}

Emitter(Seed.prototype)
module.exports = Seed
