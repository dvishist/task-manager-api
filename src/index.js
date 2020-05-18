const express = require('express')

const app = new express()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})