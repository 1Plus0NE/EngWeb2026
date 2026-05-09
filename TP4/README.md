# TPC4: Exames Médicos Desportivos

# Data

- 25/02/2026

# Autor

- **Nome**: Luís Filipe Araújo Ferreira
- **Número**: A98286
- **Fotografia**:

![Fotografia](../Fotografia.jpg)

# Resumo

## Objetivo

Neste trabalho de casa foi proposto a construção de um Servidor Aplicacional que consome dados disponibilizados por uma API REST (simulada com `json-server`) para apresentar páginas HTML sobre exames médicos desportivos, fazendo pedidos GET, POST, PUT e DELETE, assim sendo, esta aplicação deve cumprir os seguintes requisitos:

- GET / ou GET /emd - responde com uma página principal onde consta uma tabela com os EMD; a tabela apresenta os campos: nome do atleta, data, modalidade, resultado;  
- GET /emd/:id - responde com uma página composta por um card com toda a informação do EMD;
- GET /emd/registo - responde com o formulário para recolha dos dados do novo EMD; 
- GET /emd/editar/:id - responde com o formulário para edição dos dados do registo - selecionado; 
- GET /emd/apagar/:id - apaga o registo selecionado e redireciona para a página principal; 
- GET /emd/stats - responde com uma página com as distribuições dos registos por: sexo, modalidade, clube, resultado, federado; 
- POST /emd - insere o registo na base de dados e redireciona para a página principal; 
- POST /emd/:id - altera o registo na base de dados e redireciona para a página principal.

## Resolução

Em primeiro lugar foi desenvolvido um script em python para normalizar os dados do json disponibilizado pelo professor de modo que esteja pronto para ser servido para o json-server. Nesta parte, foi alterado o campo `_id` para `id` e foi removido o campo `nome` que era constituido por uma lista para um novo campo `nome` que resulta da contatenação do primeiro e último nome.

No desenvolvimento do servidor aplicacional (`emd_server.js`) tirou-se partido de um esqueleto de uma aula anterior que permitiu acelerar o desenvolvimento do mesmo para os exames médicos desportivos. Foi adicionado na página principal `/` dois botões que permitem a ordenação dos dados tendo em conta a data de forma crescente e um tendo em conta o nome de forma decrescente.

No restante desenvolvimento foram adicionadas outros ficheiros `.pug` que tem como propósito gerar uma página de um exame médico desportivo específico (`emd.pug`) e um outro para direcionar à página que consta das distribuições dos registos (`stats.pug`).

# Testes

Antes de servir o dataset ao json-server, devemos correr o script em python:

```bash
python3 handle_json.py
```

Antes de iniciar o servidor aplicacional, é necessário instalar a biblioteca **axios**, responsável pelas requisições HTTP à API de dados.

```bash
npm install axios
```

Inicialização da API de Dados (json-server) num terminal, através do seguinte comando:

```bash
json-server --watch new_emd.json
```

Iniciar o servidor aplicacional:

```bash
node emd_server.js
```

Para testar os pedidos, basta abrir um navegador web e inserir o URL:

```text
http://localhost:7777
```

# Resultados 

## Ficheiros resultantes deste trabalho

- Ficheiros disponibilizados pelo professor e alterados por mim quando necessário:
- - A pasta public e views com os ficheiros que podem ser acedidos diretamente pelo navegador (ícones e ficheiros de estilo) e outros
- - O dataset dos exames médicos desportivos: emd.json
- - O programa em JavaScript que lida com ficheiros públicos: static.js
- - O programa em JavaScript que gera páginas web: templates.js
- - O programa em JavaScript que inicializa o servidor: emd_server.js
- O dataset normalizado: new_emd.json: new_emd.json
- O programa em Python que normalizou o JSON: handle_json.py
- Os ficheiros  resultantes de instalar a biblioteca axios:
- - O ficheiro package-lock.json
- - O ficheiro package.json