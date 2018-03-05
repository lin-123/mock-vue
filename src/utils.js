const {mutatorMethods} = require('./config')
const Emitter = require('emitter')

const argumentations = {
  remove(seed) {
    this.splice(seed.$index, 1)
  },
  replace() {

  }
}

module.exports = {
  get: (obj, key) =>  key.split('.').reduce((pre, cur) => pre && pre[cur] , obj),
  typeofObj: (obj) => Object.prototype.toString.call(obj).slice(8, -1),

  // should bind this of collection
  watchArray (collection) {
    Emitter(collection)
    mutatorMethods.forEach(method => {
      collection[method] = (...args) => {
        const result = Array.prototype[method].call(collection, ...args)
        collection.emit('mutation', {
          method,
          args,
          result
        })
      }
    })

    Object.keys(argumentations).forEach(method => {
      collection[method] = argumentations[method]
    })
  }

}