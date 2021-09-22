//Comment Router

const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Comment = require('../models/comment')


//New Comment
//req.user._id is the id of authenticated user whic is set in the header
router.post('/new/comment/:id', auth, async (req, res) => {
    try {
        const comment = await new Comment({
            name: req.user.name,
            comment: req.body.comment,
            post: req.params.id,
            author: req.user._id
        })

        await comment.save()
        res.status(201).send(comment)
        
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//Delete Post
router.post('/delete/comment/:id', auth, async (req, res) => {
    try{
        const comment = await Comment.findById(req.params.id)
    
        if(!comment) {
            throw new Error('Такого комментария не существует!')
        }

        if(!comment.author.equals(req.user._id)) {
            throw new Error('Это не ваш комментарий!')
        }

        await comment.remove()

        res.status(200).send('Комментарий успешно удален!')

    } catch (e) {
        res.status(500).send('Что то пошло не так!')
    }
})

//All Comments
router.get('/all/comments', auth, async (req, res) => {
    try{
        const comments = await Comment.find({})
        res.status(200).send(comments)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router

