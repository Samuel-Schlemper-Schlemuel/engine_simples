var game

function start_game(gameObjectString){
    game = JSON.parse(gameObjectString)

    if(!game.hasOwnProperty('perguntas_imagens')){
        game.perguntas_imagens = {0: [null, null]}
    
        for(let pergunta in game.perguntas){
            pergunta = Number(pergunta)
            if(pergunta >= 1){
                game.perguntas_imagens[pergunta] = [null, null]
            }
    
            for(let i in Array.from({length: game.questoes[pergunta]}, () => 1)){
                if(i >= 3){
                    game.perguntas_imagens[pergunta].push(null)
                }
            }
        }
    }

    criar_jogo()
}

var pontuacao = 0
var contagem_de_arrays = 0
var tela = document.getElementById('tela')
        
function criar_jogo(){
    contagem_de_arrays = 0
    document.body.style.backgroundColor = game.paleta[0]
    tela.style.fontFamily = game.fonte
    tela.style.color = game.paleta[5]
    pontuacao = 0
    botoes()
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

async function botoes(){
    let tela = document.getElementById('tela')
    let tela_largura = tela.clientWidth
    let ordenado = []

    for(i in game.perguntas[contagem_de_arrays].slice(1,)){
        let src = game.perguntas_imagens[contagem_de_arrays][i]
        if(src != null && src != ''){
            ordenado.push(src)
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
    var botoes = document.getElementById('tela').querySelectorAll('button')

    for(botao in botoes){
        if(!isNaN(Number.parseInt(botao))){
            botoes[botao].style.fontFamily = game.fonte
        }
    }

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
            tela.innerHTML = `<p>O jogo acabou<br>Sua pontuação: ${pontuacao}/${ game.perguntas.length}</p>
            <br>
            <button id="Jogar_novamente" onclick="criar_jogo()" style="background: ${game.paleta[3]}; color: ${game.paleta[5]};">Jogar de novo</button>`

            let el = document.getElementById('Jogar_novamente')
            el.addEventListener('mouseover', (e) => {
                e.currentTarget.style.background = game.paleta[4]
            })
            el.addEventListener('mouseout', (e) => {
                e.currentTarget.style.background = game.paleta[3]
            })
        } else {
            botoes()
        }
    }, 1500);
}