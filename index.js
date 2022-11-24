require('dotenv').config()

//variaveis
const express = require('express')
const mongo = require('./mongoose.js')
const nodemailer = require('nodemailer')
const PORT = process.env.PORT || 3000
const emailSenha = process.env.emailSenha
const app = express()

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
       login: '',
       creatNow: false,
       recarregar: false,
       message: null
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
    const confirmacao = gerarPassword()

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
            res.render(__dirname + '/EJS/confirmar_email.ejs', {
                message: '',
                confirmacao: confirmacao,
                email: email,
                senha: password1,
                nome: nome
            })
        }
    })
})

app.post('/confirmar_email', async (req, res) => {
    const codigo = req.body.codigo
    const confirmacao = req.body.confirmacao
    const userData = {
        email: req.body.email,
        password: req.body.senha,
        username: req.body.username
    }

    if(codigo == confirmacao){
        const exist = await mongo.seeIfCountExist(userData.email)
    
        if(exist == 'exist'){
            return res.render(__dirname + '/EJS' + '/confirmar_email.ejs', {
                message: 'Esse email possui conta',
                confirmacao: confirmacao,
                email: userData.email,
                senha: userData.password,
                nome: userData.username
            })
        } else if(exist == "don't exist"){
            
        } else {
            return res.render(__dirname + '/EJS' + '/confirmar_email.ejs', {
                message: 'Houve algum erro, tente novamente mais tarde',
                confirmacao: confirmacao,
                email: userData.email,
                senha: userData.password,
                nome: userData.username
            })
        }

        mongo.saveConta(userData.email, userData.password, userData.username)

        res.render(__dirname + '/EJS/Home.ejs', {
            creatNow: true,
            login: userData.username,
            senha: userData.password,
            email: userData.email,
            recarregar: true,
            message: null
        })

    } else {
        return res.render(__dirname + '/EJS' + '/confirmar_email.ejs', {
            message: 'O código não está correto',
            confirmacao: confirmacao,
            email: userData.email,
            senha: userData.password,
            nome: userData.username
        })
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
            login: conta.username,
            creatNow: false,
            recarregar: false,
            message: null
        })

    } else if(exist == "don't exist"){
        return alert('Não existe conta com esse email', res, '/login.ejs')
    } else {
        return alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
    }
})

app.post('/save_game', async (req, res) => {
    const email = req.body.email
    const senha = req.body.senha
    const game = req.body.game
    let username = ''

    const exist = await mongo.seeIfCountExist(email)
    
    if(exist == 'exist'){
        const conta = await mongo.findCount(email)

        if(conta == 'error'){
            return alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
        } else if(senha != conta.senha){
            return alert('A senha está errada', res, '/login.ejs')
        } else {
            username = conta.username
        }

    } else if(exist == "don't exist"){
        return alert('Não existe conta com esse email', res, '/login.ejs')
    } else {
        return alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
    }

    let url = '/game' + mongo.saveGame(game, email, username)

    res.send(url)
})

app.get('/game/:link', async (req, res) => {
    const link = req.params.link
    const game = await mongo.getGame(link)

    if(game == 'error'){
        res.render(__dirname + '/EJS/Home.ejs', {
            login: '',
            creatNow: false,
            recarregar: false,
            message: game
        })
    } else if(game == 'não encontrado'){
        res.render(__dirname + '/EJS/Home.ejs', {
            login: '',
            creatNow: false,
            recarregar: false,
            message: game
        })  
    } else {
        res.render(__dirname + '/EJS/game.ejs', {
            game: JSON.stringify(game.game),
            username: game.username,
            message: null
         })
    }
})

app.post('/jogos', async (req, res) => {
    const links = await mongo.links(req.body.email)

    if(links == 'error'){
        return res.render(__dirname + '/EJS/Home.ejs', {
            login: '',
            creatNow: false,
            recarregar: false,
            message: game
        })
    }

    res.render(__dirname + '/EJS/links.ejs', {
        links: links
     })
})

app.listen(PORT)