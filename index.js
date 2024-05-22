require('dotenv').config()

//variaveis
const express = require('express')
const PORT = process.env.PORT || 3000
const app = express()

//set and use
app.use(express.static(__dirname + '/Style'))
app.use(express.static(__dirname + '/Script'))
app.use(express.static(__dirname + '/Imagens'))
app.set('view engine', 'ejs')
app.use(express.json({limit: '18mb'}))
app.use(express.urlencoded({extended: true, limit: '18mb'}))

//routes
const userRoutes = require('./routes.js')
userRoutes(app)

app.listen(PORT)