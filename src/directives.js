const {BLOCK, mutatorMethods} = require('./config')
module.exports = {
    text: function (value) {
        this.el.textContent = value || ''
    },
    show: function (value) {
        this.el.style.display = value ? '' : 'none'
    },
    class: function (value) {
        if(this.arg) {
            this.el.classList[value ? 'add' : 'remove'](this.arg)
            return;
        }
        this.el.classList.remove(this.lastClass)
        this.el.classList.add(value)
        this.lastClass = value

    },

    // emit change
    checked: {
        bind() {
            this.handler = () => {
                this.seed.scope[this.variable] = this.el.checked
            }
            this.el.addEventListener('change', this.handler)
        },
        update(flag) {
            this.el.checked = flag
        },
        unbind() {
            this.el.removeEventListener('change', this.handler)
        }
    },
    // listen change event
    // return event
    // el            : e.currentTarget,
    // originalEvent : e,
    // directive     : self,
    // seed          : self.seed
    on: {
        update: function (handler) {
            const {arg: event, el, seed} = this
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
    },

    each: {
        bind() {
            this.el[BLOCK] = true
            const ctn = this.container = this.el.parentNode
            this.marker = document.createComment('sd-each-' + this.arg + '-marker')
            ctn.insertBefore(this.marker, this.el)

            this.container.removeChild(this.el)
            this.childSeeds = []
        },
        unbind() {
            // this el and bindings will be remove, so dont need to clear this memery
            // should remove if in attribute
            // this.el.removeAttribute(BLOCK)
            // delete this.el[BLOCK]
        },
        update(collection) {
            let str = ''
            // clear childSeeds before nodes
            this.childSeeds.forEach(seed => seed.destroy())
            this.childSeeds = []

            this.watchArray(collection)
            // create new nodes
            collection.forEach((element, idx) => {
                const seed = this.buildHtml(element, idx, collection)
                this.childSeeds.push(seed)
                this.container.append(seed.el)
            });
        },
        watchArray(collection) {
            mutatorMethods.forEach(method => {
                collection[method] = (...args) => {
                    Array.prototype[method].call(collection, ...args)
                    this.update(collection)
                }
            })
        },
        buildHtml(data, eachIdx, collection) {
            const el = this.el.cloneNode(true)
            return new Seed({ el, data, options: {
                // regexp
                eachPrefixRE: new RegExp(`^${this.arg}.`),
                parentSeed: this.seed,
                eachIdx,
                collection
            } })
        }
    }

}