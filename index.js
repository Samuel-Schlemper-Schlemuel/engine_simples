require('dotenv').config()

//variaveis
const express = require('express')
const mongo = require('./mongoose.js')
const nodemailer = require('nodemailer')
const fs = require('fs')
const http = require('http')
const PORT = process.env.PORT || 3000
const emailSenha = process.env.emailSenha
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server)
var confirmacao = undefined
var userData = {
    email: undefined,
    password: undefined,
    username: undefined
}
var cabecario = `
<div id="cabecario">
    <p>By Samuel Schlemper</p> <button id="login"><a href="/login">Login</a></button> <button id="cadastro"><a href="/cadastro">Criar conta</a></button>
</div>
`

//functions
function gerarPassword() {
    let codigo = Math.random().toString(36).slice(-10)
    return codigo
}

io.on('connection', (socket) => {
})

//routes
app.use(express.static(__dirname + '/Style'))
app.use(express.static(__dirname + '/Script'))

app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    fs.readFile(__dirname + '/HTML/Home.html', 'utf-8', (err, data) => {
        if(err){
            console.error(err)
        } else {
            res.send(data + cabecario)
        }
    })
})

app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/HTML/cadastro.html')
})

app.post('/cadastro_efetuado', async (req, res) => {
    const email = req.body.email
    const password1 = req.body.password1
    const password2 = req.body.password2
    const nome = req.body.nome
    confirmacao = gerarPassword()

    if(password1 == '' || password2 == ''){
        res.redirect('/cadastro')
        io.emit('alert', 'Coloque uma senha')
        return
    } else if(password1 != password2){
        res.redirect('/cadastro')
        io.emit('alert', 'As senhas não são iguais')
        return
    }

    if(nome.length > 25){
        res.redirect('/cadastro')
        io.emit('alert', 'Nome grande demais, por favor, bote apenas um nome e um sobrenome')
        return
    }

    const exist = await mongo.seeIfCountExist(email)
    
    if(exist == 'exist'){
        res.redirect('/cadastro')
        io.emit('alert', 'Esse e-mail já possui uma conta')
        return
    } else if(exist == "don't exist"){
         
    } else {
        res.redirect('/cadastro')
        io.emit('alert', 'Houve algum erro, tente novamente mais tarde')
        return
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "samuelschlemper2006@gmail.com",
            pass: emailSenha
        }
      })
    
    const mailOptions = {
        from: 'samuelschlemper2006@gmail.com',
        to: email,
        subject: 'Pin da engine simples',
        text: confirmacao
    }

    transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            res.send(err)
        } else {
            userData.email = email
            userData.password = password1
            userData.username = nome
            res.sendFile(__dirname + '/HTML/confirmar_email.html')
        }
    })
})

app.post('/confirmar_email', async (req, res) => {
    const codigo = req.body.codigo

    if(codigo == confirmacao){
        const exist = await mongo.seeIfCountExist(userData.email)
    
        if(exist == 'exist'){
            res.redirect('/cadastro')
            io.emit('alert', 'Esse e-mail já possui uma conta')
            return
        } else if(exist == "don't exist"){
            
        } else {
            res.redirect('/cadastro')
            io.emit('alert', 'Houve algum erro, tente novamente mais tarde')
            return
        }

        mongo.saveConta(userData.email, userData.password, userData.username)

        cabecario = `
        <div id="cabecario">
            <p>By Samuel Schlemper</p> <label id='userMail'>${userData.username}</label>
        </div>
        `
        res.redirect('/')
    } else {
        io.emit('alert', 'O código não está correto')
        res.redirect('/cadastro')
    }
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/HTML/login.html')
})

app.post('/login_efetuado', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const exist = await mongo.seeIfCountExist(email)
    
    if(exist == 'exist'){
        const conta = await mongo.findCount(email)

        if(conta == 'error'){
            res.redirect('/login')
            io.emit('alert', 'Houve algum erro, tente novamente mais tarde')
            return
        }

        if(password != conta.senha){
            res.redirect('/login')
            io.emit('alert', 'A senha está errada')
            return
        }

        userData.email = conta.email
        userData.password = conta.senha
        userData.username = conta.username

        cabecario = `
        <div id="cabecario">
        <p>By Samuel Schlemper</p> <label id='userMail'>${userData.username}</label>
        </div>
        `

        res.redirect('/')

    } else if(exist == "don't exist"){
        res.redirect('/login')
        io.emit('alert', 'Não existe conta com esse email')
        return
    } else {
        res.redirect('/login')
        io.emit('alert', 'Houve algum erro, tente novamente mais tarde')
        return
    }
})

server.listen(PORT)