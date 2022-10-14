//consts
const express = require('express')
const PORT = process.env.PORT || 3000
const app = express()

//routes
app.use(express.static(__dirname + '/Style'))
app.use(express.static(__dirname + '/Script'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HTML/Home.html')
})

app.listen(PORT)