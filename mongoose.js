require('dotenv').config()
const mongoose = require('mongoose')
const URI = process.env.MONGO_URI

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})

const contaSchma = new mongoose.Schema({
    email: String,
    senha: String,
    username: String
})

const contaModel = mongoose.model('conta', contaSchma)

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

module.exports = {saveConta, seeIfCountExist, findCount}