# 7a0172d60 auto parse dependency for computed properties!!!!!

> 计算属性

## 实现原理
    - 如： 设置total为计算属性
    - 书写方式

        ```javascript
        // computed properties ----------------------------------------------------
        scope.total = {get: function () {
            return scope.todos.length
        }}
        ```
    - 将total加入到seed._bindings中。 new Binding(total)

        ```javascript
        const binding = this._bindings[key] = new Binding(this.scope[key])
        ```

    - 在将total属性加入binding中的时候判断是计算属性。

        ```javascript
        // binding.js
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
        ```

    - 将total这个binding放到observer.computed中。 等待compileNode 遍历dom节点执行完了之后在处理。

    - 执行observer.collection()

        ```javascript
        // observer.js
        parseDeps (binding) {
            this.on('get', (dep, key) => {
                dep.dependents.push.apply(dep.dependents, binding.directives)
            })
            // 关键是执行这一步。 会重新将其依赖的所有参数都收集到这个on事件里
            binding.value()
            this.off('get')
        }
        collect() {
            this.paresing = true
            this.computeds.forEach(binding => {
                this.parseDeps(binding)
            })
            this.computeds = []
            this.paresing = false
        }
        ```

    - 最后，当todos更新时，会调用seed._bindings['todos'].emitChange() 方法

        ```javascript
        // binding.js
        emitChange() {
            this.dependents.forEach((directive) => {
                directive.refresh()
            })
        }
        ```

