const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'
const CONTAINER_TELA_2 = document.querySelector(".tela2");

let quizzEscolhido = [];
let perguntaAtual = 0;



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
    perguntaAtual = 0;

    ocultarTela1();
    
    mostrarTela2();
    
    const promise = axios.get(API + '/quizzes/' + id);
    
    promise.then(renderizarQuizzEscolhido);
}


function renderizarQuizzEscolhido(response) {
    quizzEscolhido = response.data;
    const respostas = quizzEscolhido.questions[perguntaAtual].answers;
    console.log(response)
    
    

    CONTAINER_TELA_2.innerHTML += `
     <div class="quizz-escolhido">
            <img src="${quizzEscolhido.image}">
            <span class="titulo-card-escolhido">
                ${quizzEscolhido.title}
            </span>
        </div>
        
        <div class="container-perguntas">

            <span class="titulo">${quizzEscolhido.questions[perguntaAtual].title}</span>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[perguntaAtual].answers[0].image}">
                <span>${quizzEscolhido.questions[perguntaAtual].answers[0].text}</span>
            </div>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[perguntaAtual].answers[1].image}">
                <span>${quizzEscolhido.questions[perguntaAtual].answers[1].text}</span>
            </div>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[perguntaAtual].answers[2].image}">
                <span>${quizzEscolhido.questions[perguntaAtual].answers[2].text}</span>
            </div>

            <div class="container-resposta" onclick="escolherResposta(this)">
                <img src="${quizzEscolhido.questions[perguntaAtual].answers[3].image}">
                <span>${quizzEscolhido.questions[perguntaAtual].answers[3].text}</span>
            </div>

        </div>
    `
}

function proximaPergunta() {
    perguntaAtual++;
    renderizarQuizzEscolhido();
}

function escolherResposta(resposta) {
    perguntaAtual++;
    resposta.classList.add("esbranquicado");
    console.log(resposta)
}


function ocultarTela1() {
    const OCULTAR = document.querySelector(".conteudo-principal");
    OCULTAR.classList.add("esconde");
}

function mostrarTela2() {
    const EXIBIR = document.querySelector(".tela2");
    EXIBIR.classList.remove("esconde");
}


