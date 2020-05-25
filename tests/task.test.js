const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'test task'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
    expect(task.owner).toEqual(userOne._id)
})

test('Should get tasks for user', async () => {
    const tasks = await request(app)
        .get('/tasks')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(tasks.body).toHaveLength(2)
})

test('Should not get tasks for unauthenticated user', async () => {
    const tasks = await request(app)
        .get('/tasks')
        .send()
        .expect(401)
})

test('Should not delete other users task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()

})