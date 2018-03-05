module.exports = {
  get: (obj, key) =>  key.split('.').reduce((pre, cur) => pre && pre[cur] , obj)
}