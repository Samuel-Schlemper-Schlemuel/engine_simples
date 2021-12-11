var fases = {1: 2}
var quantidade_fase = 1
var perguntas = []
var perguntas_da_fase = []

function adicionar_fase(){
    manipular_perguntas()
    document.getElementById('perguntas').innerHTML += `<div id='fase_completa_${quantidade_fase + 1}'>
                                                         <p>&nbsp&nbsp&nbsp&nbspFase ${quantidade_fase + 1}: Clique para adicionar uma nova pergunta a essa fase (minimo de 2 e maximo de 8)
                                                            <button id='nova_pergunta' onclick="adicionar_pergunta(${quantidade_fase + 1})">Nova Pergunta</button> 
                                                            <button id='deletar_pergunta' onclick="deletar_pergunta(${quantidade_fase + 1})">Deletar última pergunta</button></p>
                                                            <div id='fase_${quantidade_fase + 1}'>
                                                               <div id='input_1_fase_${quantidade_fase + 1}'> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input id='fase_${quantidade_fase + 1}_pergunta_1' type="text" placeholder="A pergunta (que também é a respossta certa)"> </div>
                                                                <div id='input_2_fase_${quantidade_fase + 1}'> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input id='fase_${quantidade_fase + 1}_pergunta_2' type="text" placeholder="A pergunta"> </div>
                                                            </div>
                                                        </div>      `
    valor()
    quantidade_fase++
    fases[quantidade_fase] = 2
    }

function remover_fase(){
    if(quantidade_fase === 1){
        alert('Minimo de fases alcançado')
    } else {
    document.getElementById(`fase_completa_${quantidade_fase}`).remove()
    quantidade_fase--
    }
}

function adicionar_pergunta(fase){
    if(fases[fase] === 8){
        alert('Limite maximo de escolhas alcançado na fase ' + fase)
    } else {
        manipular_perguntas()
        document.getElementById(`fase_${fase}`).innerHTML += `<div id='input_${fases[fase] + 1}_fase_${fase}'> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input id='fase_${fase}_pergunta_${fases[fase] + 1}' type="text" placeholder="A pergunta"> </div>`
        valor()
        fases[fase] += 1
    }
}

function deletar_pergunta(fase){
    if(fases[fase] === 2){
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

function manipular_perguntas(organizar = false){
    perguntas = []
    for(let i = 1; i <= quantidade_fase; i++){
        for(let c = 1; c <= fases[i]; c++){
            perguntas_da_fase.push(document.getElementById(`fase_${i}_pergunta_${c}`).value)
        }
        if (organizar){
            perguntas_da_fase.sort()
        }
        perguntas.push(perguntas_da_fase)
        perguntas_da_fase = []
    }
}

function criar_jogo(){
    manipular_perguntas(true)
}