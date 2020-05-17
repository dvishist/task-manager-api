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

	db.collection('users').updateOne(
		{
			_id: new ObjectID('5ec17535a3a5d3497cb09a11')
		},
		{
			$set: {
				name: 'Baburao'
			}
		}
	).then(result => {
		console.log(result)
	}).catch((e) => {
		console.log(e)
	})


})
