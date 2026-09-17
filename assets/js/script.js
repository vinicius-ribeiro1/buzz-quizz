const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'
const CONTAINER_TELA_2 = document.querySelector(".tela2");
const TIME_2S = 2 * 1000;

let respostasCertas = [];
let respostasDoQuizz = [];
let quizzEscolhido = [];
let perguntas = [];
let divPai;
let qtdPerguntas = 0;
let acertos = 0;





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
    let htmlPerguntas = '';

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

    CONTAINER_TELA_2.innerHTML = htmlPerguntas;

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
    let porcentagemDeAcertos = Math.floor((acertos / qtdPerguntas) * 100)
    console.log(acertos)
    console.log(porcentagemDeAcertos)
   
    let levelAtingido = [];

    for (let i = 0; i < quizzEscolhido.levels.length; i++) {

        if (porcentagemDeAcertos >= quizzEscolhido.levels[i].minValue) {
            levelAtingido = quizzEscolhido.levels[i]
            return;
        }
        
    }
    
    console.log(levelAtingido)
}
    
    


