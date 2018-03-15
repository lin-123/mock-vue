class Scope {
  constructor({seed, options}) {
    this.$seed = seed
    this.$index = options.index
    this.$parent = options.parentSeed && options.parentSeed.scope
    this.$watchers = {}
  }

  $watch(key, cb) {
    setTimeout(() => {
      const {scope} = this.$seed
      const binding = this.$seed._bindings
      const watcher = this.$watchers[key] = () => ({
        refresh() {
          cb(binding[key])
        }
      })

    }, 0);
  }
}