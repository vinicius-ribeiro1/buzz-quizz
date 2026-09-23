const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'
const CONTAINER_TELA_2 = document.querySelector(".tela2");
const CONTAINER_TELA_3 = document.querySelector(".tela3")
const TIME_2S = 2 * 1000;

let respostasCertas = [];
let respostasDoQuizz = [];
let quizzEscolhido = [];
let perguntas = [];
let levelAtingido = [];
let divPai;
let htmlPerguntas = '';
let htmlResultado = '';
let qtdPerguntas = 0;
let acertos = 0;
let porcentagemDeAcertos = 0;

let tituloMeuQuizz;
let imgMeuQuizz;
let qtdPerguntasMeuQuizz;
let niveisMeuQuizz;



iniciar();


function iniciar() {
    const promise = axios.get(API + '/quizzes')
    promise.then(renderizarQuizzes)
}


function renderizarQuizzes(response) {
    const listaDeQuizzes = document.querySelector(".todosOsQuizzes");
    listaDeQuizzes.innerHTML = "";

    for (let i = 0; i < response.data.length; i++) {
        const quizzes = response.data[i];

        listaDeQuizzes.innerHTML += `
        <div class="quizz" onclick="escolherQuizz(${quizzes.id})">
            <img src="${quizzes.image}">
            <span class="titulo-card">
                ${quizzes.title}
            </span>
         </div>
        `
    }
}


function escolherQuizz(id) {

    ocultarTela1();
    ocultarTela3();
    mostrarTela2();

    const promise = axios.get(API + '/quizzes/' + id);

    promise.then(renderizarQuizzEscolhido);
}


function renderizarQuizzEscolhido(response) {

    quizzEscolhido = response.data;
    perguntas = quizzEscolhido.questions;
    qtdPerguntas = perguntas.length;


    for (let i = 0; i < perguntas.length; i++) {
        for (let j = 0; j < perguntas[i].answers.length; j++) {

            if (perguntas[i].answers[j].isCorrectAnswer) {
                respostasCertas.push(perguntas[i].answers[j].text);
            }

        }
    }

    embaralharRespostas();


    CONTAINER_TELA_2.innerHTML = `
        <div class="quizz-escolhido">
            <img src="${quizzEscolhido.image}">
            <span class="titulo-card-escolhido">
                ${quizzEscolhido.title}
            </span>
        </div>
        
    `
    htmlPerguntas = '';

    for (let i = 0; i < perguntas.length; i++) {

        htmlPerguntas += `
            <div class="container-perguntas">

                <span class="titulo" style="background:${perguntas[i].color}">
                    ${perguntas[i].title}
                </span>
        `;

        for (let j = 0; j < perguntas[i].answers.length; j++) {

            htmlPerguntas += `
                <div class="container-resposta" onclick="verificarRespostaCerta(this)">
                    <img src="${perguntas[i].answers[j].image}">
                    <span class="legenda">${perguntas[i].answers[j].text}</span>
                </div>

            `;
        }

        htmlPerguntas += `</div>
    
        `;
    }

    CONTAINER_TELA_2.innerHTML += htmlPerguntas;

}


function verificarRespostaCerta(respostaEscolhida) {

    if (respostaEscolhida.classList.contains("esbranquicado")) {
        return;
    }

    divPai = respostaEscolhida.parentNode;
    let listaRespostas = divPai.querySelectorAll(".container-resposta");
    let listaLegendas = divPai.querySelectorAll("span.legenda")
    let cartaEscolhidaTxt = respostaEscolhida.querySelector("span").innerText;


    const listaFiltrada = listaRespostas.forEach(elemento => {
        if (elemento !== respostaEscolhida) {
            elemento.classList.add("esbranquicado");
        }
    });

    listaLegendas.forEach(elemento => {
        if (respostasCertas.includes(elemento.textContent)) {
            elemento.classList.add("acerto")
        } else {
            elemento.classList.add("erro")
        }
    })

    for (let i = 0; i < respostasCertas.length; i++) {
        if (cartaEscolhidaTxt === respostasCertas[i]) {
            acertos++;
        }
    }

    setTimeout(rolarParaProxima, TIME_2S);
}

