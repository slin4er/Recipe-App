const User = require('../models/user')
const Comment = require('../models/comment')
const Recipe = require('../models/recipe')
const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const bcrypt = require('bcryptjs')

//req.user._id is the id of authenticated user whic is set in the header
//New User
router.post('/user/signup', async(req, res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//User SignIn
router.post('/user/signin', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.login, req.body.password)

        if(!user) {
            throw new Error('Не найдено')
        }

        const token = await user.generateAuthToken()

        await user.save()

        res.status(200).send({token})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//User Logout
router.post('/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Вы успешно вышли!')
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//Delete User
router.post('/delete/user', auth, async (req, res) => {
    try{
        const isMatch = await bcrypt.compare(req.body.password, req.user.password)

        if(!isMatch) {
            throw new Error('Пароли не совпадают!')
        }

        await Comment.deleteMany({ author: req.user._id })
        await Recipe.deleteMany({ owner: req.user._id })
        await User.deleteOne({ _id: req.user._id })

        res.status(200).send('Успешно удалено!')

    } catch (e) {
        res.status(500).send(e.message)
    }
})

//All Users
router.get('/users', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send('Что то пошло не так!')
    }
})

//My profile
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

module.exports = router