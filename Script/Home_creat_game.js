var max_perguntas = 120
var max_respostas = 90
var contagem_de_arrays = 0
var pontuacao = 0
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
    perguntas_imagens: {1: [null, null]},
    paleta: paletas['Padrão'],
    paleta_name: 'Padrão',
    fonte: 'Marhey',
    imagens: [''],
    titulo: ''
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
    tempo_game.imagens = []

    for(let c = 1; c <= tempo_game.quantidade_questao; c++){
        if(c >= 2){
            adicionar_questao()
        }
        creatEvent()
        for(let i = 4; i <= tempo_game.questoes[c]; i++){
            document.getElementById(c).getElementsByClassName('ad_res')[0].click()
        }
    }

    document.getElementById('select_palette').value = tempo_game.paleta_name
    document.getElementById('select_fonte').value = tempo_game.fonte
    mudar_fonte()
    document.getElementById('tela').style.backgroundColor = tempo_game.paleta[0]
    document.getElementById('titulo').value = tempo_game.titulo
    game = JSON.parse(JSON.stringify(tempo_game))
    game.imagens = []
    game.perguntas_imagens = {1: [null, null]}

    for(i in game.perguntas){
        game.imagens.push('')
    }

    for(let pergunta in game.perguntas){
        pergunta = Number(pergunta)
        if(pergunta >= 1){
            game.perguntas_imagens[pergunta + 1] = [null, null]
        }

        for(let i in Array.from({length: game.questoes[pergunta + 1]}, () => 1)){
            if(i >= 3){
                game.perguntas_imagens[pergunta + 1].push(null)
            }
        }
    }

    valor()
    save()
}

function save(){
    if(newGame){
        manipular_perguntas()
        let tempo_game = JSON.parse(JSON.stringify(game))
        tempo_game.imagens = ['']
        tempo_game.perguntas_imagens = {1: [null, null]}
        localStorage.setItem('game', JSON.stringify(tempo_game))
    }
}

function adicionar_questao(){
    manipular_perguntas()
    let actual = game.quantidade_questao + 1

    document.getElementById('perguntas').innerHTML += `<label class='pergunta' id='${actual}'>
                                                         <div>
                                                            <p>${repeat('&nbsp', 4)}Questão ${actual}</p>
                                                         </div>
                                                            <div class='questao'>
                                                                ${repeat('&nbsp', 3)}<input class="question" type="text" placeholder="A pergunta" maxlength="${max_perguntas}">
                                                                <br>
                                                                <br>
                                                                <div class="alternativa_correta"> ${repeat('&nbsp', 3)}<input type="text" placeholder="A resposta certa" maxlength="${max_respostas}"> <i class="bi bi-aspect-ratio icons" data-toggle="tooltip" data-html="true" data-placement="right" title="Adicionar imagem em vez de texto"></i><input class="answers" type="file" accept="image/*, video/*" /> </div>
                                                                <div class="alternativa_errada"> ${repeat('&nbsp', 3)}<input type="text" placeholder="Uma das respostas erradas" maxlength="${max_respostas}"> <i class="bi bi-aspect-ratio icons" data-toggle="tooltip" data-html="true" data-placement="right" title="Adicionar imagem em vez de texto"></i><input class="answers" type="file" accept="image/*, video/*" /> </div>
                                                            </div>
                                                            <div>
                                                                <button class="bt-gr ad_res">Nova alternativa</button>
                                                            </div>
                                                            <div class='imagem'>
                                                                <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspOpcional: </p>
                                                                <label class="file" tabindex="0">
                                                                    <input class="input" type="file" accept="image/*, video/*">
                                                                    <span> Escolha uma imagem ou vídeo </span>
                                                                </label>
                                                            </div>
                                                            <br>
                                                        </label>`
    game.imagens.push('')
    valor()
    game.quantidade_questao += 1
    game.questoes[game.quantidade_questao] = 3
    game.perguntas.push(["", "", ""])
    game.perguntas_imagens[game.quantidade_questao] = [null, null]
    save()
    $('[data-toggle="tooltip"]').tooltip()
    document.getElementById(actual).getElementsByClassName('ad_res')[0].addEventListener('click', fn_add_res)
    creatEvent()
}

function repeat(text, times){
    result = ''

    for(i = 0; i < times; i++){
        result += text
    }
    
    return result
}

