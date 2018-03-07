/**
 * binding class
*/
const {typeofObj, watchArray} = require('../utils')

class Binding {
  constructor(value) {
    this.directives = []
    this.dependents = []
    this._set(value)
  }

  _set(value) {
    this.value = value
    const type = this.type = typeofObj(value)
    this.isComputed = false
    if(type === 'Object' && value.get) {
      this.value = value.get
      this.isComputed = true

    } else if(type === 'Array') {
      watchArray(value)
      value.on('mutation', () => {
        this._emitChange()
      })
    }
  }

  update(value){
    this._set(value)
    this.directives.forEach( (directive)=> {
      directive.update(this.value)
    })
    this._emitChange()
  }

  _emitChange() {
    this.dependents.forEach((directive) => {
      directive.refresh()
    })
  }
}


module.exports = Binding