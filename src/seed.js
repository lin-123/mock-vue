const Emitter = require('emitter')
const DirectiveParser = require('./directive-parser')
const Controllers = require('./controllers')
const {prefix, regexps, BLOCK, DATA, EACH, CONTROLLER, constance} = require('./config')
const {typeofObj, watchArray, get} = require('./utils')

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
    // for listening scope data get set
    // this.on('set', (...args) => console.log(args, 'on set '));
    // this.on('get', (...args) => console.log(args, 'on get '));

    scope.$seed     = this
    scope.$destroy  = this.destroy.bind(this)
    scope.$dump     = this._dump.bind(this)
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
    if(bindingValue) directive.update(bindingValue)

    scopeOwner._bindDependency(directive)
  }

  _bindDependency(directive) {
    const {dep} = directive
    if(!dep) return;

    let depScop = this._getScopeOwner(dep, this)
    // debugger
    const depBind = depScop._bindings[dep.key] || depScop._createBinding(dep.key)
    if(!depBind.dependencies) {
      depBind.dependencies = []
      depBind.refreshDependents = () => {
        depBind.dependencies.forEach(d => d.refresh())
      }
    }
    depBind.dependencies.push(directive)
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
    this._bindings[key] = {
      directives: [],
      value: this.scope[key]
    }

    Object.defineProperty(this.scope, key, {
      get: () => {
        this.emit('get', key)
        return this._bindings[key].value
      },
      set: (newVal) => {
        this.emit('set', key, newVal)
        this._updateBinding(key, newVal)
      }
    })
    return this._bindings[key]
  }

  _updateBinding(key, newVal) {
    // watch array
    const type = typeofObj(newVal)
    const seed = this
    if(type === 'Array') {
      watchArray(newVal)
      newVal.on('mutation', () => {
        const refDep = seed._bindings[key].refreshDependents()
        refDep && refDep()
      })
    }

    this._bindings[key].value = newVal
    this._bindings[key].directives.forEach( (directive)=> {
      directive.update(newVal)
    })
  }

  _dump() {
    const dump = {}
    const subDump = (scope) => scope.$dump()
    for (var key in this.scope) {
      if(key.charAt(0) == '$') continue;

      const val = this._bindings[key]
      if (!val) continue
      if (Array.isArray(val)) {
          dump[key] = val.map(subDump)
      } else {
          dump[key] = this._bindings[key].value
      }
    }
    return dump
  }
}

Emitter(Seed.prototype)
module.exports = Seed
