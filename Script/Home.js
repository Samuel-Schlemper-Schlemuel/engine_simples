var socket = io()
var questoes = {1: 3}
var quantidade_questao = 1
var perguntas = []
var perguntas_da_questao = []
var contagem_de_arrays = 0
var pontuacao = 0
var imagem = false
var cor_acerto = 'green'
var cor_erro = 'red'

function adicionar_questao(){
    manipular_perguntas()
    document.getElementById('perguntas').innerHTML += `<div id='questao_completa_${quantidade_questao + 1}'>
                                                         <p>${repeat('&nbsp', 4)}Questão ${quantidade_questao + 1}: Clique para adicionar uma nova resposta a essa questão (minimo de 2 e maximo de 8)
                                                            <button id='nova_resposta' onclick="adicionar_resposta(${quantidade_questao + 1})">Nova Resposta</button> 
                                                            <button id='deletar_resposta' onclick="deletar_resposta(${quantidade_questao + 1})">Deletar última resposta</button></p>
                                                            <div id='questao_${quantidade_questao + 1}'>
                                                            ${repeat('&nbsp', 8)}<input id='questao_${quantidade_questao + 1}_resposta_1' type="text" placeholder="A resposta">
                                                               <div id='input_1_questao_${quantidade_questao + 1}'> ${repeat('&nbsp', 8)}<input id='questao_${quantidade_questao + 1}_resposta_2' type="text" placeholder="A resposta certa"> </div>
                                                                <div id='input_2_questao_${quantidade_questao + 1}'> ${repeat('&nbsp', 8)}<input id='questao_${quantidade_questao + 1}_resposta_3' type="text" placeholder="Uma das respostas erradas"> </div>
                                                            </div>
                                                        </div>`
    valor()
    quantidade_questao += 1
    questoes[quantidade_questao] = 3
}

function repeat(text, times){
    result = ''

    for(i = 0; i < times; i++){
        result += text
    }
    
    return result
}

function remover_questao(){
    if(quantidade_questao === 1){
        alert('Minimo de questões alcançado')
    } else {
    document.getElementById(`questao_completa_${quantidade_questao}`).remove()
    quantidade_questao -= 1
    }
}

function adicionar_resposta(questao){
    if(questoes[questao] === 9){
        alert('Limite maximo de escolhas alcançado na questão ' + questao)
    } else {
        manipular_perguntas()
        document.getElementById(`questao_${questao}`).innerHTML += `<div id='input_${questoes[questao] + 1}_questao_${questao}'> ${repeat('&nbsp', 8)}<input id='questao_${questao}_resposta_${questoes[questao] + 1}' type="text" placeholder="Uma das respostas erradas"> </div>`
        valor()
        questoes[questao] += 1
    }
}

function deletar_resposta(questao){
    if(questoes[questao] === 3){
        alert('Minimo de escolhas alcançado na questão ' + questao)
    } else {
        document.getElementById(`input_${questoes[questao]}_questao_${questao}`).remove()
        questoes[questao] -= 1
    }
}   

function valor(){
    for(let i = 1; i <= quantidade_questao; i++){
        for(let c = 1; c <= questoes[i]; c++){
            document.getElementById(`questao_${i}_resposta_${c}`).value = perguntas[i - 1][c - 1]
        }
    }
}

function manipular_perguntas(){
    perguntas = []
    for(let i = 1; i <= quantidade_questao; i++){
        for(let c = 1; c <= questoes[i]; c++){
            perguntas_da_questao.push(document.getElementById(`questao_${i}_resposta_${c}`).value)
        }
        perguntas.push(perguntas_da_questao)
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
    let ordenado = perguntas[contagem_de_arrays].slice(1,)
    ordenado.sort()
    tela.innerHTML = perguntas[contagem_de_arrays][0] + '<br> <div id="botoes_tela"><div>'
    var botoes_tela = document.getElementById('botoes_tela')
    for(let c = 0; c < ordenado.length; c++){
        if(perguntas[contagem_de_arrays][1] === ordenado[c]){
            botoes_tela.innerHTML += `<button style='width:175px;' onclick='resposta("certo")'>${ordenado[c]}</button>`
        } else {
            botoes_tela.innerHTML += `<button style='width:175px;' onclick='resposta("errado")'>${ordenado[c]}</button>`
        }
    }
    if(!imagem){
        document.getElementById('botoes_tela').style.textAlign = 'center'
    } else {
        document.getElementById('botoes_tela').style.paddingLeft = '150px'
    }
    contagem_de_arrays += 1
}

function resposta(classe){
    tela.style.textAlign = 'center'
    if(classe === 'certo'){
        tela.innerHTML = `<h1 style='color: ${cor_acerto};'>Acertou</h1>`
        pontuacao++
    } else {
        tela.innerHTML = `<h1 style='color: ${cor_erro};'>Errou</h1>`
    }
    setTimeout(() => {
        if(contagem_de_arrays === perguntas.length){
            tela.innerHTML = `<p>O jogo acabou<br>Sua pontuação: ${pontuacao}/${perguntas.length}</p>`
        } else {
            tela.style.textAlign = 'left'
            botoes()
        }
    }, 1500);
}

function mudar_cor_fundo(){
    let cor = document.getElementById('seletor_cores_fundo').value
    document.getElementById('tela').style.backgroundColor = cor
}

function mudar_cor_acerto(){
    let cor = document.getElementById('seletor_cores_acerto').value
    cor_acerto = cor
}

function mudar_cor_erro(){
    let cor = document.getElementById('seletor_cores_erro').value
    cor_erro = cor
}

function mudar_fonte(){
    let fonte = document.getElementById('select_fonte').value
    document.getElementById('tela').style.fontFamily = fonte
    var botoes = document.getElementById('tela').querySelectorAll('button')

    for(botao in botoes){
        if(!isNaN(Number.parseInt(botao))){
            botoes[botao].style.fontFamily = fonte
        }
    }
}