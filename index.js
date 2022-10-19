require('dotenv').config()

//variaveis
const express = require('express')
const mongo = require('./mongoose.js')
const alert = require('alert')
const nodemailer = require('nodemailer')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const emailSenha = process.env.emailSenha
const app = express()
var confirmacao = undefined
var userData = {
    email: undefined,
    password: undefined
}
var cabecario = `
<div id="cabecario">
    <p>By Samuel Schlemper</p> <button id="cadastro"><a href="/cadastro">Criar conta</a></button>
</div>
`

//functions
function gerarPassword() {
    return Math.random().toString(36).slice(-10)
}

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
    confirmacao = gerarPassword()

    if(password1 == '' || password2 == ''){
        alert('Coloque a senha')
        res.redirect('/cadastro')
        return
    } else if(password1 != password2){
        alert('As senhas não são iguais')
        res.redirect('/cadastro')
        return
    }

    const exist = await mongo.findConta(email)
    
    if(exist == 'exist'){
        alert('Esse e-mail já possui uma conta')
        res.redirect('/cadastro')
        return
    } else if(exist == "don't exist"){
         
    } else {
        alert('Houve algum erro, tente novamente mais tarde')
        res.redirect('/cadastro')
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
            res.sendFile(__dirname + '/HTML/confirmar_email.html')
        }
    })
})

app.post('/confirmar_email', (req, res) => {
    const codigo = req.body.codigo

    if(codigo == confirmacao){
        mongo.saveConta(userData.email, userData.password)
        fs.readFile(__dirname + '/HTML/Home.html', 'utf-8', (err, data) => {
            if(err){
                console.error(err)
            } else {
                cabecario = `
                <div id="cabecario">
                    <p>By Samuel Schlemper</p> <label id='userMail'>'${userData.email}'</label>
                </div>
                `
                res.redirect('/')
            }
        })
    } else {
        alert('O código não está correto')
        res.redirect('/cadastro')
    }
})

app.listen(PORT)