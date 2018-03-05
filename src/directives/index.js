const on = require('./on')
const each = require('./each')

module.exports = {
  on,
  each,
  text: function (value) {
    this.el.textContent = value || ''
  },
  show: function (value) {
    this.el.style.display = value ? '' : 'none'
  },
  focus(value) {
    if(value) this.el.focus();
  },
  value: {
    bind(value) {
      this.handler = () => {
        this.seed.scope[this.key] = this.el.value
      }
      this.el.addEventListener('change', this.handler)
    },
    update(value) {
      this.el.value = value
    },
    unbind() {
      this.el.removeEventListener('change', this.handler)
    }
  },
  class: function (value) {
    if (this.arg) {
      this.el.classList[value ? 'add' : 'remove'](this.arg)
      return;
    }
    this.el.classList.remove(this.lastClass)
    this.el.classList.add(value)
    this.lastClass = value
  },

  // emit change
  checked: {
    bind() {
      this.handler = () => {
        this.seed.scope[this.key] = this.el.checked
      }
      this.el.addEventListener('change', this.handler)
    },
    update(flag) {
      this.el.checked = flag
    },
    unbind() {
      this.el.removeEventListener('change', this.handler)
    }
  },
}