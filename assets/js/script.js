const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'

carregarQuizzes();

function carregarQuizzes() {
    const promise = axios.get(API + '/quizzes')
    promise.then(renderizarQuizzes)
}

function renderizarQuizzes(response) {
    console.log(response.data)
    const listaTodosQuizzes = document.querySelector(".todosOsQuizzes");
    listaTodosQuizzes.innerHTML = "";

    for(let i = 0; i < response.data.length; i++) {
        const quizzes = response.data[i];

        listaTodosQuizzes.innerHTML += `
        <div class="quizz">
            <img src="${quizzes.image}">
            <span class="titulo-card">
                ${quizzes.title}
            </span>
         </div>
        `
    }
}