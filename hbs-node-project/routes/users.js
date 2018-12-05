const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User')
const bcrypt = require('bcrypt')
const Chain = require('func-chain')

// 登录
router.get('/login', async (req, res) => {
    res.render('users/login', {
        title: '登录',
        isLogin: true,
    })
})
// 登录逻辑
router.post('/login', async (req, res) => {
    const {username, password} = req.body

    const targetUser = await UserSchema.findOne({username})
    if (!targetUser) return returnError('用户名或密码错误')

    // 密码验证
    bcrypt.compare(password, targetUser.password, function (err, result) {
        if (!err && result) {
            req['flash']('success_msg', '登录成功')
            res.redirect('/ideas')
        }else{
            returnError('用户名或密码错误')
        }
    })

    // 返回错误页面
    function returnError(msg) {
        res.render('users/login', {
            username, password,
            error_msg: msg,
            title: '登录',
            isLogin: true,
        })
    }
})
// 注册
router.get('/register', async (req, res) => {
    res.render('users/register', {
        title: '注册',
        isRegister: true,
    })
})
// 注册逻辑
router.post('/register', async (req, res) => {
    let {username, password, confirm_password} = req.body

    let errors = [
        {test: !username, msg: '用户名不能为空'},
        {test: password !== confirm_password, msg: '两次密码不一致'},
        {test: password.length < 3, msg: '密码长度不能小于3'},
    ]
    if (
        errors.some((value) => {
            if (value.test) {
                returnError(value.msg)
                return true
            }
        })
    ) return

    Chain()
    // 密码加密
    > bcrypt.genSalt.args(10)
    > function (err, salt, next) {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                console.log(err)
                return next.stop()
            }

            next(hash)
        })
    }

    // 保存
    > async function (hash) {
        password = hash

        const newUser = UserSchema({username, password})

        try {
            await newUser.save()

            req['flash']('success_msg', '注册成功')
            res.redirect('/users/login')
        } catch (e) {
            if (e.code === 11000) {
                returnError('用户名已存在')
            } else {
                returnError('未知的错误')
            }
        }
    }
    || Chain['go']()

    // 返回错误页面
    function returnError(msg) {
        res.render('users/register', {
            username, password, confirm_password,
            error_msg: msg,
            title: '注册',
            isRegister: true,
        })
    }
})

module.exports = router