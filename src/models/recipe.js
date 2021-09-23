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
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    likes: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    photo: {
        type: Buffer
    }
})

recipeSchema.methods.toJSON = function () {
    const recipe = this
    const recipeObject = recipe.toObject()

    delete recipeObject.photo
    
    return recipeObject
}

const Recipe = mongoose.model('recipes', recipeSchema)

module.exports = Recipe