const on = require('./on')
const each = require('./each')

module.exports = {
  on,
  each,
  attr: function (value) {
    this.el.setAttribute(this.arg, value)
  },

  text: function (value) {
    this.el.textContent =
      (typeof value === 'string' || typeof value === 'number')
      ? value : ''
  },

  html: function (value) {
    this.el.innerHTML =
      (typeof value === 'string' || typeof value === 'number')
      ? value : ''
  },

  show: function (value) {
    this.el.style.display = value ? '' : 'none'
  },
  visible: function (value) {
    this.el.style.visibility = value ? '' : 'hidden'
  },

  focus(value) {
    if(value) this.el.focus();
  },
  value: {
    bind(value) {
      if(this.oneway) return;
      this.handler = () => {
        this.seed.scope[this.key] = this.el.value
      }
      this.el.addEventListener('change', this.handler)
    },
    update(value) {
      this.el.value = value
    },
    unbind() {
      if(this.oneway) return;
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
      if(this.oneway) return console.log(this.el);
      this.handler = () => {
        this.seed.scope[this.key] = this.el.checked
      }
      this.el.addEventListener('change', this.handler)
    },
    update(flag) {
      this.el.checked = flag
    },
    unbind() {
      if(this.oneway) return;
      this.el.removeEventListener('change', this.handler)
    }
  },

  if(value) {
    if(!value) this.el.parentNode.removeChild(this.el)
  },

  style: {
    bind() {
      this.arg = this.arg.replace(/-(.)/g, (m, char) => char.toUpperCase())
    },
    update(value) {
      this.el.style[this.arg] = value
    }
  }

}