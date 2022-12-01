var aberto = false

var data = {email: localStorage.getItem('email'),
            username: localStorage.getItem('username')
        }

function sair(){
    localStorage.removeItem('email')
    localStorage.removeItem('senha')
    localStorage.removeItem('username')

    document.location.reload()
}

function abrir(){
    var mailUI = document.getElementById('mailUI')

    if(aberto) {
        mailUI.innerHTML = `<label id='userMail'>${data.username}</label>`
        aberto = false
    } else {
        mailUI.innerHTML += `
        <br>
        <br>
        <a href="/jogos" class="link"><div id="jogos">Jogos criados</div></a>
        <br>
        <div onclick="sair()" id="sair">Sair</div>
        `
        aberto = true
    }
}