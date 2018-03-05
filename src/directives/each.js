const {
  BLOCK,
} = require('../config')
const watchArray = require('./watchArray')

module.exports = {
  bind() {
    this.el[BLOCK] = true
    const ctn = this.container = this.el.parentNode
    this.marker = document.createComment('sd-each-' + this.arg + '-marker')
    ctn.insertBefore(this.marker, this.el)
    this.container.removeChild(this.el)
  },

  unbind() {
    if(this.collection) {
      this.collection.forEach(({$destroy}) => $destroy())
      this.collection = null
    }
  },

  update(collection) {
    this.unbind()
    this.collection = collection
    const self = this
    watchArray.call(this, () => {
      if(self.binding.refreshDependents)
        self.binding.refreshDependents()
    })

    // create new nodes
    collection.forEach((data, i) => this.buildHtml(data, i));
  },

  buildHtml(data, idx, beforeNode = this.marker) {
    const seed = new Seed({
      el: this.el.cloneNode(true),
      data,
      options: {
        // regexp
        eachPrefixRE: new RegExp(`^${this.arg}.`),
        parentSeed: this.seed,
        container: this.container,
        each: true,
        index: idx
      }
    })
    this.collection[idx] = seed.scope
    // const beforeNode = idx ==0 ? this.marker:this.collection[idx-1].seed.el
    this.container.insertBefore(seed.el, beforeNode)
  },

  recorder() {
    this.collection.forEach((scope, i) => {
      scope.$index = i
    })
  }
}
