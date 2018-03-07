/**
 * 文本解析
 *
 * {{text}}
 */
const Directive = require('./directive-parser')

const parser = (node) => {
  var text = node.nodeValue
  const BINDING_RE = /\{\{(.+?)\}\}/
  if (!BINDING_RE.test(text)) return null
  // debugger
  var m, i, tokens = []
  do {
      m = text.match(BINDING_RE)
      if (!m) break
      // debugger
      i = m.index
      if (i > 0) tokens.push(text.slice(0, i))
      tokens.push({ key: m[1] })
      text = text.slice(i + m[0].length)
  } while (true)
  if (text.length) tokens.push(text)
  return tokens
}

module.exports = function(node, seed) {
  var tokens = parser(node)
  if (!tokens) return
  tokens.forEach(function (token) {
    var el = document.createTextNode('')
      if (token.key) {

        var directive = new Directive('sd-text', token.key)
        if (directive) {
            seed._bind(el, directive)
        }
      } else {
          el.nodeValue = token
      }
      node.parentNode.insertBefore(el, node)
  })
  node.parentNode.removeChild(node)
}