var contagem_de_arrays = 0
var pontuacao = 0
var perguntas_da_questao = []
var tempo_game
var newGame = true
// As paletas funcionam na ordem [Background, Error, Right, Button normal, Button with mouse, Letter]
var paletas = {
    'Padrão': ['#FFFFFF', '#FF0000', '#00FF00', 'linear-gradient(to bottom, #bee6bd 5%, #0000CC 100%)', 'linear-gradient(to bottom, #0000CC 5%, #bee6bd 100%)', '#000000'],
    'Futurista': ['#000D0D', '#F21326', '#00FF00', 'linear-gradient(to bottom, #05F2F2 5%, #0D5FA6 100%)', 'linear-gradient(to bottom, #0D5FA6 5%, #05F2F2 100%)', '#F2F2F2'],
    'Infantil': ['#FFED67', '#FF0000', '#00FF00', 'linear-gradient(to bottom, #bee6bd 5%, #5A9FFF 100%)', 'linear-gradient(to bottom, #5A9FFF 5%, #bee6bd 100%)', '#000000']
}
var game = {
    questoes: {1: 3},
    quantidade_questao: 1,
    perguntas: [],
    paleta: paletas['Padrão'],
    paleta_name: 'Padrão',
    fonte: 'Marhey',
    imagem: false
}

if (localStorage.getItem('temporaly_game') != null){
    tempo_game = JSON.parse(localStorage.getItem('temporaly_game').split('&#34;').join('"'))
    newGame = false
} else if(localStorage.getItem('game') != null){
    tempo_game = JSON.parse(localStorage.getItem('game'))
}

if(tempo_game != null){
    tempo_game.questoes = convertToObject(tempo_game.questoes)
    tempo_game.quantidade_questao = Number.parseInt(tempo_game.quantidade_questao)

    if(typeof tempo_game.imagem == 'string'){
        tempo_game.imagem = tempo_game.imagem.toLowerCase() == 'true'
    }

    for(let c = 1; c <= tempo_game.quantidade_questao; c++){
        if(c >= 2){
            adicionar_questao()
        }
        
        for(let i = 4; i <= tempo_game.questoes[c]; i++){
            adicionar_resposta(c)
        }
    }
    document.getElementById('select_palette').value = tempo_game.paleta_name
    document.getElementById('select_fonte').value = tempo_game.fonte
    mudar_fonte()
    document.getElementById('tela').style.backgroundColor = tempo_game.paleta[0]
    game = JSON.parse(JSON.stringify(tempo_game))
    valor()
    save()
}

function save(){
    if(newGame){
        manipular_perguntas()
        localStorage.setItem('game', JSON.stringify(game))
    }
}

function adicionar_questao(){
    manipular_perguntas()
    document.getElementById('perguntas').innerHTML += `<div id='questao_completa_${game.quantidade_questao + 1}'>
                                                         <p>${repeat('&nbsp', 4)}Questão ${game.quantidade_questao + 1}: Clique para adicionar uma nova resposta a essa questão (minimo de 2 e maximo de 8)
                                                            <button class="bt-gr" id='nova_resposta' onclick="adicionar_resposta(${game.quantidade_questao + 1})">Nova Resposta</button> 
                                                            <button class="bt-rd" id='deletar_resposta' onclick="deletar_resposta(${game.quantidade_questao + 1})">Deletar última resposta</button></p>
                                                            <div id='questao_${game.quantidade_questao + 1}'>
                                                            ${repeat('&nbsp', 8)}<input id='questao_${game.quantidade_questao + 1}_resposta_1' type="text" placeholder="A pergunta" maxlength="60">
                                                               <div id='input_1_questao_${game.quantidade_questao + 1}'> ${repeat('&nbsp', 8)}<input id='questao_${game.quantidade_questao + 1}_resposta_2' type="text" placeholder="A resposta certa" maxlength="40"> </div>
                                                                <div id='input_2_questao_${game.quantidade_questao + 1}'> ${repeat('&nbsp', 8)}<input id='questao_${game.quantidade_questao + 1}_resposta_3' type="text" placeholder="Uma das respostas erradas" maxlength="40"> </div>
                                                            </div>
                                                        </div>`
    valor()
    game.quantidade_questao += 1
    game.questoes[game.quantidade_questao] = 3
    game.perguntas.push(["", "", ""])
    save()
}

function repeat(text, times){
    result = ''

    for(i = 0; i < times; i++){
        result += text
    }
    
    return result
}

function remover_questao(){
    if(game.quantidade_questao === 1){
        alert('Minimo de questões alcançado')
    } else {
        document.getElementById(`questao_completa_${game.quantidade_questao}`).remove()
        game.questoes[game.quantidade_questao] = undefined
        game.quantidade_questao -= 1
    }
    save()
}

function adicionar_resposta(questao){
    if(game.questoes[questao] === 9){
        alert('Limite maximo de escolhas alcançado na questão ' + questao)
    } else {
        manipular_perguntas()
        document.getElementById(`questao_${questao}`).innerHTML += `<div id='input_${game.questoes[questao] + 1}_questao_${questao}'> ${repeat('&nbsp', 8)}<input id='questao_${questao}_resposta_${game.questoes[questao] + 1}' type="text" placeholder="Uma das respostas erradas" maxlength="40"> </div>`
        valor()
        game.questoes[questao] += 1
        game.perguntas[questao - 1].push('')
    }
    save()
}

function deletar_resposta(questao){
    if(game.questoes[questao] === 3){
        alert('Minimo de escolhas alcançado na questão ' + questao)
    } else {
        document.getElementById(`input_${game.questoes[questao]}_questao_${questao}`).remove()
        game.questoes[questao] -= 1
    }
    save()
}   

