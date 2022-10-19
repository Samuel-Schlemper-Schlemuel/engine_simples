require('dotenv').config()
const mongoose = require('mongoose')
const URI = process.env.MONGO_URI

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})

const contaSchma = new mongoose.Schema({
    email: String,
    senha: String
})

const contaModel = mongoose.model('conta', contaSchma)

function saveConta(email, senha){
    let conta = new contaModel({
        email: email,
        senha: senha
    })

    conta.save()
}

async function findConta(email){
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

module.exports = {saveConta, findConta}