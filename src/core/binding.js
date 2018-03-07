/**
 * binding class
*/
const {typeofObj, watchArray} = require('../utils')

class Binding {
  constructor(value) {
    this.directives = []
    this.dependents = []
  }

  update(value, Observer) {
    if(value === this.value) return;
    this.value = value
    const type = this.type = typeofObj(value)
    this.isComputed = false
    if(type === 'Object' && value.get) {
      this.value = value.get
      this.isComputed = true
      Observer.computeds.push(this);

    } else if(type === 'Array') {
      watchArray(value)
      value.on('mutation', () => {
        this._emitChange()
      })
    }

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