function rolarParaProxima() {
    const proximaPergunta = divPai.nextElementSibling;
    if (proximaPergunta !== null) {
        proximaPergunta.scrollIntoView();
    } else {
        conferirResultado();
    }

}

function ocultarTela1() {
    const OCULTAR = document.querySelector(".conteudo-principal");
    OCULTAR.classList.add("esconde");
}


function mostrarTela2() {
    const EXIBIR = document.querySelector(".tela2");
    EXIBIR.classList.remove("esconde");
}


function comparador() {
    return Math.random() - 0.5;
}

function embaralharRespostas() {
    for (let i = 0; i < perguntas.length; i++) {
        perguntas[i].answers.sort(comparador)
    }
}

function conferirResultado() {
    porcentagemDeAcertos = Math.floor((acertos / qtdPerguntas) * 100)

    for (let i = 0; i < quizzEscolhido.levels.length; i++) {

        if (porcentagemDeAcertos >= quizzEscolhido.levels[i].minValue) {
            levelAtingido = quizzEscolhido.levels[i]
            break;
        }

    }

    renderizarResultado();

}


function renderizarResultado() {

    htmlResultado = '';

    htmlResultado = `
    <div class="resultado">
        <span class="titulo" style="background: #B22222">${porcentagemDeAcertos}% de acerto: ${levelAtingido.title}</span>
        <div class="centro">
            <img src="${levelAtingido.image}">
            <span class="legenda">${levelAtingido.text}</span>
        </div>
    </div>
    <div class="botao">
        <div class="botoes" onclick="reiniciarQuizz()">Reiniciar Quizz</div>
        <div class="botoes" onclick="voltarParaHome()">Voltar pra home</div>
    </div>
    `

    CONTAINER_TELA_2.innerHTML += htmlResultado;

    const containerResultado = document.querySelector(".resultado");

    setTimeout(() => {
        containerResultado.scrollIntoView();
    }, TIME_2S);

}

function reiniciarQuizz() {
    acertos = 0;
    porcentagemDeAcertos = 0;
    levelAtingido = [];
    perguntas = [];

    const containerRespostas = document.querySelectorAll(".container-resposta");

    containerRespostas.forEach(card => {
        card.classList.remove("esbranquicado");
    });


    const resetarLegenda = document.querySelectorAll("span.legenda");

    resetarLegenda.forEach(legenda => {
        legenda.classList.remove("acerto");
        legenda.classList.remove("erro");
    })


    const topo = document.querySelector(".quizz-escolhido");
    topo.scrollIntoView();

    CONTAINER_TELA_2.innerHTML = '';
    htmlResultado = '';

    CONTAINER_TELA_2.innerHTML = `
        <div class="quizz-escolhido">
            <img src="${quizzEscolhido.image}">
            <span class="titulo-card-escolhido">
                ${quizzEscolhido.title}
            </span>
        </div>
        
    `
    for (let i = 0; i < perguntas.length; i++) {

        htmlPerguntas += `
            <div class="container-perguntas">

                <span class="titulo" style="background:${perguntas[i].color}">
                    ${perguntas[i].title}
                </span>
        `;

        for (let j = 0; j < perguntas[i].answers.length; j++) {

            htmlPerguntas += `
                <div class="container-resposta" onclick="verificarRespostaCerta(this)">
                    <img src="${perguntas[i].answers[j].image}">
                    <span class="legenda">${perguntas[i].answers[j].text}</span>
                </div>

            `;
        }

        htmlPerguntas += `</div>
    
        `;
    }

    CONTAINER_TELA_2.innerHTML += htmlPerguntas;
}


