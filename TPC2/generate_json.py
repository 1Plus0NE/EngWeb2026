import json
from collections import Counter

INPUT_JSON = "dataset_reparacoes.json"

def load_json(path: str) -> dict:
    """ Loads a json file and returns a dictionary. """
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(new_json):
    """ Given a dictionary writes a json file """
    with open("new_dataset.json", "w", encoding="utf-8") as file:
        json.dump(new_json, file, indent=2, ensure_ascii=False)

def rename_keys(data):
    """ Renames the keys from a dictionary to id """
    key_map = {
        "nif": "id",
        "matricula": "id",
        "codigo": "id"
    }

    if isinstance(data, list):
        return [rename_keys(item) for item in data]

    elif isinstance(data, dict):
        new_dict = {}
        for key, value in data.items():
            new_key = key_map.get(key, key)
            new_dict[new_key] = rename_keys(value)
        return new_dict

    else:
        return data

def main():

    data = load_json(INPUT_JSON)
    renamed_data = rename_keys(data)

    interventions_data = {}

    # Counters for each interventions used and each brand repaired
    intervention_uses = Counter() 
    brand_repairs = Counter()     

    for repair in renamed_data.get("reparacoes", []):
        marca = repair.get("viatura", {}).get("marca")
        if marca:
            brand_repairs[marca] += 1

        for itv in repair.get("intervencoes", []):
            itv_id = itv.get("id")
            if not itv_id:
                continue

            intervention_uses[itv_id] += 1

            if itv_id not in interventions_data:
                interventions_data[itv_id] = itv

    intervencoes = []
    for itv_id, itv_obj in interventions_data.items():
        itv_with_uses = dict(itv_obj)
        itv_with_uses["usos"] = intervention_uses[itv_id]
        intervencoes.append(itv_with_uses)

    veiculos = [{"marca": marca, "reparacoes": count} for marca, count in brand_repairs.items()]

    renamed_data["intervencoes"] = intervencoes
    renamed_data["veiculos"] = veiculos

    write_json(renamed_data)

if __name__ == "__main__":
    main()