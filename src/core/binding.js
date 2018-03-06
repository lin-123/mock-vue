/**
 * binding class
*/
const {typeofObj} = require('../utils')

class Binding {
  constructor(value) {
    this.directives = []
    this.dependents = []
    this.parseValue(value)

  }

  // will set value,type,isComputed
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
    this.directives.forEach( (directive)=> {
      directive.update(this.value)
    })
  }

  emitChange() {
    this.dependents.forEach((directive) => {
      directive.refresh()
    })
  }
}


module.exports = Binding