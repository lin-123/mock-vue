# mock vue

## Description

- vue learning
- mock vue
- track vue commit

## todo

- 数据的遍历： v-for 仔细看
  * [x] 创建子的seed类来实现
  * [x] watch array

## done

- 遍历dom 来完成数据创建和绑定
- sd-on-click not fix
  * fixed by recusion dom

## note

- bindings 将dom，data保存在内存里。
- Object.defineProperty将bindings上的数据映射到dom上

## vue seed.js build

- new webpack.config.js of vue/dist. this file will ignore by git
- webpack --config dist/webpack.config.js --watch
```javascript
const path = require('path');
const webpack = require('webpack')

const webpackConfig = {
  entry: {
    app: './src/main.js',
  },
  devtool: '#inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
      },
    ]
  },
  output: {
    filename: 'seed.js',
    path: path.resolve(__dirname),
    publicPath: '/',
    libraryTarget: "umd",
    library: "Seed"
  },
  plugins: []
};

module.exports = webpackConfig
```


## track by commit

- `➜  vue git:(314983973) ✗ ` copy current commit tag[314983973]
- `➜  vue git:(314983973) ✗ git log --graph --oneline --all`
- `/314983973` search current commit.
- click up button on keyboard to move terminal text up
- `➜  vue git:(314983973) ✗ gco 23a2bde88` copy next commit tag