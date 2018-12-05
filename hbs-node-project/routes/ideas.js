const express = require('express')
const router = express.Router()
const Idea = require('../models/Idea')

// 列表
router.get('/', async (req, res) => {
    let result = await Idea.find({}).sort({createDate: 1})

    res.render('ideas/index', {
        title: '课程列表',
        ideas: result,
    })
})
// 添加
router.get('/add', async (req, res) => {
    res.render('ideas/add', {
        title: '添加课程',
    })
})
// 添加逻辑
router.post('/', async (req, res) => {
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
            req.flash('success_msg', '课程添加成功')
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
router.get('/edit/:id', async (req, res) => {
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
router.post('/edit/:id', async (req, res) => {
    const {title = '', detail = '', id = ''} = req.body

    try {
        await Idea.findByIdAndUpdate(id, {detail, title})
        req.flash('success_msg', '课程编辑成功')
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
router.post('/remove/:id', async (req, res) => {
    const id = req.params.id

    try {
        await Idea.findByIdAndRemove(id)
        req.flash('success_msg', '课程删除成功')
        res.redirect('/ideas')
    } catch (e) {
        res.render('error', {errorMsg: '未知的错误'})
    }
})

module.exports = router