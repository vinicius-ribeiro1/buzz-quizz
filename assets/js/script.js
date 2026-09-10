const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'
const CONTAINER_TELA_2 = document.querySelector(".tela2");


let quizzEscolhido = [];
let acertos = 0;
let jogadas = 0;
let perguntas = [];
let respostas = [];

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

        htmlPerguntas += `
            </div>
        `;
    }

    CONTAINER_TELA_2.innerHTML = htmlPerguntas;
    
}


function verificarRespostaCerta(respostaEscolhida) {
    let respEscolhida = respostaEscolhida;
    let divPai = respEscolhida.parentNode;
    let listaRespostas = divPai.querySelectorAll(".container-resposta")

    const listaFiltrada = listaRespostas.forEach(elemento => {
        if(elemento !== respostaEscolhida) {
            elemento.classList.add("esbranquicado");
        }
    });

    
   
    let respostaCerta = quizzEscolhido.questions[jogadas].answers[jogadas]
    
    
   /*const respostaCorreta = respostaCerta
        .find(resposta => resposta.isCorrectAnswer === true).text

        if (cartaEscolhida === respostaCorreta) {
            acertos++;
        }
    */    
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



