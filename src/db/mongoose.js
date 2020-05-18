const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
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
			if (value.toLowercase().includes('password')) throw new Error('Invalid Password')
		}
	}
})

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	}
})

const task1 = new Task({
	description: '     learn VUE       ',
})

task1.save()
	.then(() => console.log(task1))
	.catch(e => console.log(e))