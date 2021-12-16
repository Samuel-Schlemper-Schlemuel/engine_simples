# Engine Simples

Este projeto foi criado quando minha mãe disse que precisava de um 
programa que fizesse isso gratuitamente, o objetivo dele é fazer ser
uma engine simples de jogos onde se pode criar um jogo de botões onde
o usuário escolhe uma opção das dadas pelo criador e vê se foi a resposta certa
ou não, o criador do jogo também pode adicionar uma imagem ou animação
simples no jogo, o resultado final pode ser baixado ou adicionado a outro
site.

Ele será criado com HTML, CSS e JavaScript.

Como nunca criei um projeto desse tipo antes, ele irá demorar muito tempo
para ficar pronto, eu possivelmente farei outros projetos nesse meio tempo
com assuntos que estarei estudando para fazer esse, talvez até desista desse daqui
no meio do caminho.

## Dia 1
Já adicionei um modo de criar fases novas e perguntas novas.

## Dia 2
Adicionei um modo que limita a quantidade maxima de caixas de texto e um botão que apaga
a ultima caixa, deixei como minimo duas caixas em vez de quatro como na versão anterior.<br>
Adicionei um botão que remove a última fase, deixando um minimo de uma fase.

## Dia 3
Não consegui criar muita coisa hoje, apenas adicionei um botão de criar fase, mudei algumas
coisas no CSS e criar a função criar jogo.

## Dia 4
Mudei o nome da função criar_jogo() para function manipular_perguntas() e agora quando se
cria uma fase ou pergunta nova as que já estavam escritas não se apagam.

## Dia 5
Havia um problema de lógica no HTML que fazia com que toda vez que eu adicionasse uma 
pergunta, ela fosse para baixo do botão 'criar jogo!', mas agora o problema foi resolvido.<br>
Finalmente posso dizer que meu site cria um jogo, por mais que ele é bem mal feito e só pode
ser usado localmente enquanto o site estiver aberto.

## Dia 6
Percebi que havia um erro no jogo que quando a pessoa escreve as possiveis respostas não a 
como escrever a pergunta, então adicionei essa opção.<br>
Agora da para ver quantos acertos ouve e os botões se tornaram responsiveis e estão todos de tamanho
igual agora.<br>
Agora em vez de dar um alert toda ves que acerta ou erra, o código bota uma tag h1 por 2 segundos
dizendo se ouve um acerto ou erro.

## Dia 7
Agora o resultado (acertou/errou) e o final estão centralizados<br>
Amanhã começa uma das partes mais complexas do projeto, que é o fato de que eu começarei a usar funções 
das quais não tenho nenhum conhecimento ainda, que é algo que não aconteceu até o momento atual, o primeiro 
objetivo será criar algo que deixe fácil para o usuário mudar a cor de fundo.