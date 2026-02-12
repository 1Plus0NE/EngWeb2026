const {createServer} = require('http');
const {parse} = require('url');
const axios = require('axios');
const backLink = `<p><a href="/"> Voltar à Página Inicial </a></p>`;

function pageTemplate(title, content) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8"/>
        <title>${title}</title>
        <style>
            body {
                font-family: Arial, Helvetica, sans-serif;
                background-color: #f4f6f8;
                margin: 40px;
            }

            h1 {
                color: #333;
            }

            table {
                border-collapse: collapse;
                width: 100%;
                background-color: white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            th {
                background-color: #2c3e50;
                color: white;
                padding: 10px;
                text-align: left;
            }

            td {
                padding: 8px;
                border-bottom: 1px solid #ddd;
            }

            tr:hover {
                background-color: #f2f2f2;
            }

            a {
                text-decoration: none;
                color: #3498db;
                font-weight: bold;
            }

            a:hover {
                text-decoration: underline;
            }

            .back {
                margin-top: 20px;
                display: inline-block;
            }
        </style>
    </head>
    <body>
        <h1>${title}</h1>
        ${content}
    </body>
    </html>
    `;
}

var myServer = createServer(function (req, res) {
    switch (req.url) {
        case "/":
            const main_page = `
                <ul>
                    <li><a href='/reparacoes'> Listar Reparações </a></li>
                    <li><a href='/intervencoes'> Listar Intervenções </a></li>
                    <li><a href='/veiculos'> Listar Veículos </a></li>
                </ul>
            `;
            res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(pageTemplate("Página Inicial", main_page));
            break;

        case "/reparacoes":
            axios.get('http://localhost:3000/reparacoes?_sort=data&_order=desc')
                .then(resp => {
                    let html = `
                        <table>
                            <tr>
                                <th> Nome do Cliente </th>
                                <th> NIF do Cliente </th>
                                <th> Data da Reparação </th>
                                <th> Marca do Veículo </th>
                                <th> Matrícula do Veículo </th>
                            </tr>
                    `;

                    resp.data.forEach(r => {
                        html += `
                            <tr>
                                <td>${r.nome}</td>
                                <td>${r.id}</td>
                                <td>${r.data}</td>
                                <td>${r.viatura.marca}</td>
                                <td>${r.viatura.id}</td>
                            </tr>
                        `;
                    });

                    html += `</table>${backLink}`;
                    res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(pageTemplate("Lista de Reparações", html));
                })
                .catch(error => {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end("<pre>" + JSON.stringify(error, null, 2) + "</pre>");
                });
            break;

        case "/intervencoes":
            axios.get('http://localhost:3000/intervencoes?_sort=id')
                .then(resp => {
                    let html = `
                        <table>
                            <tr>
                                <th> ID da Intervenção </th>
                                <th> Nome </th>
                                <th> Descrição </th>
                                <th> Número de vezes usada </th>
                            </tr>
                    `;

                    resp.data.forEach(itv => {
                        html += `
                            <tr>
                                <td>${itv.id}</td>
                                <td>${itv.nome}</td>
                                <td>${itv.descricao}</td>
                                <td>${itv.usos}</td>
                            </tr>
                        `;
                    });

                    html += `</table>${backLink}`;

                    res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(pageTemplate("Lista de Intervenções", html));
                })
                .catch(error => {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end("<pre>" + JSON.stringify(error, null, 2) + "</pre>");
                });
            break;

        case "/veiculos":
            axios.get('http://localhost:3000/veiculos?_sort=marca')
                .then(resp => {
                    let html = `
                        <table>
                            <tr>
                                <th> Marca </th>
                                <th> Número de Reparações </th>
                            </tr>
                    `;

                    resp.data.forEach(v => {
                        html += `
                            <tr>
                                <td>${v.marca}</td>
                                <td>${v.reparacoes}</td>
                            </tr>
                        `;
                    });

                    html += `</table>${backLink}`;

                    res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(pageTemplate("Lista de Veículos", html));
                })
                .catch(error => {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end("<pre>" + JSON.stringify(error, null, 2) + "</pre>");
                });
            break;

        default:
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(pageTemplate("Erro 404", "<p>Pedido não suportado.</p>" + backLink));
            break;
    }
});

myServer.listen(7777);
console.log("Servidor à escuta na porta 7777...");