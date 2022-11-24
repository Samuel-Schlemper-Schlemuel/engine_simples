history.pushState({}, null, '/')

var data = {email: localStorage.getItem('email'),
            password: localStorage.getItem('senha'),
            username: localStorage.getItem('username')
        }

if(data.email == null || data.password == null || data.username == null){
} else {
    var mailUI = document.getElementById('mailUI')
    var aberto = false

    mailUI.addEventListener('click', () => {
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
        
    })
}

function sair(){
    localStorage.removeItem('email')
    localStorage.removeItem('senha')
    localStorage.removeItem('username')

    document.location.reload()
}

function jogos(){
    $.ajax({
        type: "POST",
        url: '/jogos',
        data: data,
        success: (data) => {
                history.pushState({}, null, '/jogos')
                $('body').html(data)
            }
        })
}