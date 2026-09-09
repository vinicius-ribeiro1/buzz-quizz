const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'

let quizzEscolhido = [];
let qtdPerguntas = [];

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
    qtdPerguntas = response.data.questions.answers;
    console.log(quizzEscolhido)
    const containerTela2 = document.querySelector(".tela2");
    containerTela2.innerHTML = "";

    containerTela2.innerHTML = `
     <div class="quizz-escolhido">
            <img src="${quizzEscolhido.image}">
            <span class="titulo-card-escolhido">
                ${quizzEscolhido.title}
            </span>
        </div>
        
        <div class="container-perguntas">

            <span class="titulo">${quizzEscolhido.questions[0].title}</span>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[0].answers[0].image}">
                <span>${quizzEscolhido.questions[0].answers[0].text}</span>
            </div>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[0].answers[1].image}">
                <span>${quizzEscolhido.questions[0].answers[1].text}</span>
            </div>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[0].answers[2].image}">
                <span>${quizzEscolhido.questions[0].answers[2].text}</span>
            </div>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[0].answers[3].image}">
                <span>${quizzEscolhido.questions[0].answers[3].text}</span>
            </div>

        </div>
    `
}



function ocultarTela1() {
    const ocultar = document.querySelector(".conteudo-principal");
    ocultar.classList.add("esconde");
}

function mostrarTela2() {
    const exibir = document.querySelector(".tela2");
    exibir.classList.remove("esconde");
}

function escolherResposta(resposta) {
    console.log(resposta)
    const respostaClicada = document.querySelector(".container-respostas");
    resposta.classList.add("esbranquicado")
}

