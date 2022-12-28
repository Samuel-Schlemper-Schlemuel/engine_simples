var links = localStorage.getItem('games').split(',')
var titles = localStorage.getItem('titles').split(',')
var id_links = document.getElementById('links')
var usermail = localStorage.getItem('email')

if(links == 'não há'){
    id_links.innerHTML = links
} else {
    for(i in links){
        id_links.innerHTML += `<br><a href="/game/${links[i]}">${titles[i] == '' ? 'Sem titulo' : titles[i]}</a> <i onclick="apagar('${links[i]}')" class="bi bi-trash" style="font-size: 30px; color: rgb(255, 0, 0);"></i> &nbsp;<i onclick="editar('${links[i]}')" class="bi bi-pencil-fill" style="font-size: 30px; color: rgb(0, 0, 200);"></i><br>`
    }
}

function apagar(link){
    if(confirm('Você quer mesmo apagar esse jogo?')){
        links.splice(links.indexOf(link), 1)
        if(links.length == 0){
            localStorage.setItem('games', 'não há')
        } else {
            localStorage.setItem('games', links.toString())
        }

        $.ajax({
            type: "POST",
            url: '/apagar',
            data: {email: usermail, link: link},
            success: (data) => {
                $('body').html(data)
            }
        })
    }
}

function editar(link){
    postForm('/editar', {link: link})
}

function postForm(path, params) {
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}