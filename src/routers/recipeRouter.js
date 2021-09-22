const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Recipe = require('../models/recipe')
const Comment = require('../models/comment')

//req.user._id is the id of authenticated user whic is set in the header
//New Recipe
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

//Delete Recipe
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


//Update Recipe
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

//Add Like To Recipe
router.post('/like/recipe/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
    
        if(!recipe) {
            throw new Error('Такого рецепта не существует!')
        }

        const likeExists = recipe.likedBy.filter((id) => id.equals(req.user._id))
        let liked = false

        if(likeExists.length === 0) {
            recipe.likes += 1
            recipe.likedBy = recipe.likedBy.concat(req.user._id)
            liked = true
        } else {
            if(recipe.likes > 0) {
                recipe.likes -= 1
            }
            recipe.likedBy = recipe.likedBy.filter((id) => !id.equals(req.user._id))
        }

        await recipe.save()
        res.status(200).send({recipe, liked})

    } catch (e) {
        res.status(500).send(e.message)
    }
})

//Recipes of authenticated user
router.get('/my/recipes', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ owner: req.user._id})

        if(!recipes.length) {
            throw new Error('У вас нет рецептов')
        }

        res.status(200).send(recipes)

    }catch (e) {
        res.status(500).send(e.message)
    }
})

//View of 1 selected recipe
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

//All recipes
router.get('/all/recipes', async (req, res) => {
    try{

        const recipes = await Recipe.find()
        res.status(200).send(recipes)

    } catch (e) {
        res.status(500).send('Что то пошло не так!')
    }
})

module.exports = router