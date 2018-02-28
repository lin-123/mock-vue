const {
  BLOCK,
  mutatorMethods
} = require('../config')

module.exports = {
  bind() {
    this.el[BLOCK] = true
    const ctn = this.container = this.el.parentNode
    this.marker = document.createComment('sd-each-' + this.arg + '-marker')
    ctn.insertBefore(this.marker, this.el)

    this.container.removeChild(this.el)
    this.childSeeds = []
  },
  unbind() {
    this.childSeeds.forEach(seed => seed.destroy())
  },

  update(collection) {
    let str = ''
    // clear childSeeds before nodes
    this.childSeeds.forEach(seed => seed.destroy())
    this.childSeeds = []

    watchArray.call(this, collection)

    // create new nodes
    collection.forEach((element, idx) => {
      const seed = buildHtml.call(this, element, idx, collection)
      this.childSeeds.push(seed)
      this.container.append(seed.el)
    });
  },
}

function watchArray (collection) {
  mutatorMethods.forEach(method => {
    collection[method] = (...args) => {
      Array.prototype[method].call(collection, ...args)
      // should call scope.todos = xxx so the dom will reload
      console.log({
        method,
        args,
        collection
      })

      // not just update this collection
      // this.update(collection)
    }
  })
}

function buildHtml (data, eachIdx, collection) {
  const el = this.el.cloneNode(true)
  return new Seed({
    el,
    data,
    options: {
      // regexp
      eachPrefixRE: new RegExp(`^${this.arg}.`),
      parentSeed: this.seed,
      eachIdx,
      collection
    }
  })
}
