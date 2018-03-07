const Emitter = require('emitter')
const DirectiveParser = require('./directive-parser')
const TextParser = require('./text-parser')
const Controllers = require('./controllers')
const {prefix, regexps, BLOCK, DATA, EACH, CONTROLLER, constance} = require('./config')
const {typeofObj, watchArray, get} = require('./utils')
const Binding = require('./core/binding')
const Observer = require('./core/observer')


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
    let scope = this.scope = data

    if(scope.$seed) {
      scope = this.scope = scope.$dump()
    }

    scope.$seed     = this
    scope.$destroy  = this.destroy.bind(this)
    scope.$dump     = this._dump.bind(this)
    scope.$on       = this.on.bind(this)
    scope.$emit     = this.emit.bind(this)
    scope.$index    = options.index
    scope.$parent   = options.parentSeed && options.parentSeed.scope

    this._compileNode(this.el, true)
    this._extension(controllerName)


    // 收集依赖
    Observer.collect()
  }

  _compileNode(el, root) {
    if(el.nodeType === 3) return TextParser(el, this);

    // if has controller attribute : should build by relation scope
    if(el.attributes && el.attributes.length){
      const build = (name, value) => {
        const directive =new DirectiveParser(name, value.trim())
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

  _bind(el, directive) {
    directive.el = el
    directive.seed = this

    let scopeOwner = this
    const epr = this._options.eachPrefixRE
    let {key} = directive

    if(epr && !epr.test(key) ) scopeOwner = scopeOwner._options.parentSeed
    if(epr && epr.test(key)) directive.key = key = key.replace(epr, '')

    // for nest controller
    scopeOwner = this._getScopeOwner(directive, scopeOwner)
    if(!scopeOwner._bindings[key]) scopeOwner._createBinding(key);

    scopeOwner._bindings[key].directives.push(directive)
    const binding = scopeOwner._bindings[key]
    directive.binding = binding
    const bindingValue = binding && binding.value

    if(directive.bind) directive.bind.call(directive, bindingValue);
    directive.update(bindingValue)

  }

  _getScopeOwner(key, scopeOwner) {
    if(key.nesting) {
      for(let i = 0; i<key.nesting; i++) {
        scopeOwner = scopeOwner._options.parentSeed
      }
    }

    if(key.root) {
      while(scopeOwner._options.parentSeed) {
        scopeOwner = scopeOwner._options.parentSeed
      }
    }
    return scopeOwner
  }

  _createBinding(key) {
    const binding = this._bindings[key] = new Binding(this.scope[key])

    Object.defineProperty(this.scope, key, {
      get: () => {
        this.emit('get', key)
        if(Observer.paresing) {
          Observer.emit('get', binding, key)
        }
        return binding.isComputed ? binding.value() : binding.value
      },
      set: (newVal) => {
        if(newVal === binding.value) return;
        this.emit('set', key, newVal)
        binding.update(newVal)
        if(binding.isComputed) Observer.computeds.push(binding);
      }
    })
    return binding
  }

  _dump() {
    const dump = {}
    const subDump = (scope) => scope.$dump()
    for (var key in this.scope) {
      if(key.charAt(0) == '$') continue;

      const {value, type, isComputed} = this._bindings[key]
      if (!value) continue
      if(type == 'Array') dump[key] = value.map(subDump)
      else if(isComputed) dump[key] = value()
      else dump[key] = this._bindings[key].value
    }
    return dump
  }

  // for binding call unbind
  _unbind() {

  }

  destroy() {
    // clean scene: call directives unbind
    for( let bindKey in this._bindings) {
      this._bindings[bindKey].directives.forEach(directive => {
        if(!directive.unbind) return;
        directive.unbind()
      })
    }

    if(this._options.parentSeed) delete this._options.parentSeed[constance.child + this.el.id]
    // rm dom
    this.el.parentNode.removeChild(this.el)
  }

  _extension(controllerName) {
    const controller = Controllers[controllerName]

    if(!controller) return;
    controller.call(this, this.scope)
  }
}

Emitter(Seed.prototype)
module.exports = Seed
