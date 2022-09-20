var fases = {1: 3}
var quantidade_fase = 1
var perguntas = []
var perguntas_da_fase = []
var contagem_de_arrays = 0
var pontuacao = 0
var imagem = false
var cor_acerto = 'green'
var cor_erro = 'red'

function adicionar_fase(){
    manipular_perguntas()
    document.getElementById('perguntas').innerHTML += `<div id='fase_completa_${quantidade_fase + 1}'>
                                                         <p>${repeat('&nbsp', 4)}Fase ${quantidade_fase + 1}: Clique para adicionar uma nova pergunta a essa fase (minimo de 2 e maximo de 8)
                                                            <button id='nova_pergunta' onclick="adicionar_pergunta(${quantidade_fase + 1})">Nova Pergunta</button> 
                                                            <button id='deletar_pergunta' onclick="deletar_pergunta(${quantidade_fase + 1})">Deletar última pergunta</button></p>
                                                            <div id='fase_${quantidade_fase + 1}'>
                                                            ${repeat('&nbsp', 8)}<input id='fase_${quantidade_fase + 1}_pergunta_1' type="text" placeholder="A pergunta">
                                                               <div id='input_1_fase_${quantidade_fase + 1}'> ${repeat('&nbsp', 8)}<input id='fase_${quantidade_fase + 1}_pergunta_2' type="text" placeholder="A resposta certa"> </div>
                                                                <div id='input_2_fase_${quantidade_fase + 1}'> ${repeat('&nbsp', 8)}<input id='fase_${quantidade_fase + 1}_pergunta_3' type="text" placeholder="Uma das respostas erradas"> </div>
                                                            </div>
                                                        </div>`
    valor()
    quantidade_fase += 1
    fases[quantidade_fase] = 3
}

function repeat(text, times){
    result = ''

    for(i = 0; i < times; i++){
        result += text
    }
    
    return result
}

function remover_fase(){
    if(quantidade_fase === 1){
        alert('Minimo de fases alcançado')
    } else {
    document.getElementById(`fase_completa_${quantidade_fase}`).remove()
    quantidade_fase -= 1
    }
}

function adicionar_pergunta(fase){
    if(fases[fase] === 9){
        alert('Limite maximo de escolhas alcançado na fase ' + fase)
    } else {
        manipular_perguntas()
        document.getElementById(`fase_${fase}`).innerHTML += `<div id='input_${fases[fase] + 1}_fase_${fase}'> ${repeat('&nbsp', 8)}<input id='fase_${fase}_pergunta_${fases[fase] + 1}' type="text" placeholder="Uma das respostas erradas"> </div>`
        valor()
        fases[fase] += 1
    }
}

function deletar_pergunta(fase){
    if(fases[fase] === 3){
        alert('Minimo de escolhas alcançado na fase ' + fase)
    } else {
        document.getElementById(`input_${fases[fase]}_fase_${fase}`).remove()
        fases[fase] -= 1
    }
}   

function valor(){
    for(let i = 1; i <= quantidade_fase; i++){
        for(let c = 1; c <= fases[i]; c++){
            document.getElementById(`fase_${i}_pergunta_${c}`).value = perguntas[i - 1][c - 1]
        }
    }
}

function manipular_perguntas(){
    perguntas = []
    for(let i = 1; i <= quantidade_fase; i++){
        for(let c = 1; c <= fases[i]; c++){
            perguntas_da_fase.push(document.getElementById(`fase_${i}_pergunta_${c}`).value)
        }
        perguntas.push(perguntas_da_fase)
        perguntas_da_fase = []
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