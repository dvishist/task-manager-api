const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: "Vishist",
            age: 21,
            email: "dvishist27@gmail.com",
            password: "myPass1234"
        })
        .expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Vishist',
            age: 21,
            email: 'dvishist27@gmail.com'
        },
        token: user.tokens[0].token
    })
})

test('Should login existing user', async () => {
    const { body: { token } } = await request(app).post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(token).toBe(user.tokens[1].token)
})

test('Should not login non existing user', async () => {
    await request(app).post('/users/login')
        .send({
            email: 'abc@example.com',
            password: 'testPass122'
        })
        .expect(400)
})

test('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/self')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/self')
        .send()
        .expect(401)
})

test('Should delete authenticated user', async () => {
    await request(app)
        .delete('/users/self')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .delete('/users/self')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/self/avatar')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/self')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'newName'
        })
        .expect(200)
    const user = await User.findById(userOne._id)
    expect(user.name).toBe('newName')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/self')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'melbourne'
        })
        .expect(400)
})