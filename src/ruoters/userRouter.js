const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', async( req, res) => {
    res.status(200).send('hello there!')
})

router.post('/user/signup', async(req, res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

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

router.get('/users', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send('Что то пошло не так!')
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Вы успешно вышли!')
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

module.exports = router