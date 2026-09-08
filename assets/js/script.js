const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz'


function carregarQuizzes() {
    const promise = axios.get(`${API} + /quizzes`)
}