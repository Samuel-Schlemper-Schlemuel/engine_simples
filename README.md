# Engine Simples
Site hospedado no vercel: [Engine Simples](https://engine-simples.vercel.app).

Este projeto foi criado quando minha mãe disse que precisava de um programa que fizesse isso gratuitamente, o objetivo dele é fazer ser uma engine simples de jogos onde se pode criar um jogo de botões onde o usuário escolhe uma opção das dadas pelo criador e vê se foi a resposta certa ou não, o criador do jogo também pode adicionar uma imagem ou animação simples no jogo, o resultado final pode ser baixado ou adicionado a outro site.

Ele será criado com HTML, CSS e JavaScript.

Como nunca criei um projeto desse tipo antes, ele irá demorar muito tempo para ficar pronto, eu possivelmente farei outros projetos nesse meio tempo com assuntos que estarei estudando para fazer esse, talvez até desista desse daqui no meio do caminho.

## Atualização 1
Já adicionei um modo de criar fases novas e perguntas novas.

## Atualização 2
Adicionei um modo que limita a quantidade maxima de caixas de texto e um botão que apaga a ultima caixa, deixei como minimo duas caixas em vez de quatro como na versão anterior.
Adicionei um botão que remove a última fase, deixando um minimo de uma fase.

## Atualização 3
Adicionei um botão de criar fase, mudei algumas coisas no CSS e criei a função criar jogo.

## Atualização 4
Mudei o nome da função criar_jogo() para function manipular_perguntas() e agora quando se cria uma fase ou pergunta nova as que já estavam escritas não se apagam.

## Atualização 5
Havia um problema de lógica no HTML que fazia com que toda vez que eu adicionasse uma pergunta, ela fosse para baixo do botão 'criar jogo!', mas agora o problema foi resolvido.
Finalmente posso dizer que meu site cria um jogo, por mais que ele é bem mal feito e só pode ser usado localmente enquanto o site estiver aberto.

## Atualização 6
Percebi que havia um erro no jogo que quando a pessoa escreve as possiveis respostas não a como escrever a pergunta, então adicionei essa opção.
Agora da para ver quantos acertos houve e os botões se tornaram responsiveis e estão todos de tamanho igual agora.
Agora em vez de dar um alert toda ves que acerta ou erra, o código bota uma tag h1 por 2 segundos dizendo se ouve um acerto ou erro.

## Atualização 7
Agora o resultado (acertou/errou) e o final estão centralizados
Começarei uma das partes mais complexas do projeto, que é o fato de que eu começarei a usar funções das quais não tenho nenhum conhecimento ainda, que é algo que não aconteceu até o momento atual, o primeiro objetivo será criar algo que deixe fácil para o usuário mudar a cor de fundo.

## Atualização 8
Descobri a existencia de um input que tem como valor type="color", ultilizarei isso para criar um seletor de cores para meu usuário.
Input pronto e mudando a cor, agora o trabalho é botar o site no ar.

## Atualização 9
Agora os botões são centralizados caso não haja imagem.

## Atualização 10
Depois de muito tempo estou retornando a esse projeto. A atualização dessa vez é pequena só organizei um pouco o código e adicionei a 
possibilidade de mudar a cor das palavras acerto e erro.

## Atualização 11
Adicionei a opção de mudar a fonte do jogo criei uma borda para a tela.

## Atualização 12
Criei um servidor em node.js para o site.

## Atualização 13
Agora há meta tags no html e um cabeçalho com um botão e o meu nome no topo da pagina.

## Atualização 14
Agora o site tem um sistema para enviar um email para o usuário.

## Atualização 15
Agora a parte de verificação de e-mail e criação de conta está completa.

## Atualização 16
Sistema de login criado.

## Atualização 17
Atualizei o código, por mais que as mudanças foram pequenas uma delas quebrava o código anterior, por isso estarei atualizando o pakage.json para a verção 2.0.0, e fiz com que o servidor interagice direto com o cliente.

## Atualização 18
Dessa vez fiz varias alterações, mas o principal foi que modifiquei os arquivos HTML para EJS.

## Atualização 19
Agora a conta é salva localmente, de forma com que o login é feito de forma automatica.

## Atualização 20
Agora o jogo pode ser salvo, e um link é gerado altomaticamente que levara para o jogo.

## Atualização 21
Agora existe uma opção de deslogar e a pagina principal do site é resposiva.

## Atualização 22
Houve uma atualização no desing de algumas partes do site.

## Atualização 23
Agora o site salva localmente os dados do jogo, para que eles não sejam perdidos quando a aba fechar ou ser recarregada, mas são apagados ao criar o jogo.

## Atualização 24
Agora é possivel clicar em um botão e ver todos os jogos que foram criados.

## Atualização 25
Agora a um botão de apagar ao lado do jogo criado, representado por uma licheira criada pelo bootstrap.

## Atualização 26
Agora há um botão de atualizar.

## Atualização 27
Desing melhorado.

## Atualização 28
Agora a verção estavel e ultilizavel do site está terminada, já que existe um link que é possivel copiar para adicionar o jogo ao site do usuario, as unicas coisas que faltam são adicionar a opção de adiconar imagens e vídeos ao jogo e melhorar o desing do jogo.