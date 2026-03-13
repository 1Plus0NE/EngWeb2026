# TPC4: Cinema Filmes - Orquestração de Serviços com Docker
# Data

- 11/03/2026

# Autor

- **Nome**: Luís Filipe Araújo Ferreira
- **Número**: A98286
- **Fotografia**:

![Fotografia](../Fotografia.jpg)

# Resumo

## Objetivo

O seguinte trabalho de casa consiste na construção de uma aplicação web sobre fimes cinematográficos, totalmente orquestrada em Docker, composta por três serviços independentes: uma base de dados MongoDB, uma API de dados minimalista desenvolvida em Node.js e um servidor de interface web que serve páginas HTML ao utilizador.

Para além das rotas obrigatórias, foi desenvolvida uma rota adicional `GET /` que disponibiliza ao utilizador uma página inicial com botões de navegação para cada listagem, sem necessidade de alterar o URL manualmente.

### Rotas Desenvolvidas

- `GET /filmes` - responde com uma página HTML contendo uma tabela com os seguintes campos de filme: id, título, ano, número de atores no elenco e número de géneros associados ao filme; Cada linha deve ser um link para a página individual de filme;
- `GET /filmes/:id` - responde com uma página HTML contendo toda a informação de filme; 
- `GET /atores` - responde com uma página HTML contendo uma tabela com os seguintes campos de ator: id, nome, número de filmes em que participou; Cada linha deve ser um link para a página individual de ator; 
- `GET /atores/:id` - responde com uma página HTML contendo toda a informação de ator; 
- `GET /generos` - responde com uma página HTML contendo uma tabela com os seguintes campos de género: id, designação, número de filmes associados ao género;


## Resolução

### Preparação do Dataset

O dataset original disponibilizado pelo professor é um único ficheiro JSON (cinema.json) com todos os filmes. Para o preparar para o MongoDB e para facilitar as consultas do servidor aplicacional, foi desenvolvido um script Python (handle_json.py) que normaliza e separa os dados em três coleções distintas.

#### Coleção filmes

Cada documento de filme recebe um campo `_id` sequencial (string) e mantém todos os campos originais do dataset, incluindo title, year, cast e genres.

#### Coleção atores

Criada de raiz a partir dos dados de elenco de cada filme. Cada documento inclui:

- `_id`: identificador único sequencial (string)
- `name`: nome do ator ou atriz
- `films`: lista de objetos { _id, title } com os filmes em que participou

O script filtra nomes de atores inválidos (vazios, com comprimento inferior a 2 caracteres, ou que comecem por aspas).

#### Coleção géneros

Criada de forma análoga à coleção de atores. Cada documento inclui:
- `_id`: identificador único sequencial (string)
- `name`: designação do género
- `films`: lista de objetos { _id, title } com os filmes associados

A definição explícita do campo _id em todas as coleções impede que o MongoDB gere automaticamente ObjectIds, garantindo compatibilidade com os IDs gerados pelo script Python.

### API de Dados (cinema_server.js)

A API foi desenvolvida em Node.js com Express e Mongoose, as rotas estão registadas sob o prefixo /cinema através de um Express Router:

- `/cinema/filmes` - listagem com suporte a pesquisa de texto completo (?q=), projeção de campos (?_select=) e ordenação (?_sort=, ?_order=)
- `/cinema/filmes/:id` - detalhe de filme por _id
- `/cinema/atores` - listagem com ordenação padrão por nome
- `/cinema/atores/:id` - detalhe de ator por _id
- `/cinema/generos` - listagem com ordenação padrão por nome

Os índices de texto são criados no arranque do MongoDB pelo script import.sh, permitindo a pesquisa full-text nos campos title, cast e genres (filmes) e name (atores e géneros).

### Servidor de Interface (app_interface.js)

O servidor de interface foi desenvolvido em Node.js com Express, Pug como motor de templates e Axios para comunicar com a API de dados. Recebe o endereço da API através da variável de ambiente API_URL, o que garante portabilidade entre ambiente local e Docker.
Cada rota da interface faz um pedido HTTP à API correspondente e renderiza a página Pug adequada, passando os dados recebidos como variáveis de template.

### Orquestração com Docker

A aplicação é composta por três containers orquestrados com Docker Compose, todos ligados numa rede interna privada (cinema-network):

- `mongodb`: Base de dados MongoDB com importação automática do dataset
- `api`: API de dados minimalista — não exposta ao exterior (porta 7789 interna)
- `interface`: Servidor de interface web, único ponto de entrada externo (porta 7790)


# Testes

Antes de construir os containers, é necessário correr o script Python para gerar as três coleções JSON a partir do dataset original:

```bash
python3 handle_json.py
```

Para construir as imagens e arrancar todos os serviços em modo detached:

```bash
docker compose up -d --build
```

Após o arranque, a interface web fica disponível no seguinte endereço:

```text
http://localhost:7790
```

# Ficheiros Resultantes

- `api_dados/scripts/handle_json.py`:   Script Python para normalizar o dataset e gerar as 3 coleções JSON
- `api_dados/cinema_server.js`:	API de dados minimalista (Express + Mongoose)
- `api_dados/Dockerfile`:	Imagem Docker para a API de dados (Node.js 22)
- `api_dados/Dockerfile.mongo`:	Imagem Docker para o MongoDB com importação automática
- `api_dados/mongo-init/import.sh`:	Script de importação do dataset e criação de índices de texto
- `interface/app_interface.js`:	Servidor de interface web (Express + Pug + Axios)
- `interface/Dockerfile.interface`:	Imagem Docker para o servidor de interface (Node.js 22)
- `interface/views/*.pug`:	Templates Pug para todas as páginas HTML
- `docker-compose.yml`:	Orquestração dos três serviços com rede interna partilhada
