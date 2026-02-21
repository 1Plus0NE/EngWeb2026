# TPC3: Servidor Aplicacional — Escola de Música

# Data

- 21/02/2026

# Autor

- **Nome**: Luís Filipe Araújo Ferreira
- **Número**: A98286
- **Fotografia**:

![Fotografia](../Fotografia.jpg)

# Resumo

## Objetivo

Neste trabalho de casa foi proposto a construção de um Servidor Aplicacional que consome dados disponibilizados por uma API REST (simulada com `json-server`) para apresentar páginas HTML sobre uma escola de música.

O sistema expõe duas camadas principais:
- `apiServer.js`: serviço intermédio que consulta o `json-server` (porta 3000) e fornece endpoints na porta 25000.
- `serverApp.js`: servidor aplicacional que gera páginas HTML (porta 7777) e consome o `apiServer` para obter dados.

## Resolução

Ficheiros desenvolvidos:
- `serverApp.js`: Servidor aplicacional que implementa as rotas:
  - `/` — página inicial com links para as listagens
  - `/alunos` — lista de alunos 
  - `/cursos` — lista de cursos
  - `/instrumentos` — lista de instrumentos
  - `/cursos/:id` — página de um curso
  - `/instrumentos/:id` — página de um instrumento

- `apiServer.js`: Servidor que responde com JSON consumindo o `json-server` (porta 3000). Endpoints disponibilizados:
  - `/alunos`, `/cursos`, `/instrumentos` e `/cursos/:id`, `/instrumentos/:id` (porta 25000).

- `myUtil.js`: utilitários partilhados — funções para construir páginas HTML, links e funções que fazem as chamadas HTTP ao `apiServer` (ex.: `getAlunos()`, `getInstrumentos()`, `getInstrumento(id)`, `getCurso(id)`).

# Testes

Antes de iniciar o servidor aplicacional, é necessário instalar a biblioteca **axios**, responsável pelas requisições HTTP à API de dados.

```bash
npm install axios
```

Inicialização da API de Dados (json-server) num terminal, através do seguinte comando:

```bash
json-server --watch db.json
```

Iniciar o servidor API intermédio:

```bash
node apiServer.js
```

Iniciar o servidor aplicacional:

```bash
node serverApp.js
```

Para testar os pedidos, basta abrir um navegador web e inserir o URL:

```text
http://localhost:7777
```

# Rotas importantes

- `http://localhost:7777/` — página inicial
- `http://localhost:7777/alunos` — listagem de alunos (links para `cursos` e `instrumentos` por id)
- `http://localhost:7777/cursos` — listagem de cursos
- `http://localhost:7777/instrumentos` — listagem de instrumentos

O `apiServer.js` responde com formato JSON em `http://localhost:25000/` para consumo interno pelo `serverApp.js`.

# Resultados 

## Ficheiros resultantes deste trabalho

- `serverApp.js` — servidor aplicacional (porta 7777)
- `apiServer.js` — servidor API  (porta 25000)
- `myUtil.js` — utilitários e wrappers HTTP