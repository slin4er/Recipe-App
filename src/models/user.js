//User Schema

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        default: 'Пользователь Yummy'
    },
    password: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    favorite: [{
        recipeId:{
            type: mongoose.Schema.Types.ObjectId
        }
    }],
    tokens: [{
        token: {
            type: String,
            rquired: true
        }
    }],
    avatar: {
        type: Buffer
    }
})

userSchema.statics.findByCredentials = async (login, password) => {
    const user = await User.findOne({login})
    if(!user) {
        throw new Error('Не найдено')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Неверный логин или пароль!')
    }

    return user
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})

    await user.save()
    return token
}

userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('users', userSchema)

module.exports = User