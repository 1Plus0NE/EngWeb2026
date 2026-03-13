import json
import sys
import os

output_dir = "../collections"
os.makedirs(output_dir, exist_ok=True)

with open("cinema.json", encoding="utf-8") as f:
    dados = json.load(f)

filmes = []
atores_dict = {}
generos_dict = {}

for i, filme in enumerate(dados["filmes"], start=1):
    filme["_id"] = str(i)
    filmes.append(filme)

    titulo = filme.get("title")

    for ator in filme.get("cast", []):

        # Filtrar nomes de atores invalidos
        if not ator or len(ator) < 2:
            continue

        if ator.startswith('"') or ator.startswith("'"):
            continue
        
        if ator not in atores_dict:
            atores_dict[ator] = {
                "_id": str(len(atores_dict) + 1),
                "name": ator,
                "films": []
            }

        atores_dict[ator]["films"].append({
            "_id": str(i),
            "title": titulo
        })

    for genero in filme.get("genres", []):
        if genero not in generos_dict:
            generos_dict[genero] = {
                "_id": str(len(generos_dict) + 1),
                "name": genero,
                "films": []
            }

        generos_dict[genero]["films"].append({
            "_id": str(i),
            "title": titulo
        })

atores = list(atores_dict.values())
generos = list(generos_dict.values())

res = {
    "filmes": filmes,
    "atores": atores,
    "generos": generos
}

for colecao in res:
    filepath = os.path.join(output_dir, f"{colecao}.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(res[colecao], f, ensure_ascii=False, indent=2)