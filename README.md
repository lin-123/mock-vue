# mock vue

## todo

- 数据的遍历： v-for 仔细看
  - 创建子的seed类来实现

## done

- 遍历dom 来完成数据创建和绑定
- sd-on-click not fix
  * fixed by recusion dom

## note

- bindings 将dom，data保存在内存里。
- Object.defineProperty将bindings上的数据映射到dom上

## vue seed.js build

- webpack --config dist/webpack.config.js --watch