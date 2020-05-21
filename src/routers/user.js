const express = require('express')
const router = new express.Router()
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const userEmails = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        userEmails.sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token)
        console.log(req.user.tokens)
        console.log(req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/self', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/self', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'email', 'age', 'password']
    const isAllowed = updates.every(update => allowed.includes(update))
    if (!isAllowed) return res.status(400).send({ error: 'Trying to add invalid updates!' })
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/self', auth, async (req, res) => {
    try {
        await req.user.remove()
        userEmails.sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an Image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/self/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/self/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) throw new Error()
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router