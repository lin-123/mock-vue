const {block} = require('./config')
module.exports = {
    text: function (value) {
        // debugger
        this.el.textContent = value || ''
    },
    show: function (value) {
        this.el.style.display = value ? '' : 'none'
    },
    class: function (value) {
        this.el.classList[value ? 'add' : 'remove'](this.arg)
    },
    on: {
        update: function (handler) {
            const {handlers = {}, arg: event, el, seed} = this

            if (handlers[event]) el.removeEventListener(event, handlers[event]);

            if (handler) {
                // bind scope to handler
                handler = handler.bind(seed)
                el.addEventListener(event, handler)
                this.handlers = {[event]: handler, ...handlers}
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
    },

    each: {
        bind() {
            this.el.setAttribute(block, true)
            this.container = this.el.parentNode
            this.el.parentNode.removeChild(this.el)
        },
        update(collection) {
            let str = ''
            this.el.removeAttribute(block)
            collection.forEach(element => {
                const seed = this.buildHtml(element)
                this.container.append(seed.el)
            });
        },
        buildHtml(element) {
            const data = Object.keys(element).reduce((pre, cur) => {
                pre[this.arg + '.' + cur] = element[cur]
                return pre
            }, {})
            const node = this.el.cloneNode(true)
            return new Seed(node, data)
        }
    }

}