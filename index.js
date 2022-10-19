require('dotenv').config()

//consts
const express = require('express')
const mongo = require('./mongoose.js')
const alert = require('alert')
const nodemailer = require('nodemailer')
const PORT = process.env.PORT || 3000
const emailSenha = process.env.emailSenha
const app = express()
var confirmacao = undefined

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
    res.sendFile(__dirname + '/HTML/Home.html')
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
        res.redirect('/cadastro')
        alert('Coloque a senha')
        return
    } else if(password1 != password2){
        res.redirect('/cadastro')
        alert('As senhas não são iguais')
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
        }
    })

    res.redirect('/cadastro')
    return
})

app.listen(PORT)