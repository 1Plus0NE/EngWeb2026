import json

# This script takes a json as input and manipulates it 
# so it becomes a valid json for the json-server

myList = []

with open("emd.json", encoding="utf-8") as f:
    dados = json.load(f)
    for v in dados:
        if "_id" in v:
            v["id"] = v.pop("_id")
        if "nome" in v and isinstance(v["nome"], dict):
            primeiro = v["nome"].get("primeiro", "")
            ultimo = v["nome"].get("último", "")
            v["nome"] = f"{primeiro} {ultimo}".strip()
        myList.append(v)

res = {}
res['emd'] = myList

with open("new_emd.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)