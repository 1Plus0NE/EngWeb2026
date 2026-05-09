const axios = require('axios');
const http = require('http');
const util = require('./myUtil.js')   

var apiServer = http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16);
    console.log(req.method + " " + req.url + " " + d);

    switch(req.method){
        case "GET":
            if(req.url == "/alunos"){
                try{
                    const resp = await axios.get('http://localhost:3000/alunos?_sort=nome&_order=asc');
                    const students = resp.data;

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(students));
                }catch(error){
                    res.writeHead(502, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        erro: "Erro ao contactar o servidor de dados.",
                        detalhe: error.message
                    }))
                }
            }
            else if(req.url == "/cursos"){
                try{
                    const resp = await axios.get('http://localhost:3000/cursos?_sort=id&_order=asc');
                    const courses = resp.data;

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(courses));

                }catch(error){
                    res.writeHead(502, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        erro: "Erro ao contactar o servidor de dados.",
                        detalhe: error.message
                    }))
                }
            }
            else if(req.url == "/instrumentos"){
                try{
                    const resp = await axios.get('http://localhost:3000/instrumentos?_sort=id&_order=asc');
                    const instruments = resp.data;

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(instruments));

                }catch(error){
                    res.writeHead(502, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        erro: "Erro ao contactar o servidor de dados.",
                        detalhe: error.message
                    }))
                }
            }
            else if(req.url.startsWith('/cursos/')){
                const id = req.url.split('/')[2];
                try{
                    const resp = await axios.get('http://localhost:3000/cursos/' + id);
                    if(resp.data){
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(resp.data));
                    }else{
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({ error: "Curso não encontrado." }));
                    }
                }catch(error){
                    res.writeHead(502, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        erro: "Erro ao contactar o servidor de dados.",
                        detalhe: error.message
                    }))
                }
            }
            else if(req.url.startsWith('/instrumentos/')){
                const id = req.url.split('/')[2];
                try{
                    const resp = await axios.get('http://localhost:3000/instrumentos/' + id);
                    
                    if(resp.data){
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(resp.data));
                    }else{
                        res.writeHead(404, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({ error: "Instrumento não encontrado." }));
                    }
                }catch(error){
                    res.writeHead(502, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        erro: "Erro ao contactar o servidor de dados.",
                        detalhe: error.message
                    }))
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

apiServer.listen(25000)
console.log("Servidor à escuta na porta 25000...")