require('colors')
const express = require('express')
const handlebars = require('express-handlebars')
const parse = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const ideasRouter = require('./routes/ideas')
const usersRouter = require('./routes/users')
const path = require('path')

start().then()

async function start() {
    console.info('\n--- 正在连接数据库 ---\n'.green)

    try {
        await mongoose.connect(
            'mongodb://localhost/hbs-node-project',
            {
                useNewUrlParser: true,
                useCreateIndex: true,
            },
        )
    } catch (e) {
        console.info('\n--- 数据库连接失败 ---\n'.red)
        console.error(e)
        return
    }

    console.info('\n--- 数据库连接成功 ---\n'.green)
    console.info('\n--- 准备启动服务器 ---\n'.green)

    const port = 8080
    const app = express()

    /* -------------∽-★-∽---静态文件---∽-★-∽------------- */
    app.use(express.static(path.resolve(__dirname, 'public')))

    /* -------------∽-★-∽---中间件---∽-★-∽------------- */
    // handlebars
    app.engine('handlebars', handlebars({
        defaultLayout: 'main',
    }))
    app.set('view engine', 'handlebars')

    // body-parse
    app.use(parse.json())
    app.use(parse.urlencoded({extended: false}))

    // session
    app.use(session({
        secret: 'my-secret',
        resave: true,
        saveUninitialized: true,
    }))

    // 全局变量设置
    app.use(flash())
    app.use(function (req, res, next) {
        res.locals.errors_msg = req.flash('errors_msg')
        res.locals.success_msg = req.flash('success_msg')
        next()
    })

    /* -------------∽-★-∽---路由---∽-★-∽------------- */
    app.get('/', (req, res) => {
        res.render('index', {
            title: '首页',
            isIndex: true,
        })
    })
    app.get('/about', (req, res) => {
        res.render('about', {
            title: '关于',
            isAbout: true,
        })
    })

    // 课程n
    app.use('/ideas', ideasRouter)
    // 用户
    app.use('/users', usersRouter)

    app.listen(port, () => {
        console.info(`\n--- 服务器启动成功，端口${port}---\n`.green)
    })
}