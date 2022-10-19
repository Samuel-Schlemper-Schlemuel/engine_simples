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
    await contaModel.find({
        email: email
    })
    .then(doc => {
        return 'exist'
    })
    .catch(err => {
        return 'dont exist'
    })
}

module.exports = {saveConta, findConta}