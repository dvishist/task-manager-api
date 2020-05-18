const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = new express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
	const user = new User(req.body)
	user.save()
		.then(() => res.status(201).send(user))
		.catch(e => res.status(400).send(e))
})

app.get('/users', (req, res) => {
	User.find({})
		.then(users => res.send(users))
		.catch(e => res.status(500).send())
})

app.get('/users/:id', (req, res) => {
	const userId = req.params.id
	User.findById(userId)
		.then(user => {
			return user ? res.send(user) : res.status(404).send()
		})
		.catch(e => res.status(500).send())
})

app.post('/tasks', (req, res) => {
	const task = new Task(req.body)
	task.save()
		.then(() => res.status(201).send(task))
		.catch(e => res.status(400).send(e))
})

app.get('/tasks', (req, res) => {
	Task.find({})
		.then(tasks => res.send(tasks))
		.catch(e => res.status(500).send())
})

app.get('/tasks:id', (req, res) => {
	const taskId = req.params.id
	Task.findById(taskId)
		.then(task => {
			return task ? res.send(task) : res.status(404).send()
		})
		.catch(e => res.status(500).send())
})

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})
