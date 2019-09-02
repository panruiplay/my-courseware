export default {
    esm: 'rollup',
    cjs: 'rollup',
    umd: {
        name: 'testA',
        globals: {
            react: "React"
        }
    }
}
