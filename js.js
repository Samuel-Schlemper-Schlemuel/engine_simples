var quantidade_fase = 1

function adicionar_fase(){
    quantidade_fase++
    document.getElementById('perguntas').innerHTML += `<p>&nbsp&nbsp&nbsp&nbspFase ${quantidade_fase}: Clique para adicionar uma nova pergunta a essa fase (minimo de 4 e maximo de 8) <button id='nova_pergunta' onclick="adicionar_pergunta(${quantidade_fase})">Nova Pergunta</button></p>
                                                            <div id='fase_${quantidade_fase}'>
                                                                &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta">
                                                                <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta">
                                                                <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta">
                                                                <br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta">
                                                            </div>`
    }

function adicionar_pergunta(fase){
    document.getElementById(`fase_${fase}`).innerHTML += `<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type="text" placeholder="A pergunta">`
}