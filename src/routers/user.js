const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId)
        return user ? res.send(user) : res.status(404).send({ error: "User not found" })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'email', 'age', 'password']
    const isAllowed = updates.every(update => allowed.includes(update))
    if (!isAllowed) return res.status(400).send({ error: 'Trying to add invalid updates!' })
    try {
        const user = await User.findById(req.params.id)
        updates.forEach(update => user[update] = req.body[update])
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        return user ? res.send(user) : res.status(404).send({ error: "User not found" })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        return user ? res.send(user) : res.status(404).send({ error: "User not found" })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router