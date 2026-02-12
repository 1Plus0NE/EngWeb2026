# TPC2: Servidor Aplicacional 

# Data

- 12/02/2026

# Autor

- **Nome**: Luís Filipe Araújo Ferreira
- **Número**: A98286
- **Fotografia**:

![Fotografia](../Fotografia.jpg)

# Resumo

## Objetivo

O presente trabalho tem como objetivo a construção de um Servidor Aplicacional em Node.js que consome dados disponibilizados por uma API REST simulada através do json-server, referente a uma oficina de reparações automóveis.

O servidor deverá disponibilizar as seguintes rotas:

- `/reparacoes` : Devolve uma tabela HTML com a lista de reparações realizadas
- `/intervencoes` : Devolve uma tabela HTML com os diferentes tipos de intervenções, sem repetições e com a contagem do número de ocorrências (ordenadas por código de intervenção)
- `/viaturas` : Devolve uma tabela HTML com as diferentes marcas dos veículos e o número de intervenções realizadas por cada marca (ordenada alfabeticamente por marca)

## Resolução

Para o dataset oferecido pelo professor, foi feita uma pequena análise de que modo devo agilizar o dataset para que possa facilitar os pedidos GET, para tal foi desenvolvido um script em python `generate_json.py` que visa:

- Renomear as chaves de uma reparação, da respetiva viatura e das respetivas intervenções, deste modo, foi passado o NIF, Matricula e Código, para ID, de modo a facilitar posteriormente no script em javascript para a listagem e para o json-server no que toca à utilização de query strings (ex: `_sort=id).
- Criar outras coleções, foram criadas as coleções intervencoes e veiculos, estas duas novas coleções permitem responder aos pedidos de listagem de intervencoes sem repetições e com a contagem do número de ocorrências e as listagem das viaturas mediante o modelo e o número de intervenções realizadas

Este pré-processamento permite, evitar cálculos repetidos no servidor Node.js, reduzir a complexidade dos pedidos GET e melhorar a eficiência uma vez que o dataset apresenta uma grande dimensão

Em seguida foi criado o programa em JavaScript `server.js`, que inicializa um servidor na porta 7777, utiliza o módulo `http`, utiliza a biblioteca **axios** para consumir a API REST, gera dinamicamente páginas HTML com tabelas, este servidor comunica com o `json-server`, que expõe os dados do ficheiro `new_dataset.json` na porta 3000.

## Testes 

Para executar corretamente o trabalho desenvolvido, devem ser seguidos os seguintes passos:

Antes de iniciar o servidor aplicacional, é necessário instalar a biblioteca **axios**, responsável pelas requisições HTTP à API de dados.

```bash
npm install axios
```

Caso ainda não tenha sido gerado o novo dataset, deve executar o script Python:

```bash
python3 generate_json.py
```

Inicialização da API de Dados (json-server) num terminal, através do seguinte comando:

```bash
json-server --watch new_dataset.json
```

Esta API está disponível em:

```bash
http://localhost/3000
```

Para a inicialização do servidor aplicacional, num segundo terminal, executar:

```bash
node server.js
```

Para testar os pedidos, basta abrir um navegador web e inserir o URL:

```
http://localhost/7777
```

# Resultados

## Ficheiros resultantes deste trabalho

- O dataset de reparações inicialmente dado pelo professor: [dataset_reparacoes.json](./dataset_reparacoes.json)
- O programa em Python que transforma o dataset anterior num dataset apropriado: [generate_json.py](./generate_json.py)
- O dataset resultante do pré-processamento do programa anterior: [new_dataset.json](./new_dataset.json)
- O programa em JavaScript que inicializa o servidor: [server.js](./server.js)
- Os ficheiros e pasta resultantes da biblioteca axios: 
    - Pasta [node_modules](node_modules)
    - Ficheiro [package.json](./package.json)
    - Ficheiro [package-lock.json](./package-lock.json)
