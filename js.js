var fases = {1: 2}
var quantidade_fase = 1

function adicionar_fase(){
    quantidade_fase++
    fases[quantidade_fase] = 2
    document.getElementById('perguntas').innerHTML += `<div id='fase_completa_${quantidade_fase}'>
                                                         <p>&nbsp&nbsp&nbsp&nbspFase ${quantidade_fase}: Clique para adicionar uma nova pergunta a essa fase (minimo de 2 e maximo de 8)
                                                            <button id='nova_pergunta' onclick="adicionar_pergunta(${quantidade_fase})">Nova Pergunta</button> 
                                                            <button id='deletar_pergunta' onclick="deletar_pergunta(${quantidade_fase})">Deletar última pergunta</button></p>
                                                            <div id='fase_${quantidade_fase}'>
                                                               <div id='input_1_fase_${quantidade_fase}'> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta"> </div>
                                                                <div id='input_2_fase_${quantidade_fase}'> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta"> </div>
                                                            </div>
                                                        </div>      `
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
        fases[fase] += 1
        document.getElementById(`fase_${fase}`).innerHTML += `<div id='input_${fases[fase]}_fase_${fase}'> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta"> </div>`
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
    