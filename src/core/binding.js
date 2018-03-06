/**
 * binding class
*/
const {typeofObj} = require('../utils')

class Binding {
  constructor(value, key) {
    this.directives = []
    this.dependents = []
    // will set value,type,isComputed
    this.parseValue(value)
    this.key = key
  }

  parseValue(value) {
    if(value === this.value) return;
    this.value = value
    const type = this.type = typeofObj(value)
    this.isComputed = false
    if(type === 'Object' && value.get) {
      this.value = value.get
      this.isComputed = true
    }
  }

  refresh() {
    const {value} = this
    this.directives.forEach( (directive)=> {
      directive.update(value)
    })
  }

  emitChange() {
    this.dependents.forEach((directive) => {
      directive.update(this.value)
    })
  }
}


module.exports = Binding