function voltarParaHome() {
    respostasCertas = [];
    respostasDoQuizz = [];
    quizzEscolhido = [];
    perguntas = [];
    levelAtingido = [];
    divPai;
    htmlResultado = '';
    qtdPerguntas = 0;
    acertos = 0;
    porcentagemDeAcertos = 0;

    CONTAINER_TELA_2.innerHTML = '';

    const exibirTela1 = document.querySelector(".conteudo-principal");
    exibirTela1.classList.remove("esconde");

    const ocultarTela2 = document.querySelector(".tela2");
    ocultarTela2.classList.add("esconde");
   
    const ocultarTela3 = document.querySelector(".tela3");
    ocultarTela3.classList.add("esconde");

    const header = document.querySelector("header")
    header.scrollIntoView();
}


function mostrarTela3() {
    const exibeT3 = document.querySelector(".tela3");
    exibeT3.classList.remove("esconde");
}


function ocultarTela3() {
    const EXIBIR = document.querySelector(".tela3");
    EXIBIR.classList.add("esconde");
}


function criarQuizz() {
    ocultarTela1();
    mostrarTela3();

    CONTAINER_TELA_3.innerHTML = `
        <h1 class="titulo-tela3">Comece pelo começo</h1>

        <div class="containerInput"> 
            <input placeholder="Título do seu quizz..." class="input-titulo">
            <input placeholder="URL da imagem do seu quizz..." class="input-img">
            <input type="number" placeholder="Quantidade de perguntas do seu quizz...
            " class="input-qtdPerguntas">
            <input type="number" placeholder="Quantidade de níveis do seu quizz..." class="input-niveis">
        </div>

        <div class="botoes" onclick="salvarInfoBasicasQuizz()">Prosseguir para criar perguntas</div>
    `
}

function salvarInfoBasicasQuizz() {
    tituloMeuQuizz = document.querySelector(".input-titulo").value;
    imgMeuQuizz = document.querySelector(".input-img").value;
    qtdPerguntasMeuQuizz = parseInt(document.querySelector(".input-qtdPerguntas").value);
    niveisMeuQuizz = parseInt(document.querySelector(".input-niveis").value);

    validarInfoBasicasQuizz();

    if (!validarInfoBasicasQuizz()) {
        alert('Preencha os dados corretamente');
    } else {
        criarPerguntas();
    }
}

function validarInfoBasicasQuizz() {

    if (tituloMeuQuizz.length < 20 || tituloMeuQuizz.length > 65) {
        return false;
    }

    try {
        const url = new URL(imgMeuQuizz);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return false;
        }
    } catch {
        return false;
    }

    if (qtdPerguntasMeuQuizz < 3) {
        return false;
    }

    if (niveisMeuQuizz < 2) {
        return false;
    }

    return true;
}

function criarPerguntas(indice) {
    CONTAINER_TELA_3.innerHTML = `
        <h1 class="titulo-tela3">Crie suas perguntas</h1>
        `
    let minhasPerguntas = '';

    for (let i = 0; i < qtdPerguntasMeuQuizz; i++) {
        
        indice = i;

        minhasPerguntas += `
        <div class="containerDeCriarPerguntas">
            <h1 class="titulo-perguntas">Pergunta ${indice + 1}</h1>
            <div class="containerInputPerguntas"> 
                <input placeholder="Texto da pergunta" class="input-txtPergunta">
                <input placeholder="Cor de fundo da pergunta" class="">
            </div>
            <h1 class="titulo-perguntas">Resposta correta</h1>
            <div class="containerInputPerguntas"> 
                <input placeholder="Resposta correta" class="">
                <input placeholder="URL da imagem" class="">
            </div>
            <h1 class="titulo-perguntas">Resposta incorretas</h1>
            <div class="containerInputPerguntas"> 
                <input placeholder="Resposta incorreta 1" class="">
                <input placeholder="URL da imagem 1" class="">
            </div>
            <div class="containerInputPerguntas"> 
                <input placeholder="Resposta incorreta 2" class="">
                <input placeholder="URL da imagem 2" class="">
            </div>
            <div class="containerInputPerguntas"> 
                <input placeholder="Resposta incorreta 3" class="">
                <input placeholder="URL da imagem 3" class="">
            </div>
        </div>
       `
    }
    CONTAINER_TELA_3.innerHTML += minhasPerguntas;

    
    
    
    
    validarPerguntas();
}


function validarPerguntas() {

}

