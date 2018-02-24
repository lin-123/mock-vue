const directives = require('./directives')
const filters = require('./filters')
const prefix = 'sd'

function Element(opt) {
  const root = document.getElementById(opt.id)
  // opt.scope
  // internal copy
  const bindings = {}
  const scope = this.scope = {}

  Object.keys(directives).forEach(directive => {
    bind(directive)
  })


  // bind 需要剥离出来， 为variable单独开辟一个作用域， 避免Object.defineProperty的坑
  function bind(directive) {
    // 获取带有这个指令的所有节点
    const els = document.querySelectorAll(`[${prefix}-${directive}]`)
    // ;[].forEach.call(bindings[directive].els, (el, idx) => el.removeAttribute(prefix) )

    // 把directive装到binding上
    ;[].forEach.call(els, (el, idx) => {
      const value = el.getAttribute(`${prefix}-${directive}`)
      const [variable, filter] = value.split('|').map(i => i.trim())
      if(!bindings[variable]) bindings[variable] = {directives: []};

      bindings[variable].directives.push({
        filter,
        directive,
        el
      })
    })
  }

  // 数据绑定
  function mapValue(variable) {
    Object.defineProperty(scope, variable, {
      get() {
        return bindings[variable].value
      },
      set(newVal) {
        bindings[variable].value = newVal
        bindings[variable].directives.forEach( (directiveObj)=> {
          const {directive, filter, el} = directiveObj
          const directiveF = directives[directive]
          if(typeof directiveF == 'function')
            return directiveF(el, filter && filters[filter] ? filters[filter](newVal) : newVal)
          const event = directive.split('-')[1]
          directiveF.update(el, scope[variable], event, directiveObj)
        })
      }
    })
  }

  // 这里有个时间差
  for(var variable in bindings){
    mapValue(variable)
    scope[variable] = opt.scope[variable]
  }
}


module.exports = Element