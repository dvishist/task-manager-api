const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

const id = new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
	if (error) {
		return console.log('unable to connect to database')
	}

	const db = client.db(dbName)

	db.collection('task').deleteOne({ description: 'Buy groceries' })
		.then(result => console.log(result))
		.catch(e => console.log(e))

})