function remover_questao(){
    if(game.quantidade_questao > 1){
        document.getElementById(`${game.quantidade_questao}`).remove()
        game.questoes[game.quantidade_questao] = undefined
        delete game.perguntas_imagens[game.quantidade_questao]
        game.quantidade_questao -= 1
        game.imagens.pop()
    }
    save()
}

function valor(){
    const perguntas = document.getElementsByClassName('pergunta')

    for(let i = 0; i < game.quantidade_questao; i++){
        let inputs = perguntas[i].getElementsByTagName('input')
        let c = 0

        for(let input of inputs){
            if(input.type == 'text'){
                if(game.perguntas[i][c] != undefined){
                    input.value = game.perguntas[i][c]
                    c++
                }
            }
        }
    }
}

function manipular_perguntas(){
    const perguntas = document.getElementsByClassName('pergunta')
    game.perguntas = []

    for(let el of perguntas){
        const inputs = el.getElementsByTagName('input')
        let temp = []
        
        for(let input of inputs){
            if(input.type == 'text'){
                temp.push(input.value)
            }          
        }
        game.perguntas.push(temp)
    }
}

function apagar_tudo(){
    localStorage.removeItem('game')
    location.reload(true)
}

function escrito(){
    const titulo = document.getElementById('titulo').value
    game.titulo = titulo
    save()
}

async function ImgVideoMaker(src, bW){
    let FinalTag
    const tagWidth = bW - 10
    let tag, event, attributes 

    if(/data:video/.test(src)){
        tag = document.createElement('video')
        event = 'loadedmetadata'
        attributes = ['controls']
    } else {
        tag = document.createElement('img')
        event = 'load'
    }

    tag.src = src

    await new Promise ((resolve) => {
            tag.addEventListener(event, () => {
            for(i in attributes){
                tag.setAttribute(attributes[i], '')
            }

            let tag_width, tag_height

            if(tag.height == 0){
                tag_width  = tag.videoWidth
                tag_height = tag.videoHeight
            } else {
                tag_height = tag.height
                tag_width  = tag.width
            }

            tag.height = tag_height * (tagWidth / tag_width)
            tag.width = tagWidth

            if(tag.height > 200){
                tag.width = tag.width * (200 / tag.height)
                tag.height = 200
            }

            FinalTag = tag
            resolve()
        })
    })

    return FinalTag.outerHTML
}

function criar_jogo(){
    manipular_perguntas()
    save()
    contagem_de_arrays = 0
    pontuacao = 0
    botoes()
}

