一个JS库的标准模板

### 关于 dependencies、peerDependencies 和 external
1. cjs 和 esm 格式打包方式选 rollup 时有个约定，dependencies 和 peerDependencies 里的内容会被 external
2. esm.mjs 和 umd 格式，只有 peerDenendencies 会被 external
3. 打包方式 babel 时无需考虑 external，因为是文件到文件的编译，不处理文件合并

注意：对于第一条，dependencies也会被忽略，是因为，用户从npm上下载我们的包之后，dependencies里面的内容会被安装到node_modules里面，
所以dependencies里的内容不需要打包到我们生成的js里面
