const {mutatorMethods} = require('../config')
const {get} = require('../utils')

const Watcher = {
  pop(args, result) {
    result.$seed.destroy()
  },

  push(args, result) {
    const idx = result - 1
    this.buildHtml(args[0], idx)
  },

  shift(args, result) {
    result.$seed.destroy()
  },

  unshift(args, result) {
    const beforeNode = get(this.collection[1], '$seed.el')
    args.forEach(data => {
      this.buildHtml(data, 0, beforeNode)
    })
  },

  // 添加或者删除一些元素
  splice(args, result) {
    const news = args.slice(2)
    // let [start, num, ...news] = args
    result.forEach(({$destroy}) => $destroy() )
    const newsLen = news.length
    if(!newsLen) return;
    const start = this.collection.findIndex(i=> !i.$seed)
    const beforeNodeIdx = start + newsLen
    const beforeNode = this.collection[beforeNodeIdx] && this.collection[beforeNodeIdx].$seed.el
    news.forEach((data, i) => {
      this.buildHtml(data, start - i, beforeNode)
    })
  },

  sort() {
    this.collection.forEach((data, idx) => {
      this.container.insertBefore(data.$seed.el, this.marker)
    })
  },
}
Watcher.reverse = Watcher.sort

const argumentations = {
  remove(seed) {
    // seed.$destroy()
    this.collection.splice(seed.$index, 1)
  },
  replace() {

  }
}

function watchArray (cb) {
  mutatorMethods.forEach(method => {
    this.collection[method] = (...args) => {
      const result = Array.prototype[method].call(this.collection, ...args)
      Watcher[method].call(this, args, result)
      this.recorder()
      cb({result})
      return result
    }
  })

  Object.keys(argumentations).forEach(method => {
    this.collection[method] = argumentations[method].bind(this)
  })
}

module.exports = watchArray