async function botoes(){
    document.getElementById('tela').style.color = game.paleta[5]
    let tela = document.getElementById('tela')
    let tela_largura = tela.clientWidth
    let ordenado = []

    for(i in game.perguntas[contagem_de_arrays].slice(1,)){
        if(game.perguntas_imagens[contagem_de_arrays + 1][i] != null){
            ordenado.push(game.perguntas_imagens[contagem_de_arrays + 1][i])
        } else {
            ordenado.push(game.perguntas[contagem_de_arrays][Number(i) + 1])
        }
    }

    const ordenadoSort = [...ordenado].sort()
    let button_width = tela_largura*0.9
    const base64 = game.imagens[contagem_de_arrays]

    tela.innerHTML =  `
    <p id='pergunta'>${game.perguntas[contagem_de_arrays][0]}</p> 
    <div id="imagem_tela"></div>
    <div id="botoes_tela"><div>
    `

    if(base64 != ''){
        let img, event, attributes

        if(/data:video/.test(base64)){
            img = document.createElement('video')
            event = 'loadedmetadata'
            attributes = ['autoplay', 'loop', 'controls']
        } else {
            img = document.createElement('img')
            event = 'load'
        }

        img.src = base64

        img.addEventListener(event, () => {
            for(i in attributes){
                img.setAttribute(attributes[i], '')
            }

            let img_width, img_height

            if(img.width == 0){
                img_width = img.videoWidth
                img_height = img.videoHeight
            } else {
                img_width = img.width
                img_height = img.height
            }

            const pro_width = tela_largura/img_width
            const pro_height = tela.clientHeight*0.4/img_height
            let mWW = img_width*pro_width
            let mHW = img_height*pro_width
            let mWH = img_width*pro_height
            let mHH = img_height*pro_height

            if(pro_width < pro_height){
                if(mWW < 150){
                    mHW = mHW + mHW / (mWW / (150 - mWW)) 
                    mWW = 150
                } else if(mHW < 200){
                    mWW = mWW + mWW / (mHW / (200 - mHW)) 
                    mHW = 200
                }

                img.height = mHW
                img.width = mWW
            } else {
                if(mWH < 150){
                    mHH = mHH + mHH / (mWH / (150 - mWH)) 
                    mWH = 150
                } else if(mHH < 200){
                    mWH = mWH + mWH / (mHH / (200 - mHH)) 
                    mHH = 200
                }

                img.height = mHH
                img.width = mWH
            }

            document.getElementById('imagem_tela').appendChild(img)
        })
    }

    var botoes_tela = document.getElementById('botoes_tela')

    for(let c = 0; c < ordenadoSort.length; c++){  
        const resposta =  /data:image\/.*;base64,.+/.test(ordenadoSort[c]) || /data:video\/.*;base64,.+/.test(ordenadoSort[c]) ? await ImgVideoMaker(ordenadoSort[c], button_width) : ordenadoSort[c]

        if(ordenado[0] === ordenadoSort[c]){
            botoes_tela.innerHTML += `<button class='button_tela' style='color: ${game.paleta[5]}; width:${button_width}px; font-family:${game.fonte}; background:${game.paleta[3]};' onclick='resposta("certo")'>${resposta}</button>`
        } else {
            botoes_tela.innerHTML += `<button class='button_tela' style='color: ${game.paleta[5]}; width:${button_width}px; font-family:${game.fonte}; background:${game.paleta[3]};' onclick='resposta("errado")'>${resposta}</button>`
        }

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

document.getElementById('select_palette').addEventListener('change', mudar_cor)

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

document.getElementById('select_fonte').addEventListener('change', mudar_fonte)

function salvar_jogo(){
    let bytes = new TextEncoder().encode(JSON.stringify(game)).length

    if(bytes / 1024 / 1024 > 17){
        alert('Esse jogo tem mais que 17mb')
        return
    }
    
    save()
    const email = localStorage.getItem('email')
    const senha = localStorage.getItem('senha')

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
                        arrTitles.push(game.titulo)
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

function fn_add_res(e){
    const curTarDad = e.currentTarget.parentNode.parentNode

    if(game.questoes[curTarDad.id] < 9) {
        const id = curTarDad.id
        manipular_perguntas()
        
        const add = `
        <div class="alternativa_errada"> 
            ${repeat('&nbsp', 3)}<input type="text" placeholder="Uma das respostas erradas" maxlength="${max_respostas}"> 
            <i class="bi bi-aspect-ratio icons" data-toggle="tooltip" data-html="true" data-placement="right" title="Adicionar imagem em vez de texto"></i>
            <input class="answers" type="file" accept="image/*, video/*" />
            <i class="rd del_res">X</i> 
        </div>
        `

        curTarDad.getElementsByClassName('questao')[0].innerHTML += add
        game.questoes[id] += 1
        game.perguntas[id - 1].push('')
        game.perguntas_imagens[id].push(null)
        $('[data-toggle="tooltip"]').tooltip()
        valor()
        creatEvent()
    }
    save()
}

function fn_del_res(e){
    const curTarGrandFather = e.currentTarget.parentNode.parentNode.parentNode

    if(game.questoes[curTarGrandFather.id] > 3){
        const questao = curTarGrandFather.id
        const curTar = e.currentTarget
        let sum = 2
        const all = curTarGrandFather.getElementsByClassName('del_res')

        for(let el of all){
            if(el === curTar){
                break
            }

            sum++
        }

        game.questoes[questao] -= 1
        game.perguntas_imagens[questao] = game.perguntas_imagens[questao].slice(0, sum).concat(game.perguntas_imagens[questao].slice(sum + 1))
        curTar.parentNode.remove()
    }
    save()
}

function fn_icons(e) {
    const curTar = e.currentTarget
    curTar.parentNode.children[2].click()
}

function fn_answer(e) {
    let sum = 0
    const curTar = e.currentTarget

    if(e.target.files[0].size / 1024 / 1024 > 5){
        alert('Essa imagem/vídeo tem mais que 5mb')
        return
    }

    const all = curTar.parentNode.parentNode.getElementsByClassName('answers')

    for(let el of all){
        if(el === curTar){
            break
        }

        sum++
    }

    if (curTar.files && curTar.files[0]) {
        const reader = new FileReader()
    
        reader.onload = async function(e) {
            const maxHeight = 200
            const maxWidth = 200

            if(/image/.test(curTar.files[0].type)){
                const imageURL = e.target.result
                const img = document.createElement('img')
                img.src = imageURL
                img.alt = 'Imagem'
                
                img.addEventListener('load', (e) => {
                    if(maxWidth/img.width < maxHeight/img.height){
                        img.height = img.height * maxWidth/img.width
                        img.width = maxWidth
                    } else {
                        img.width = img.width * maxHeight/img.height
                        img.height = maxHeight
                    }

                    game.perguntas_imagens[curTar.parentNode.parentNode.parentNode.id][sum] = imageURL
                    $(curTar.parentNode.children[1]).attr("data-original-title", img.outerHTML)
                })
            } else {
                const videoURL = e.target.result
                const video = document.createElement('video')
                video.src = videoURL
                video.alt = 'Vídeo'
                video.setAttribute('controls', '')
                
                video.addEventListener('loadedmetadata', (e) => {
                    if(maxWidth/video.videoWidth < maxHeight/video.videoHeight){
                        video.height = video.videoHeight * maxWidth/video.videoWidth
                        video.width = maxWidth
                    } else {
                        video.width = video.videoWidth * maxHeight/video.videoHeight
                        video.height = maxHeight
                    }

                    game.perguntas_imagens[curTar.parentNode.parentNode.parentNode.id][sum] = videoURL
                    $(curTar.parentNode.children[1]).attr("data-original-title", video.outerHTML)
                })
            }
        }

        $('[data-toggle="tooltip"]').tooltip()
        reader.readAsDataURL(curTar.files[0])
    }
}

function creatEvent(){
    const els = document.getElementsByClassName('input')
    for(i in els){
        if(!isNaN(Number.parseInt(i))){
            els[i].addEventListener('change', (event) => {
                const curTar = event.currentTarget
                const file = event.target.files[0]

                if(file.size / 1024 / 1024 > 10){
                    curTar.parentNode.children[1].innerHTML = 'O limite de tamanho é 10 mb'
                    return
                }

                if(file){
                    const reader = new FileReader()

                    if(/image/.test(file.type)){
                        reader.addEventListener('load', (e) => {
                            const readerTarget = e.target
                            const img = document.createElement('img')
                            img.src = readerTarget.result

                            img.addEventListener('load', (e) => {
                                if(350/img.width < 200/img.height){
                                    img.style.scale = 350/img.width
                                } else {
                                    img.style.scale = 200/img.height
                                }

                                curTar.parentNode.children[1].innerHTML = ''
                                curTar.parentNode.children[1].appendChild(img)
                                const base64String = readerTarget.result
                                game.imagens[parseInt(curTar.parentNode.parentNode.parentNode.id) - 1] = base64String
                            })
                        })
                    } else {
                        reader.addEventListener('load', (e) => {
                            const readerTarget = e.target
                            const video = document.createElement('video')
                            video.src = readerTarget.result
                            video.setAttribute('autoplay', '')
                            video.setAttribute('loop', '')
                            video.setAttribute('controls', '')

                            video.addEventListener( "loadedmetadata", function (e) {
                                const pro_width = 350/video.videoWidth
                                const pro_height = 200/video.videoHeight
    
                                if(pro_width < pro_height){
                                    video.style.scale = pro_width
                                } else {
                                    video.style.scale = pro_height
                                }
    
                                curTar.parentNode.children[1].innerHTML = ''
                                curTar.parentNode.children[1].appendChild(video)
                                const base64String = reader.result
                                game.imagens[parseInt(curTar.parentNode.parentNode.parentNode.id) - 1] = base64String
                            })
                        })
                    }

                    reader.readAsDataURL(file)
                } else {
                    curTar.parentNode.children[1].innerHTML = 'Arquivo inválido'
                }
            })
        }
    }

    const icons = document.getElementsByClassName('icons')
    const answers = document.getElementsByClassName('answers')

    for(i in icons){
        if(!isNaN(Number.parseInt(i))){
            icons[i].removeEventListener('click', fn_icons)
            answers[i].removeEventListener('change', fn_answer)
            
            icons[i].addEventListener('click', fn_icons)
            answers[i].addEventListener('change', fn_answer)
        }
    }

    const ad_res = document.getElementsByClassName('ad_res')

    for(let b of ad_res){
        b.removeEventListener("click", fn_add_res)
        b.addEventListener('click', fn_add_res)
    }

    const del_res = document.getElementsByClassName('del_res')

    for(let b of del_res){
        b.removeEventListener('click', fn_del_res)
        b.addEventListener('click', fn_del_res)
    }
}

manipular_perguntas()
valor()
$('[data-toggle="tooltip"]').tooltip()
creatEvent()