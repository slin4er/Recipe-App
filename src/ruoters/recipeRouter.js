const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Recipe = require('../models/recipe')
const Comment = require('../models/comment')

router.post('/new/recipe', auth, async (req, res) => {
    try {
        const recipe = await new Recipe( {
            title: req.body.title,
            description: req.body.description,
            owner: req.user._id
        } )

        await recipe.save()

        res.status(201).send(recipe)
    
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/my/recipes', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({})
        const myRecipes = recipes.filter((owner) => owner.owner.equals(req.user._id))

        if(!myRecipes.length) {
            throw new Error('У вас нет рецептов')
        }

        res.status(200).send(myRecipes)

    }catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/delete/recipe/:id', auth, async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id)

        if(!recipe) {
            throw new Error('Такого не существует!')
        }

        if(!recipe.owner.equals(req.user._id)) {
            throw new Error('Вы не можете это сделать!')
        }
        
        await recipe.remove()
        await Comment.deleteMany({post: req.params.id})
    
        res.status(200).send('Успешно удалено')

    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/recipe/update/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        
        if(!recipe) {
            throw new Error('Что то пошло не так')
        }

        if(!recipe.owner.equals(req.user._id)){
            throw new Error('Вы не можете этого сделать!')
        }

        await recipe.updateOne(req.body)
        res.status(201).send(recipe)

    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/recipe/view/:id', async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id)

        if(!recipe) {
            throw new Error('Что то пошло не так!')
        }

        const comments = await Comment.find({post: req.params.id})
        res.status(200).send( {recipe, comments} )

    } catch (e) {
        res.status(500).send('Что то пошло не так!')
    }
})

router.get('/all/recipes', async (req, res) => {
    try{

        const recipes = await Recipe.find()
        res.status(200).send(recipes)

    } catch (e) {
        res.status(500).send('Что то пошло не так!')
    }
})

module.exports = router