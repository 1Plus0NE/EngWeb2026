const axios = require('axios');
const http = require('http');
const util = require('./myUtil.js')   

var serverApp = http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16);
    console.log(req.method + " " + req.url + " " + d);

    switch(req.method){
        case "GET":
            if(req.url == "/"){
                try{
                    // Página Inicial
                    // alunos => pagina de alunos
                    // cursos => pagina de cursos 
                    // instrumentos => pagina de instrumentos
                    const links = [
                        util.link("/alunos", "Lista de Alunos"),
                        util.link("/cursos", "Lista de Cursos"),
                        util.link("/instrumentos", "Lista de Instrumentos")
                    ]
                    const corpo = util.card("Links disponíveis", util.lista(links))          
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end(util.pagina("Escola de Música", corpo));

                }catch(err){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end((`<p> Erro no servidor de dados: ${req.method}</p>`));
                }
            }
            // ===== Página de Alunos
            else if(req.url == "/alunos"){
                try{
                    var alunos = await util.getAlunos()
                    var instrumentos = await util.getInstrumentos()
                    const instMap = {}
                    instrumentos.forEach(i => instMap[i["#text"]] = i.id)

                    var linhas = alunos.map(a => `
                        <p><b> ID: </b> ${a.id} </p>
                        <p><b> Nome: </b> ${a.nome} </p>
                        <p><b> Data de Nascimento: </b> ${a.dataNasc} </p>
                        <p><b> Curso: </b> ${util.link("/cursos/" + a.curso, a.curso)} </p>
                        <p><b> Ano Curso: </b> ${a.anoCurso} </p>
                        <p><b> Instrumento: </b> ${util.link("/instrumentos/" + instMap[a.instrumento], a.instrumento)} </p>
                    `)
                    var corpo = `
                        ${util.card("Informação Geral", util.lista(linhas))}
                        ${util.botaoVoltar()}
                    `
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end(util.pagina("Alunos da Escola de Música", corpo));

                }catch(err){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end((`<p> Erro ao carregar a página de alunos: ${err}</p>`));
                }
            }
            // ===== Página de Cursos =======
            else if(req.url == "/cursos"){
                try{
                    var cursos = await util.getCursos()
                    var linhas = cursos.map(c => `
                        <p><b> ID: </b> ${c.id} </p>
                        <p><b> Designação: </b> ${c.designacao} </p>
                        <p><b> Duração: </b> ${c.duracao} </p>
                        <p><b> Nome do Instrumento: </b> ${util.link("/instrumentos/" + c.instrumento.id, c.instrumento["#text"])} </p>
                    `)
                    var corpo = `
                        ${util.card("Informação Geral", util.lista(linhas))}
                        ${util.botaoVoltar()}
                    `
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end(util.pagina("Cursos da Escola de Música", corpo));

                }catch(err){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end((`<p> Erro ao carregar a página de cursos: ${err}</p>`));
                }
            }
            // ===== Página de Instrumentos =======
            else if(req.url == "/instrumentos"){
                try{
                    var instrumentos = await util.getInstrumentos()
                    var linhas = instrumentos.map(i => `
                        <p><b>ID:</b> ${i.id}</p>
                        <p><b>Nome:</b> ${util.link("/instrumentos/" + i.id, i["#text"])}</p>
                    `)

                    var corpo = `
                        ${util.card("Instrumentos", util.lista(linhas))}
                        ${util.botaoVoltar()}
                    `

                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end(util.pagina("Instrumentos da Escola de Música", corpo))

                } catch(err){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'})
                    res.end(`<p>Erro: ${err}</p>`)
                }
            }
            // ===== Página do Curso =======
            else if(req.url.startsWith('/cursos/')){
                try{
                    const id = req.url.split('/')[2]; 
                    var curso = await util.getCurso(id); 
                    
                    var body = util.card(`Curso: ${curso.id}`, `${curso.designacao}`) + util.botaoVoltar();

                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                    res.end(util.pagina("Curso", body));

                } catch(error){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
                    res.end(`<p>Erro ao carregar Curso: ${error.message}.</p>`);
                }
            }
            // ===== Página do Instrumento =======
            else if(req.url.startsWith('/instrumentos/')){
                try{
                    const idIns = req.url.split('/')[2];
                    var instrumento = await util.getInstrumento(idIns);

                    var body = util.card(`Instrumento: ${instrumento.id}`, instrumento["#text"]) + util.botaoVoltar();

                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
                    res.end(util.pagina("Instrumento", body));

                } catch(error){
                    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'});
                    res.end(`<p>Erro ao carregar Instrumento: ${error.message}.</p>`);
                }
            }
            else{
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8'})
                res.end((`<p> Rota não suportada: ${req.url}</p>`));
            }
        break;
        
        default:
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8'})
            res.end((`<p> Método não suportado: ${req.method}</p>`));

    }

})

serverApp.listen(7777)
console.log("Servidor à escuta na porta 7777...")