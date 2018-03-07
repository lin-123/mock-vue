
module.exports = {
  fn: true,
  bind() {
    const opt = this.seed._options
    if(opt.each) {
      this.delegator = opt.container
      this.el[this.expression] = true
      this.el.seed = this.seed
      // this.marker = this.expression
    }
  },

  update: function (handler) {
    this.unbind()
    if(!handler) return;
    const { arg: event, delegator, expression } = this
    if(delegator) {
      if(delegator.sdDelegationHandlers[expression]) return;

      const dHandler = delegator.sdDelegationHandlers[expression] = (e) => {
        const target = delegateCheck(e.target, delegator, expression)

        if(!target) return;
        handler({ el: target, event: e, scope: target.seed.scope })
      }

      delegator.addEventListener(event, dHandler)
      dHandler.event = event
      return;
    }

    const {el, seed: {scope}} = this
    this.handler = (e) => {
      return handler({
        el,
        event: e,
        scope
      })
    }
    el.addEventListener(event, this.handler)

  },
  unbind: function () {
    const {delegator = {}, arg, handler, selector} = this
    const remove = (h) => this.el.removeEventListener(this.arg, h)
    if (handler) return remove(handler)

    const h = delegator[selector]
    if (h) {
      remove(h)
      delete delegator[selector]
    }
  },
  customFilter: function (handler, selectors) {
    return function (e) {
      var match = selectors.every(function (selector) {
        return e.target.webkitMatchesSelector(selector)
      })
      if (match) handler.apply(this, arguments)
    }
  }
}

// cannot get targe, beacuase the attributes be removed
function delegateCheck (current, top, expression) {
  if (current[expression]) {
    return current
  } else if (current === top) {
    return false
  } else {
    return delegateCheck(current.parentNode, top, expression)
  }
}
