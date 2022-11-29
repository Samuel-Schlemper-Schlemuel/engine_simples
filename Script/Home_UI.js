history.pushState({}, null, '/')
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
        <div id="jogos" onclick="jogos()">Jogos criados</div>
        <br>
        <div onclick="sair()" id="sair">Sair</div>
        `
        aberto = true
    }
}

function jogos(){
    $.ajax({
        type: "POST",
        url: '/jogos',
        data: {email: data.email},
        success: (data) => {
                history.pushState({}, null, '/jogos')
                $('body').html(data)
            }
        })
}