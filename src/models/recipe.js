//Recipe Schema

const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    comments: [],
    likes: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Recipe = mongoose.model('recipes', recipeSchema)

module.exports = Recipe