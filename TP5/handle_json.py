import json

with open("cinema.json", encoding="utf-8") as f:
    dados = json.load(f)

filmes = []
atores_dict = {}
generos_dict = {}

for i, filme in enumerate(dados["filmes"], start=1):
    filme["id"] = i
    filmes.append(filme)

    titulo = filme.get("title", "Sem título")

    for ator in filme.get("cast", []):

        # Filtrar nomes de atores invalidos
        if not ator or len(ator) < 2:
            continue

        if ator.startswith('"') or ator.startswith("'"):
            continue
        
        if ator not in atores_dict:
            atores_dict[ator] = {
                "id": len(atores_dict) + 1,
                "name": ator,
                "films": []
            }

        atores_dict[ator]["films"].append({
            "id": i,
            "title": titulo
        })

    for genero in filme.get("genres", []):
        if genero not in generos_dict:
            generos_dict[genero] = {
                "id": len(generos_dict) + 1,
                "name": genero,
                "films": []
            }

        generos_dict[genero]["films"].append({
            "id": i,
            "title": titulo
        })

atores = list(atores_dict.values())
generos = list(generos_dict.values())

res = {
    "filmes": filmes,
    "atores": atores,
    "generos": generos
}

with open("new_cinema.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)