const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is invalid')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error('Age cannot be negative')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('Invalid Password')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'signInUser')
    user.tokens.push({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Incorrect email or password')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Incorrect email or password')
    }
    return user

}

userSchema.pre('save', async function () {
    const user = this
    user.password = user.isModified('password') ? await bcrypt.hash(user.password, 8) : user.password
})

const User = mongoose.model('User', userSchema)

module.exports = User