require('../src/db/mongoose')
const Task = require('../src/models/task')

const deleteAndCount = async id => {
	const task = await Task.findByIdAndDelete(id)
	console.log(task)
	const count = await Task.countDocuments({ completed: false })
	return count
}

deleteAndCount('5ec2f9a25b6afe2450823de4')
	.then(count => console.log(count))
	.catch(e => console.log(e))
