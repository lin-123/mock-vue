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
            this.el[block] = true
            // this.el.setAttribute(block, true)
            const ctn = this.container = this.el.parentNode
            this.marker = document.createComment('sd-each-' + this.arg + '-marker')
            ctn.insertBefore(this.marker, this.el)

            this.container.removeChild(this.el)
            this.childSeeds = []
        },
        unbind() {
            // this el and bindings will be remove, so dont need to clear this memery
            // should remove if in attribute
            // this.el.removeAttribute(block)
            // delete this.el[block]
        },
        update(collection) {
            let str = ''
            // clear childSeeds before nodes
            this.childSeeds.forEach(seed => seed.destroy())

            // create new nodes
            collection.forEach(element => {
                const seed = this.buildHtml(element)
                this.childSeeds.push(seed)
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