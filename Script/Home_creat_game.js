var game = {
    questoes: {1: 3},
    quantidade_questao: 1,
    perguntas: [],
    cor_acerto: 'green',
    cor_erro: 'red',
    cor_fundo: '#7a7ae6',
    fonte: 'Marhey',
    imagem: false
}
var contagem_de_arrays = 0
var pontuacao = 0
var perguntas_da_questao = []

function adicionar_questao(){
    manipular_perguntas()
    document.getElementById('perguntas').innerHTML += `<div id='questao_completa_${game.quantidade_questao + 1}'>
                                                         <p>${repeat('&nbsp', 4)}Questão ${game.quantidade_questao + 1}: Clique para adicionar uma nova resposta a essa questão (minimo de 2 e maximo de 8)
                                                            <button id='nova_resposta' onclick="adicionar_resposta(${game.quantidade_questao + 1})">Nova Resposta</button> 
                                                            <button id='deletar_resposta' onclick="deletar_resposta(${game.quantidade_questao + 1})">Deletar última resposta</button></p>
                                                            <div id='questao_${game.quantidade_questao + 1}'>
                                                            ${repeat('&nbsp', 8)}<input id='questao_${game.quantidade_questao + 1}_resposta_1' type="text" placeholder="A resposta">
                                                               <div id='input_1_questao_${game.quantidade_questao + 1}'> ${repeat('&nbsp', 8)}<input id='questao_${game.quantidade_questao + 1}_resposta_2' type="text" placeholder="A resposta certa"> </div>
                                                                <div id='input_2_questao_${game.quantidade_questao + 1}'> ${repeat('&nbsp', 8)}<input id='questao_${game.quantidade_questao + 1}_resposta_3' type="text" placeholder="Uma das respostas erradas"> </div>
                                                            </div>
                                                        </div>`
    valor()
    game.quantidade_questao += 1
    game.questoes[game.quantidade_questao] = 3
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
    game.quantidade_questao -= 1
    }
}

function adicionar_resposta(questao){
    if(game.questoes[questao] === 9){
        alert('Limite maximo de escolhas alcançado na questão ' + questao)
    } else {
        manipular_perguntas()
        document.getElementById(`questao_${questao}`).innerHTML += `<div id='input_${game.questoes[questao] + 1}_questao_${questao}'> ${repeat('&nbsp', 8)}<input id='questao_${questao}_resposta_${game.questoes[questao] + 1}' type="text" placeholder="Uma das respostas erradas"> </div>`
        valor()
        game.questoes[questao] += 1
    }
}

function deletar_resposta(questao){
    if(game.questoes[questao] === 3){
        alert('Minimo de escolhas alcançado na questão ' + questao)
    } else {
        document.getElementById(`input_${game.questoes[questao]}_questao_${questao}`).remove()
        game.questoes[questao] -= 1
    }
}   

function valor(){
    for(let i = 1; i <= game.quantidade_questao; i++){
        for(let c = 1; c <= game.questoes[i]; c++){
            document.getElementById(`questao_${i}_resposta_${c}`).value =  game.perguntas[i - 1][c - 1]
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
    var tela = document.getElementById('tela')
    contagem_de_arrays = 0
    tela.style.textAlign = 'left'
    pontuacao = 0
    botoes()
}

function botoes(){
    let ordenado =  game.perguntas[contagem_de_arrays].slice(1,)
    ordenado.sort()
    tela.innerHTML =  game.perguntas[contagem_de_arrays][0] + '<br> <div id="botoes_tela"><div>'
    var botoes_tela = document.getElementById('botoes_tela')
    for(let c = 0; c < ordenado.length; c++){
        if(game.perguntas[contagem_de_arrays][1] === ordenado[c]){
            botoes_tela.innerHTML += `<button style='width:175px; font-family:${game.fonte};' onclick='resposta("certo")'>${ordenado[c]}</button>`
        } else {
            botoes_tela.innerHTML += `<button style='width:175px; font-family:${game.fonte};' onclick='resposta("errado")'>${ordenado[c]}</button>`
        }
    }
    if(!game.imagem){
        document.getElementById('botoes_tela').style.textAlign = 'center'
    } else {
        document.getElementById('botoes_tela').style.paddingLeft = '150px'
    }
    contagem_de_arrays += 1
}

function resposta(classe){
    tela.style.textAlign = 'center'
    if(classe === 'certo'){
        tela.innerHTML = `<h1 style='color: ${game.cor_acerto};'>Acertou</h1>`
        pontuacao++
    } else {
        tela.innerHTML = `<h1 style='color: ${game.cor_erro};'>Errou</h1>`
    }
    setTimeout(() => {
        if(contagem_de_arrays ===  game.perguntas.length){
            tela.innerHTML = `<p>O jogo acabou<br>Sua pontuação: ${pontuacao}/${ game.perguntas.length}</p>`
        } else {
            tela.style.textAlign = 'left'
            botoes()
        }
    }, 1500);
}

function mudar_cor_fundo(){
    let cor = document.getElementById('seletor_cores_fundo').value
    document.getElementById('tela').style.backgroundColor = cor
    game.cor_fundo = cor
}

function mudar_cor_acerto(){
    let cor = document.getElementById('seletor_cores_acerto').value
    game.cor_acerto = cor
}

function mudar_cor_erro(){
    let cor = document.getElementById('seletor_cores_erro').value
    game.cor_erro = cor
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
}

function salvar_jogo(){
   const email = localStorage.getItem('email')
   const senha = localStorage.getItem('senha')

   if(email == null || senha == null){
        history.pushState({}, null, '/login')
        document.location.reload()
   } else {
        criar_jogo()

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
                    history.pushState({}, null, data)
                    document.location.reload()
                }
            }
        })
   }
}