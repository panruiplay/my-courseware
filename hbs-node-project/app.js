require('colors')
const express = require('express')
const handlebars = require('express-handlebars')
const parse = require('body-parser')
const mongoose = require('mongoose')
const Idea = require('./models/Idea')

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

    // handlebars
    app.engine('handlebars', handlebars({
        defaultLayout: 'main',
    }))
    app.set('view engine', 'handlebars')

    // body-parse
    app.use(parse.json())
    app.use(parse.urlencoded({extended: false}))

    // 路由
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

    /* -------------∽-★-∽---课程---∽-★-∽------------- */
    // 列表
    app.get('/ideas', async (req, res) => {
        let result = await Idea.find({}).sort({createDate: 1})

        res.render('ideas/index', {
            title: '课程列表',
            ideas: result,
        })
    })
    // 添加
    app.get('/ideas/add', async (req, res) => {
        res.render('ideas/add', {
            title: '添加课程',
        })
    })
    // 添加逻辑
    app.post('/ideas', async (req, res) => {
        const {ideaTitle = '', ideaDetail = ''} = req.body

        if (!ideaTitle || !ideaDetail) {
            res.render('ideas/add', {
                title: '添加课程',
                error: '请补全信息',
                ideaTitle,
                ideaDetail,
            })
        } else {
            let newIdea = new Idea({
                title: ideaTitle,
                detail: ideaDetail,
            })

            try {
                await newIdea.save()
                res.redirect('/ideas')
            } catch (e) {
                if (e.code === 11000) {
                    res.render('error', {errorMsg: '存在相同的课程名称'})
                } else {
                    res.render('error', {errorMsg: '未知的错误'})
                }
            }
        }
    })
    // 编辑
    app.get('/ideas/edit/:id', async (req, res) => {
        const _id = req.params.id

        try {
            const result = await Idea.findOne({_id})
            return res.render('ideas/edit', {
                idea: result,
                title: '编辑课程',
            })
        } catch (e) {
            res.render('error', {errorMsg: '没有找到改课程'})
        }
    })
    // 编辑逻辑
    app.post('/ideas/edit/:id', async (req, res) => {
        const {title = '', detail = '', id = ''} = req.body

        try {
            await Idea.findByIdAndUpdate(id, {detail, title})
            res.redirect('/ideas')
        } catch (e) {
            if (e.code === 11000) {
                res.render(`ideas/edit`, {
                    title: '编辑课程',
                    idea: {id: id, title, detail},
                    error: '存在相同的课程名称',
                })
            } else {
                res.render('error', {errorMsg: '未知的错误'})
            }
        }
    })
    // 删除逻辑
    app.post('/ideas/remove/:id', async (req, res) => {
        const id = req.params.id

        try {
            await Idea.findByIdAndRemove(id)
            res.redirect('/ideas')
        } catch (e) {
            res.render('error', {errorMsg: '未知的错误'})
        }
    })

    app.listen(port, () => {
        console.info('\n--- 服务器启动成功 ---\n'.green)
    })
}