
module.exports = {
  fn: true,
  bind() {
    const opt = this.seed._options
    if(opt.each) {
      const attribute = this.directiveName + '*="' + this.expression
      this.selector = `[${attribute}]`
      this.delegator = opt.container
    }
  },

  update: function (handler) {
    this.unbind()
    if(!handler) return;
    const { arg: event, el, seed: {scope}, delegator, selector } = this

    // todo e.target cannot fund
    if(delegator && !delegator[selector] && false) {
      delegator[selector] = (e) => {
        const target = delegateCheck(e.target, delegator, this.selector)
        if(!target) return;
        handler({ el: target, event: e, scope })
      }
      el.addEventListener(event, this.delegator[selector])
      return;
    }

    this.handler = (e) => {
      return handler({
        el,
        event: e,
        scope,
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
function delegateCheck (current, top, selector) {
  if (current.webkitMatchesSelector(selector)) {
      return current
  } else if (current === top) {
      return false
  } else {
      return delegateCheck(current.parentNode, top, selector)
  }
}
