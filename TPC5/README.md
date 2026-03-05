# TPC4: Cinema Filmes

# Data

- 25/02/2026

# Autor

- **Nome**: Luís Filipe Araújo Ferreira
- **Número**: A98286
- **Fotografia**:

![Fotografia](../Fotografia.jpg)

# Resumo

## Objetivo

Neste trabalho de casa foi proposto a construção de um Servidor Aplicacional via Express que consome dados disponibilizados por uma API REST (simulada com `json-server`) para apresentar páginas HTML sobre filmes que foram estreados no cinema, para tal, esta aplicação deve cumprir os seguintes requisitos:

- GET / - responde com uma página principal que dispõem 3 butões para direcionar à listagem de filmes, atores ou géneros
- GET /filmes - responde com a listagem dos filmes, com o título, ano, número de atores que estrearam no filme e o número de géneros associados
- GET /filmes/:id - responde com uma página que representa a informação completa de um filme
- GET /atores - responde com a listagem dos atores/atrizes, com o seu nome e o número de filmes que participaram
- GET /atores/:id - responde com uma página que representa a informação completa de um/a ator/atriz
- GET /generos - responde com a listagem dos géneros cinematográficos, com o seu género e o número de filmes associados.
- GET /generos/:id - responde com uma página que representa a informação completa de um género cinematográfico


## Resolução

Em primeiro lugar foi desenvolvido um script em python para normalizar os dados do json disponibilizado pelo professor de modo que esteja pronto para ser servido para o json-server. Nesta parte, foi adicionado o campo `id` à coleção de filmes, em seguida foram criadas duas coleções de modo a facilitar o desenvolvimento do servidor aplicacional para as rotas pedidas, foi criada a coleção de atores que inclui o id, o nome do/a autor/atriz e a lista de filmes que ele/a participou, e foi criada a coleção de géneros que inclui o id, o nome do género e a lista de filmes associados a esse género.

Em seguida foi desenvolvido o servidor aplicacional em Express

# Testes

Antes de servir o dataset ao json-server, devemos correr o script em python:

```bash
python3 handle_json.py
```

Inicialização da API de Dados (json-server) num terminal, através do seguinte comando:

```bash
json-server --watch new_cinema.json
```

Devemos criar o projeto Express com Pug, através do seguinte comando:

```bash
npx express-generator --view=pug cinemaApp
```

Antes de iniciar o servidor aplicacional, é necessário instalar as dependências na diretoria `cinemaApp`.

```bash
npm install 
```

Iniciar o servidor aplicacional:

```bash
npm start
```

Para testar os pedidos, basta abrir um navegador web e inserir o URL:

```text
http://localhost:3007
```

# Resultados 

Ficheiros resultantes deste trabalho

- Templates feitos em Pug para criar as páginas: `views/`
- Servidor aplicacional: `index.js`
- O programa em Python que converteu o dataset para um formato mais adequado: `handle_json.py`
- O dataset modificado: `new_cinema.json`