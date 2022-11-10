require('dotenv').config()
const mongoose = require('mongoose')
const URI = process.env.MONGO_URI

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})

const contaSchma = new mongoose.Schema({
    email: String,
    senha: String,
    username: String
})

const gameSchma = new mongoose.Schema({
    game: Object,
    email: String,
    username: String,
    link: String
})

const contaModel = mongoose.model('conta', contaSchma)
const gameModel = mongoose.model('game', gameSchma)

function saveConta(email, senha, username){
    let conta = new contaModel({
        email: email,
        senha: senha,
        username: username
    })

    conta.save()
}

async function seeIfCountExist(email){
    let encontrado = []

    await contaModel.find({
        email: email
    })
    .then(doc => {
        encontrado = doc
    })
    .catch(err => {
        return err
    })

    if(encontrado.length == 0){
        return "don't exist"
    } else {
        return 'exist'
    }
}

async function findCount(email){
    let result

    await contaModel.find({
        email: email
    })
    .then(doc => {
        result = doc[0]
    })
    .catch(err => {
        result = 'error'
    })

    return result
}

function saveGame(game, email, username){
    var text1 = Math.random().toString(36).slice(2)
    var text2 = Math.random().toString(36).slice(2)
    var text3 = Math.random().toString(36).slice(2)
    var text = text1 + text2 + text3
    text = text.substring(text.length - 20)

    let jogo = new gameModel({
        game: game,
        email: email,
        username: username,
        link: text
    })

    jogo.save()
    return '/' + text
}

async function getGame(link){
    let result

    await gameModel.find({
        link: link
    })
    .then(doc => {
        result = doc[0]
    })
    .catch(err => {
        result = 'error'
    })

    if(result == undefined){
        result = 'não encontrado'
    }
    
    return result
}

module.exports = {saveConta, seeIfCountExist, findCount, saveGame, getGame}