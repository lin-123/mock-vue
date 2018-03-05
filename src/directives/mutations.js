const {get} = require('../utils')

// for sd-each
const mutations = {
  pop(args, result) {
    result.$seed.destroy()
  },

  push(args, result) {
    const idx = result - 1
    this.buildHtml(args[0], idx)
  },

  shift(args, result) {
    result.$seed.destroy()
    this.refreshIdx()
  },

  unshift(args, result) {
    const beforeNode = get(this.collection[1], '$seed.el')
    args.forEach(data => {
      this.buildHtml(data, 0, beforeNode)
    })
    this.refreshIdx()
  },

  // 添加或者删除一些元素
  splice(args, result) {
    const news = args.slice(2)
    result.forEach(({$destroy}) => $destroy() )
    const newsLen = news.length
    if(newsLen) {
      const start = this.collection.findIndex(i=> !i.$seed)
      const beforeNodeIdx = start + newsLen
      const beforeNode = this.collection[beforeNodeIdx] && this.collection[beforeNodeIdx].$seed.el
      news.forEach((data, i) => {
        this.buildHtml(data, start - i, beforeNode)
      })
    }
    this.refreshIdx()
  },

  sort() {
    this.collection.forEach((data, idx) => {
      this.container.insertBefore(data.$seed.el, this.marker)
    })
    this.refreshIdx()
  },
}
mutations.reverse = mutations.sort

module.exports = mutations