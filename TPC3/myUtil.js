const axios = require('axios')

// --- Funções utilitárias
// ----- para o servidor aplicacional da Escola de Música
        
function pagina(titulo, corpo){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>${titulo}</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
    </head>
    <body class="w3-light-grey">

        <div class="w3-container w3-teal">
            <h1>${titulo}</h1>
        </div>

        <div class="w3-container w3-margin-top">
            ${corpo}
        </div>

    </body>
    </html>
    `
}

function link(href, texto){
    return `<a href="${href}">${texto}</a>`
}

function card(titulo, conteudo){
    return `
    <div class="w3-card-4 w3-white w3-margin-bottom">
        <header class="w3-container w3-teal">
            <h3>${titulo}</h3>
        </header>
        <div class="w3-container w3-padding">
            ${conteudo}
        </div>
    </div>
    `
}

function lista(items){
    if(items.length === 0)
        return `<p><i>Sem registos.</i></p>`

    // O join vai colar os li's todos em linha
    return `
      <ul class="w3-ul w3-hoverable">
        ${items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    `
}

function botaoVoltar(){
    return `<a class="w3-button w3-teal w3-margin-top" href="/">Voltar</a>`
}

async function getAlunos(){
    const resp = await axios.get("http://localhost:25000/alunos")
    return resp.data
}

async function getCursos(){
    const resp = await axios.get("http://localhost:25000/cursos")
    return resp.data
}

async function getInstrumentos(){
    const resp = await axios.get("http://localhost:25000/instrumentos")
    return resp.data
}

async function getCurso(id){
    const resp = await axios.get("http://localhost:25000/cursos/" + id)
    return resp.data
}

async function getInstrumento(id){
    const resp = await axios.get("http://localhost:25000/instrumentos/" + id)
    return resp.data
}

// ---------- EXPORTS ----------
module.exports = {
    pagina,
    link,
    card,
    lista,
    botaoVoltar,
    getAlunos,
    getCursos,
    getInstrumentos,
    getCurso,
    getInstrumento
}