function valor(){
    for(let i = 1; i <= game.quantidade_questao; i++){
        for(let c = 1; c <= game.questoes[i]; c++){
            document.getElementById(`questao_${i}_resposta_${c}`).value = game.perguntas[i - 1][c - 1]
        }
    }
}

function manipular_perguntas(){
    game.perguntas = []
    for(let i = 1; i <= game.quantidade_questao; i++){
        for(let c = 1; c <= game.questoes[i]; c++){
            perguntas_da_questao.push(document.getElementById(`questao_${i}_resposta_${c}`).value)
        }
        game.perguntas.push(perguntas_da_questao)
        perguntas_da_questao = []
    }
}

function criar_jogo(){
    manipular_perguntas()
    save()
    contagem_de_arrays = 0
    pontuacao = 0
    botoes()
}

function botoes(){
    document.getElementById('tela').style.color = game.paleta[5]
    let tela = document.getElementById('tela')
    let tela_largura = tela.clientWidth
    let ordenado =  game.perguntas[contagem_de_arrays].slice(1,)
    let button_width = tela_largura - 170

    if(button_width > tela_largura - 170){
        button_width = tela_largura - 170
    } else if(button_width < 170){
        button_width = 170
    }

    ordenado.sort()
    tela.innerHTML =  `<p id='pergunta'>${game.perguntas[contagem_de_arrays][0]}</p> <div id="botoes_tela"><div>`
    var botoes_tela = document.getElementById('botoes_tela')
    for(let c = 0; c < ordenado.length; c++){
        if(game.perguntas[contagem_de_arrays][1] === ordenado[c]){
            botoes_tela.innerHTML += `<button class='button_tela' style='color: ${game.paleta[5]}; width:${button_width}px; font-family:${game.fonte}; background:${game.paleta[3]};' onclick='resposta("certo")'>${ordenado[c]}</button>`
        } else {
            botoes_tela.innerHTML += `<button class='button_tela' style='color: ${game.paleta[5]}; width:${button_width}px; font-family:${game.fonte}; background:${game.paleta[3]};' onclick='resposta("errado")'>${ordenado[c]}</button>`
        }
    }
    if(!game.imagem){
        document.getElementById('botoes_tela').style.textAlign = 'center'
    } else {
        document.getElementById('botoes_tela').style.paddingLeft = '150px'
    }
    contagem_de_arrays += 1

    let els = document.getElementsByClassName('button_tela')
    for(i in els){
        if(!isNaN(Number.parseInt(i))){
            els[i].addEventListener('mouseover', (e) => {
                e.currentTarget.style.background = game.paleta[4]
            })
            els[i].addEventListener('mouseout', (e) => {
                e.currentTarget.style.background = game.paleta[3]
            })
        }
    }
}

function resposta(classe){
    if(classe === 'certo'){
        tela.innerHTML = `<h1 style='color: ${game.paleta[2]};'>Acertou</h1>`
        pontuacao++
    } else {
        tela.innerHTML = `<h1 style='color: ${game.paleta[1]};'>Errou</h1>`
    }
    setTimeout(() => {
        if(contagem_de_arrays ===  game.perguntas.length){
            tela.innerHTML = `<p>O jogo acabou<br>Sua pontuação: ${pontuacao}/${ game.perguntas.length}</p>`
        } else {
            botoes()
        }
    }, 1500);
}

function mudar_cor(){
    let paleta_name = document.getElementById('select_palette').value
    let paleta = paletas[document.getElementById('select_palette').value]
    game.paleta_name = paleta_name
    game.paleta = paleta
    document.getElementById('tela').style.backgroundColor = paleta[0]
    document.getElementById('tela').style.color = game.paleta[5]
    for(i in document.getElementsByClassName('button_tela')){
        if(!isNaN(Number.parseInt(i))){
            document.getElementsByClassName('button_tela')[i].style.background = paleta[3]
            document.getElementsByClassName('button_tela')[i].style.color = paleta[5]
        }
    }
    save()
}

function mudar_fonte(){
    game.fonte = document.getElementById('select_fonte').value
    document.getElementById('tela').style.fontFamily = game.fonte
    var botoes = document.getElementById('tela').querySelectorAll('button')

    for(botao in botoes){
        if(!isNaN(Number.parseInt(botao))){
            botoes[botao].style.fontFamily = game.fonte
        }
    }
    save()
}

function salvar_jogo(){
    save()
    const email = localStorage.getItem('email')
    const senha = localStorage.getItem('senha')
    const titulo = document.getElementById('titulo').value
    game.titulo = titulo

    if(email == null || senha == null){
        document.location.href = '/login'
    } else {
        if(newGame){
            const data = {
                email: email,
                senha: senha,
                game: game
            }
            
            $.ajax({
                type: "POST",
                url: '/save_game',
                data: data,
                success: (data) => {
                    if(data.length > 26){
                        history.pushState({}, null, '/login')
                        $('body').html(data)
                    } else {
                        localStorage.removeItem('game')
                        let arrGames = localStorage.getItem('games').split(',')
                        arrGames.push(data.slice(6, 26))
                        localStorage.setItem('games', arrGames.toString())

                        let arrTitles = localStorage.getItem('titles').split(',')
                        arrTitles.push(titulo)
                        localStorage.setItem('titles', arrTitles.toString())
                        
                        document.location.href = data
                    }
                }
            })
        } else {    
            manipular_perguntas()

            $.ajax({
                type: "POST",
                url: '/atualizar',
                data: {game: game, link: game.lnk},
                success: (data) => {
                    localStorage.removeItem('temporaly_game')
                    document.location.href = '/game/' + data
                }
            })
        }
    }
}

function convertToObject(object){
    var result = {}
    var key = 1
    for(data in object){
        result[key] = Number.parseInt(object[data])
        key++
    }

    return result
}