var f = require('./functions.js')
const mongo = require('./mongoose.js')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const emailSenha = process.env.emailSenha

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.render(__dirname + '/EJS/Home.ejs', {
           login: '',
           creatNow: false,
           recarregar: false,
           message: null,
           games: false,
           temporaly_games: null
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
        const confirmacao = f.gerarPassword()
    
        if(password1 == '' || password2 == ''){
            return f.alert('Coloque uma senha', res, '/cadastro.ejs')
        } else if(password1 != password2){
            return f.alert('As senhas não são iguais', res, '/cadastro.ejs')
        }
    
        if(nome.length > 25){
            return f.alert('Nome grande demais, por favor, bote apenas um nome e um sobrenome', res, '/cadastro.ejs')
        }
    
        const exist = await mongo.seeIfCountExist(email)
        
        if(exist == 'exist'){
            return f.alert('Esse e-mail já possui uma conta', res, '/cadastro.ejs')
        } else if(exist == "don't exist"){
             
        } else {
            return f.alert('Houve algum erro, tente novamente mais tarde', res, '/cadastro.ejs')
        }
    
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "321thm@gmail.com",
                pass: emailSenha
            }
          })
        
        const mailOptions = {
            from: '321thm@gmail.com',
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
            
            const senhaCrypto = await bcrypt.hash(userData.password, 10)
            mongo.saveConta(userData.email, senhaCrypto, userData.username)
    
            res.render(__dirname + '/EJS/Home.ejs', {
                creatNow: true,
                login: userData.username,
                senha: userData.password,
                email: userData.email,
                recarregar: true,
                message: null,
                games: false,
                temporaly_games: null
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
        const links = await mongo.links(email)
        const titles = await mongo.titles(email)
    
        const exist = await mongo.seeIfCountExist(email)
        
        if(exist == 'exist'){
            const conta = await mongo.findCount(email)
    
            if(conta == 'error'){
                return f.alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
            }

            let compare = await bcrypt.compare(password, conta.senha)

            if(!compare && (password != conta.senha || password.length > 15)){
                return f.alert('A senha está errada', res, '/login.ejs')
            }
    
            res.render(__dirname + '/EJS/Home.ejs', {
                login: conta.username,
                creatNow: false,
                recarregar: false,
                message: null,
                games: links.toString(),
                titles: titles.toString(),
                temporaly_games: null
            })
    
        } else if(exist == "don't exist"){
            return f.alert('Não existe conta com esse email', res, '/login.ejs')
        } else {
            return f.alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
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
            let compare = await bcrypt.compare(senha, conta.senha)
    
            if(conta == 'error'){
                return f.alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
            } else if(!compare && (senha != conta.senha || senha.length > 15)){
                return f.alert('A senha está errada', res, '/login.ejs')
            } else {
                username = conta.username
            }
    
        } else if(exist == "don't exist"){
            return f.alert('Não existe conta com esse email', res, '/login.ejs')
        } else {
            return f.alert('Houve um erro, tente novamente mais tarde', res, '/login.ejs')
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
                message: game,
                games: false,
                temporaly_games: null
            })
        } else if(game == 'não encontrado'){
            res.render(__dirname + '/EJS/Home.ejs', {
                login: '',
                creatNow: false,
                recarregar: false,
                message: game,
                games: false,
                temporaly_games: null
            })  
        } else {
            res.render(__dirname + '/EJS/game.ejs', {
                game: JSON.stringify(game.game),
                username: game.username,
                titulo: game.game.titulo
            })
        }
    })
    
    app.get('/jogos', async (req, res) => {
        res.render(__dirname + '/EJS/links.ejs', {})
    })
    
    app.post('/apagar', async (req, res) => {
        await mongo.apagarLink(req.body.link)
        res.redirect('jogos')
    })
    
    app.post('/editar', async (req, res) => {
        var game = await mongo.getGame(req.body.link)
        game.game.lnk = req.body.link
    
        res.render(__dirname + '/EJS/Home.ejs', {
            login: game.username,
            creatNow: false,
            recarregar: false,
            message: null,
            games: false,
            temporaly_games: JSON.stringify(game.game)
         })
    })
    
    app.post('/atualizar', async (req, res) => {
        await mongo.atualizarJogo(req.body.link, req.body.game)
        res.send(req.body.link)
    })
}