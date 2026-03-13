const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

// URL da API (usa variáveis de ambiente para Docker)
const API_URL = process.env.API_URL || "http://localhost:7789/cinema";

// --- Página Default ---
app.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  res.render('index', {date: d})
});

// --- Página de listagem de filmes ---
app.get('/filmes', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/filmes`)
        .then(response => {
            res.render('filmes', {
                filmes: response.data,
                date: d
            });
        })
        .catch(err => {
            res.render('error', {
                error: err,
                message: "Erro ao obter filmes"
            });
        });
});

// --- Página de um filme específico ---
app.get('/filmes/:id', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/filmes/${req.params.id}`)
        .then(response => {
            res.render('filme', {
                filme: response.data,
                date: d
            });
        })
        .catch(err => {
            res.render('error', {
                error: err,
                message: "Filme não encontrado"
            });
        });
});

// --- Página de listagem de atores ---
app.get('/atores', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/atores`)
        .then(response => {
            res.render('atores', {
                atores: response.data,
                date: d
            });
        })
        .catch(err => {
            res.render('error', {
                error: err,
                message: "Erro ao obter atores"
            });
        });
});

// --- Página de um ator específico ---
app.get('/atores/:id', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/atores/${req.params.id}`)
        .then(response => {
            res.render('ator', {
                ator: response.data,
                date: d
            });
        })
        .catch(err => {
            res.render('error', {
                error: err,
                message: "Ator não encontrado"
            });
        });
});

// --- Página de listagem de géneros ---
app.get('/generos', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/generos`)
        .then(response => {
            res.render('generos', {
                generos: response.data,
                date: d
            });
        })
        .catch(err => {
            res.render('error', {
                error: err,
                message: "Erro ao obter géneros"
            });
        });
});

// Porta do servidor de interface
const PORT = 7790;
app.listen(PORT, () => {
    console.log(`Servidor de Interface em http://localhost:${PORT}`);
});