var links = localStorage.getItem('games').split(',')
var id_links = document.getElementById('links')

if(links == 'não há'){
    id_links.innerHTML = links
} else {
    for(i in links){
        id_links.innerHTML += `<br><a href="/game/${links[i]}">${links[i]}</a> <i onclick="apagar('${links[i]}')" class="bi bi-trash" style="font-size: 30px; color: rgb(255, 0, 0);"></i><br>`
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
            data: {email: localStorage.getItem('email'), link: link},
            success: (data) => {
                    $('body').html(data)
                }
        })
    }
}