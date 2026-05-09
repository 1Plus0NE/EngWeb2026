var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')
var static = require('./static.js')   

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var emdsServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /emd ------------------------------------------------------------------
                if(req.url == '/' || req.url == '/emd'){
                    axios.get("http://localhost:3000/emd?_sort=dataEMD")
                    .then(resp => {
                        var emd = resp.data 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(emd, d))
                    })
                }
                // Sorting by data
                else if(req.url == '/emd/sortDataDesc'){
                    axios.get("http://localhost:3000/emd?_sort=dataEMD&_order=desc")
                    .then(resp => {
                        var emd = resp.data 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(emd, d))
                    })
                }
                // Sorting by name
                else if(req.url == '/emd/sortNameAsc'){
                    axios.get("http://localhost:3000/emd?_sort=nome&_order=asc")
                    .then(resp => {
                        var emd = resp.data 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(emd, d))
                    })
                }
                // GET /emd/register ---------------------------------------------------------
                else if(req.url === '/emd/register'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.emdFormPage(d))
                }
                // GET /emd/stats ------------------------------------------------------------
                else if(req.url === '/emd/stats'){
                    axios.get('http://localhost:3000/emd')
                    .then(resp => {
                        const emd = resp.data;

                        const emdStats = {
                            sexo: {F: 0, M: 0},
                            modalidade: {},
                            clube: {},
                            resultado: {yes: 0, no: 0}, 
                            federado: {yes: 0, no: 0},
                        };
                        // Stats calculation
                        for (const e of emd){
                            if (e.género === "F" || e.género === "f") emdStats.sexo.F++;
                            else if (e.género === "M" || e.género === "m") emdStats.sexo.M++;

                            const mod = e.modalidade || "Unknown"; // in case of empty strings
                            if (!emdStats.modalidade[mod]) emdStats.modalidade[mod] = 1;
                            else emdStats.modalidade[mod]++;

                            const club = e.clube || "Unknown"; // in case of empty strings
                            if (!emdStats.clube[club]) emdStats.clube[club] = 1;
                            else emdStats.clube[club]++;

                            e.resultado ? emdStats.resultado.yes++ : emdStats.resultado.no++;

                            e.federado ? emdStats.federado.yes++ : emdStats.federado.no++;
                        }
                    
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        res.end(templates.emdStatsPage(emdStats, d));
                    })
                    .catch(erro => {
                        res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                        res.write('<p>Não foi possível obter os registos para estatísticas</p>');
                        res.write('<p>' + erro + '</p>');
                        res.end('<address><a href="/">Voltar</a></address>');
                    })
                }
                // GET /emd/:id --------------------------------------------------------------
                else if(/^\/emd\/[a-zA-Z0-9_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[2];
                    axios.get(`http://localhost:3000/emd/${idEmd}`)
                    .then(resp => {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdPage(resp.data, d));
                    })
                }
                // GET /emd/edit/:id ---------------------------------------------------------
                else if(/\/emd\/edit\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[3]
                    axios.get('http://localhost:3000/emd/' + idEmd)
                    .then(resp => {
                        var emd = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdFormEditPage(emd, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível obter o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }
                // GET /emd/delete/:id -------------------------------------------------------
                else if(/\/emd\/delete\/[0-9a-zA-Z_]+$/.test(req.url)){
                    var idEmd = req.url.split('/')[3]
                    axios.delete('http://localhost:3000/emd/' + idEmd)
                    .then(resp => {
                        res.writeHead(302, {'Location': '/'}) // Redireciona para a lista
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível apagar o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }
                // GET ? -> Lancar um erro
                break
            case "POST":
                // POST /emd --------------------------------------------------------------------
                if(req.url == '/emd'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/emd', result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Registo inserido com sucesso: ' + JSON.stringify(resp.data) + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Não foi possível insrir o registo...</p>')
                                res.write('<p>' + erro + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                        }
                        else{
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body...</p>')
                            res.end('<address><a href="/">Voltar</a></address>')
                        }
                    })
                }
                // POST /emd/:id - Alterar um registo
                else if(/\/emd\/[0-9a-zA-Z_]+$/.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.put('http://localhost:3000/emd/' + result.id, result)
                            .then(resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Registo alterado com sucesso: ' + JSON.stringify(resp.data) + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                            .catch(erro => {
                                res.writeHead(503, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Não foi possível alterar o registo...</p>')
                                res.write('<p>' + erro + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                        }
                        else{
                            res.writeHead(502, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body...</p>')
                            res.end('<address><a href="/">Voltar</a></address>')
                        }
                    })
                }
                // POST ? -> Lancar um erro
                
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

emdsServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})