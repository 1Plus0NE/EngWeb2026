#!/bin/bash
# Importa os JSONs para a base de dados cinema e as suas respetivas coleções
mongoimport --host localhost --db cinema --collection filmes --type json --file /docker-entrypoint-initdb.d/filmes.json --jsonArray
mongoimport --host localhost --db cinema --collection atores --type json --file /docker-entrypoint-initdb.d/atores.json --jsonArray
mongoimport --host localhost --db cinema --collection generos --type json --file /docker-entrypoint-initdb.d/generos.json --jsonArray

# Cria o índice de texto necessário para o parâmetro ?q= funcionar

mongosh cinema --eval '
  db.filmes.createIndex({ title: "text", cast: "text", genres: "text" });
  db.atores.createIndex({ name: "text" });
  db.generos.createIndex({ name: "text" });
'