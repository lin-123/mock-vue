
module.exports = {
  fn: true,
  update: function (handler) {
    const {
      arg: event,
      el,
      seed
    } = this
    if (this.handler) el.removeEventListener(event, this.handler);
    if (handler) {
      this.handler = (e) => {
        return handler({
          el,
          event: e,
          seed,
        })
      }
      el.addEventListener(event, this.handler)
    }
  },
  unbind: function () {
    if (this.handler) {
      this.el.removeEventListener(this.arg, this.handler)
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