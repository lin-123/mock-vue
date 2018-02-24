module.exports = {
    text: function (value) {
        // debugger
        this.el.textContent = value || ''
    },
    show: function (value) {
        this.el.style.display = value ? '' : 'none'
    },
    class: function (value, classname) {
        this.el.classList[value ? 'add' : 'remove'](classname)
    },
    on: {
        update: function (handler) {
            const {handlers = {}, arg: event, el, seed} = this

            if (handlers[event]) {
                el.removeEventListener(event, handlers[event])
            }

            if (handler) {
                handler = handler.bind(seed)
                el.addEventListener(event, handler)
                handlers[event] = handler
            }
        },
        unbind: function () {
            if (this.handlers) {
                this.el.removeEventListener(this.arg, this.handlers[this.arg])
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
}