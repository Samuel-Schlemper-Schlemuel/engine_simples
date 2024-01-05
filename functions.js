function gerarPassword() {
    let codigo = Math.random().toString(36).slice(-10)
    return codigo
}

function alert(msg, res, arquivo){
    return res.render(__dirname + '/EJS' + arquivo, {
        message: msg
    })
}

module.exports = {gerarPassword, alert}