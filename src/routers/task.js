const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const taskId = req.params.id
    try {
        const task = await Task.findById(taskId)
        task ? res.send(task) : res.status(404).send({ error: "Task not found" })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['completed', 'description']
    const isAllowed = updates.every(update => allowed.includes(update))
    if (!isAllowed) return res.status(400).send({ error: 'Trying to add invalid updates!' })
    try {
        const task = await Task.findById(req.params.id)
        updates.forEach(update => task[update] = req.body[updates])
        await task.save()
        task ? res.send(task) : res.status(400).send({ error: "Task not found" })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        task ? res.send(task) : res.status(404).send({ error: "Task not found" })
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router