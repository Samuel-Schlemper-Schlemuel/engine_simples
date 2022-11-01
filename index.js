require('dotenv').config()

//variaveis
const express = require('express')
const mongo = require('./mongoose.js')
const nodemailer = require('nodemailer')
const fs = require('fs')
const PORT = process.env.PORT || 3000
const emailSenha = process.env.emailSenha
const appId = process.env.appId
const secret = process.env.secret
const app = express()
var confirmacao = undefined
var userData = {
    email: undefined,
    password: undefined,
    username: undefined
}

//functions
function gerarPassword() {
    let codigo = Math.random().toString(36).slice(-10)
    return codigo
}

function alert(msg, res, arquivo){
    return res.render(__dirname + '/EJS' + arquivo, {
        message: msg
    })
}

//routes
app.use(express.static(__dirname + '/Style'))
app.use(express.static(__dirname + '/Script'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.render(__dirname + '/EJS/Home.ejs', {
       login: ''
    })
})

app.get('/cadastro', (req, res) => {
    res.render(__dirname + '/EJS/cadastro.ejs', {
        message: ''
    })
})

app.post('/cadastro_efetuado', async (req, res) => {
    const email = req.body.email
    const password1 = req.body.password1
    const password2 = req.body.password2
    const nome = req.body.nome
    confirmacao = gerarPassword()

    if(password1 == '' || password2 == ''){
        return alert('Coloque uma senha', res, '/cadastro.ejs')
    } else if(password1 != password2){
        return alert('As senhas não são iguais', res, '/cadastro.ejs')
    }

    if(nome.length > 25){
        return alert('Nome grande demais, por favor, bote apenas um nome e um sobrenome', res, '/cadastro.ejs')
    }

    const exist = await mongo.seeIfCountExist(email)
    
    if(exist == 'exist'){
        return alert('Esse e-mail já possui uma conta', res, '/cadastro.ejs')
    } else if(exist == "don't exist"){
         
    } else {
        return alert('Houve algum erro, tente novamente mais tarde', res, '/cadastro.ejs')
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
            res.render(__dirname + '/EJS/confirmar_email.ejs', {
                message: ''
            })
        }
    })
})

app.post('/confirmar_email', async (req, res) => {
    const codigo = req.body.codigo

    if(codigo == confirmacao){
        const exist = await mongo.seeIfCountExist(userData.email)
    
        if(exist == 'exist'){
            return alert('Esse email possui conta', res, '/confirmar_email.ejs')
        } else if(exist == "don't exist"){
            
        } else {
            return alert('Houve algum erro, tente novamente mais tarde', res, '/confirmar_email.ejs')
        }

        mongo.saveConta(userData.email, userData.password, userData.username)

        res.render(__dirname + '/EJS/Home.ejs', {
            login: userData.username
        })

    } else {
        return alert('O código não está correto', res, '/confirmar_email.ejs')
    }
})

app.get('/login', (req, res) => {
    res.render(__dirname + '/EJS/login.ejs', {
        message: ''
    })
})

app.post('/login_efetuado', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const exist = await mongo.seeIfCountExist(email)
    
    if(exist == 'exist'){
        const conta = await mongo.findCount(email)

        if(conta == 'error'){
            return alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
        }

        if(password != conta.senha){
            return alert('A senha está errada', res, '/login.ejs')
        }

        res.render(__dirname + '/EJS/Home.ejs', {
            login: conta.username
        })

    } else if(exist == "don't exist"){
        return alert('Não existe conta com esse email', res, '/login.ejs')
    } else {
        return alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
    }
})

app.listen(PORT)