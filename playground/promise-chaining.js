require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('5ec2a61d981f4127283ee5d3', { age: 41 })
	.then(user => {
		console.log(user)
		return User.countDocuments({ age: 41 })
	})
	.then(result => console.log(result))
	.catch(e => console.log(e))
