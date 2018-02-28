module.exports = {
  prefix: 'sd',
  EACH: 'sd-each',
  BLOCK: 'sd-block',
  CONTROLLER: 'sd-controller',
  DATA: 'sd-data',

  constance: {
    child: '$child_'
  },
  // compute scope
  regexps: {
    // 祖先节点： ^name
    ansesstor: /^\^/,
    // 根节点： $name
    root: /^\$/
  },
  mutatorMethods: [
    'pop',
    'push',
    'reverse',
    'shift',
    'unshift',
    'splice',
    'sort'
  ],

  Controllers: {},
  datum: {}
}