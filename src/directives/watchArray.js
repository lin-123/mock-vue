const {mutatorMethods} = require('../config')

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
    const beforeNode = this.collection[1].$seed.el
    this.buildHtml(args[0], 0, beforeNode)
    this.recorder()
  },

  // 添加或者删除一些元素
  splice(args, result) {
    const news = args.slice(2)
    // let [start, num, ...news] = args
    result.forEach(({seed}) => seed.destroy() )
    const newsLen = news.length
    if(!newsLen) return;
    const start = this.collection.findIndex(i=> !i.$seed)
    const beforeNodeIdx = start + newsLen
    const beforeNode = this.collection[beforeNodeIdx] && this.collection[beforeNodeIdx].$seed.el
    news.forEach((data, i) => {
      this.buildHtml(data, start - i, beforeNode)
    })
    this.recorder()
  },

  sort() {
    this.collection.forEach((data, idx) => {
      this.container.insertBefore(data.$seed.el, this.marker)
      data.$index = idx
    })
  },
}
Watcher.reverse = Watcher.sort

function watchArray (cb) {
  mutatorMethods.forEach(method => {
    this.collection[method] = (...args) => {
      const result = Array.prototype[method].call(this.collection, ...args)
      Watcher[method].call(this, args, result)
      cb({result})
    }
  })
}

module.exports = watchArray