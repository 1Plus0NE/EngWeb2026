import json, os, shutil

INPUT_JSON = "dataset_reparacoes.json"
OUTPUT_DIR = "output"

def load_json(path: str) -> dict:
    """Loads a json file and returns a dictionary."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def mk_dir(relative_path: str):
    """Creates (or recreates) a directory."""
    if os.path.exists(relative_path):
        shutil.rmtree(relative_path)
    os.mkdir(relative_path)

def new_file(filename: str, content: str):
    """Writes content to a file (UTF-8)."""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

def make_id(entry: dict, idx: int) -> str:
    """
    Create a stable-ish id for each entry.
    Prefer real identifiers if available; fallback to index.
    """
    nif = entry.get("nif")
    data = entry.get("data")
    matricula = (entry.get("viatura") or {}).get("matricula")

    if nif and data and matricula:
        return f"{nif}_{data}_{matricula}".replace(" ", "")
    return f"idx_{idx}"

def get_vehicles(repairs: list) -> dict:
    """
    Returns a dict mapping (marca, modelo) -> number of cars
    """
    vehicles = {}

    for repair in repairs:
        v = repair.get("viatura", {})
        marca = v.get("marca")
        modelo = v.get("modelo")

        if not marca or not modelo:
            continue

        key = (marca, modelo)

        if key not in vehicles:
            vehicles[key] = 0

        vehicles[key] += 1

    return vehicles

def collect_interventions_data(repairs: list) -> tuple[dict, dict]:
    """
    Extract interventions and map them to repair IDs.
    Returns: (interventions_dict, repairs_by_intervention_dict)
    """
    interventions = {}
    repairs_by_intervention = {}

    for repair in repairs:
        rid = repair["id"]

        for itv in repair.get("intervencoes", []):
            codigo = itv.get("codigo")
            if not codigo:
                continue

            if codigo not in interventions:
                interventions[codigo] = {
                    "codigo": codigo,
                    "nome": itv.get("nome"),
                    "descricao": itv.get("descricao")
                }
                repairs_by_intervention[codigo] = []

            repairs_by_intervention[codigo].append(rid)

    return interventions, repairs_by_intervention

def build_index(repairs: dict, interventions: dict, vehicles: dict, output_dir: str):
    """ Generate index.html listing all repairs, types of intervention and brand/model  """
    # Repair list
    repairs_list = ""
    for repair in repairs:
        repairs_list += f"""
          <li>
            <a href="repairs/{repair['id']}.html"> ID: {repair['id']} </a>
            <br>
                Nome: {repair['nome']}<br>
                Data: {repair['data']}<br>
                Nº intervenções: {repair['nr_intervencoes']}<br>
            </br>
          </li>
        """
    # Intervention list
    interventions_list = ""
    for itv in interventions.values():
        interventions_list += f"""
          <li>
            <a href="interventions/{itv['codigo']}.html"> ID: {itv['codigo']} </a>
            <br>
                Nome: {itv['nome']}<br>
                Descrição: {itv['descricao']} <br>
          </li>
        """
    # Vehicle's brand list 
    vehicles_list = ""
    seen_brands = set()
    for marca, _ in vehicles:
        if marca not in seen_brands:
            vehicles_list += f"""
        <li>
            <a href="brand_model/{marca}.html">Marca: {marca}</a>
        </li>
        """
            seen_brands.add(marca)

    index_html = f"""<!doctype html>
<html>
  <head>
    <title>Índice</title>
    <meta charset="utf-8" />
    <style>
      table {{
        width: 100%;
        border-collapse: collapse;
      }}
      td {{
        vertical-align: top;
        border: 1px solid #ccc;
        padding: 10px;
        width: 33%;
      }}
      ul {{
        margin: 0;
        padding-left: 20px;
      }}
      li {{
        margin-bottom: 12px;
      }}
    </style>
  </head>
  <body>

    <h2>Índice Geral</h2>

    <table>
      <tr>
        <td>
          <h3>Reparações</h3>
          <ul>
            {repairs_list}
          </ul>
        </td>

        <td>
          <h3>Intervenções</h3>
          <ul>
            {interventions_list}
          </ul>
        </td>

        <td>
          <h3>Marcas / Modelos</h3>
          <ul>
            {vehicles_list}
            Número de Carros: {len(vehicles)}
          </ul>
        </td>
      </tr>
    </table>

  </body>
</html>
"""
    new_file(os.path.join(output_dir, "index.html"), index_html)

def build_repair(repairs: list, output_dir: str):
    """ Generate repair.html info about the repair  """
    for repair in repairs:
        interventions_html = ""
        for itv in repair.get("intervencoes", []):
            interventions_html += f"""
              <li>
                <strong>{itv.get('codigo')}</strong><br>
                Nome: {itv.get('nome')}<br>
                Descrição: {itv.get('descricao')}
              </li>
            """
        repair_html = f"""<!doctype html>
<html>
  <head>
    <title>Reparação {repair['id']}</title>
    <meta charset="utf-8" />
  </head>
  <body>

    <h2>Reparação {repair['id']}</h2>

    <h3>Dados da Reparação</h3>
    <ul>
      <li>Nome: {repair['nome']}</li>
      <li>NIF: {repair['nif']}</li>
      <li>Data: {repair['data']}</li>
    </ul>

    <h3>Viatura</h3>
    <ul>
      <li>Marca: {repair['viatura']['marca']}</li>
      <li>Modelo: {repair['viatura']['modelo']}</li>
      <li>Matrícula: {repair['viatura']['matricula']}</li>
    </ul>

    <h3>Intervenções ({repair['nr_intervencoes']})</h3>
    <ul>
      {interventions_html if interventions_html else "<li>(nenhuma)</li>"}
    </ul>

    <address>
      <a href="../index.html">Voltar ao índice</a>
    </address>

  </body>
</html>
"""
        filename = os.path.join(output_dir, "repairs", f"{repair['id']}.html")
        new_file(filename, repair_html)


def build_intervention(interventions: dict, repairs_by_intervention: dict, output_dir: str):
    """
    Generates one HTML page per intervention code in output/interventions/.
    interventions: { codigo: {"codigo":..,"nome":..,"descricao":..}, ... }
    repairs_by_intervention: { codigo: [repair_id1, repair_id2, ...], ... }
    """
    for codigo, info in interventions.items():
        repairs_list_html = ""
        for rid in repairs_by_intervention.get(codigo, []):
            repairs_list_html += f"""
              <li>
                <a href="../repairs/{rid}.html">{rid}</a>
              </li>
            """

        intervention_html = f"""<!doctype html>
<html>
  <head>
    <title>Intervenção {codigo}</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <h2>Intervenção {codigo}</h2>

    <table border="1" cellpadding="6">
      <tr><td><strong> Código </strong></td><td>{info.get("codigo","")}</td></tr>
      <tr><td><strong> Nome </strong></td><td>{info.get("nome","")}</td></tr>
      <tr><td><strong> Descrição </strong></td><td>{info.get("descricao","")}</td></tr>
    </table>

    <hr />

    <h3>Reparações onde esta intervenção foi usada</h3>
    <ul>
      {repairs_list_html if repairs_list_html else "<li>(nenhuma)</li>"}
    </ul>

    <address>
      <a href="../index.html">Voltar ao índice</a>
    </address>
  </body>
</html>
"""
        filename = os.path.join(output_dir, "interventions", f"{codigo}.html")
        new_file(filename, intervention_html)

def build_brand_model(brand: str, models_counts: dict, output_dir: str):
    """ Generate brand_model.html info about the brand_model  """
    models_list = ""
    total = 0

    for model in models_counts:
        count = models_counts[model]
        total += count
        models_list += f"""
          <li>{model} - {count}</li>
        """

    build_model_html = f"""<!doctype html>
<html>
  <head>
    <title>Marca: {brand}</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <h2>Marca: {brand}</h2>
    <p>Total de reparações com esta marca: {total}</p>

    <h3> Modelos e Quantidade</h3>
    <ul>
      {models_list}
    </ul>

    <address>
      <a href="../index.html">Voltar ao índice</a>
    </address>
  </body>
</html>
"""
    filename = os.path.join(output_dir, "brand_model", f"{brand}.html")
    new_file(filename, build_model_html)

def build_all_brands(vehicles: dict, output_dir: str):
    """Generate brand_model pages for all brands from the vehicles dictionary."""
    # Group vehicles by brand
    brands_models = {}
    for (marca, modelo), count in vehicles.items():
        if marca not in brands_models:
            brands_models[marca] = {}
        brands_models[marca][modelo] = count
    
    # Generate page for each brand
    for brand in sorted(brands_models.keys()):
        build_brand_model(brand, brands_models[brand], output_dir)



def main():
    mk_dir(OUTPUT_DIR)
    mk_dir(os.path.join(OUTPUT_DIR, "repairs"))
    mk_dir(os.path.join(OUTPUT_DIR, "interventions"))
    mk_dir(os.path.join(OUTPUT_DIR, "brand_model"))
    
    data = load_json(INPUT_JSON)
    repairs = data.get("reparacoes", [])
    if not isinstance(repairs, list):
        raise ValueError("Expected 'reparacoes' to be a list")

    # Add an 'id' field to each entry (important for linking)
    for idx, r in enumerate(repairs, start=1):
        r["id"] = make_id(r, idx)

    vehicles = get_vehicles(repairs)
    sorted_vehicles = dict(sorted(vehicles.items()))

    interventions, repairs_by_intervention = collect_interventions_data(repairs)
    interventions = dict(sorted(interventions.items()))

    build_index(repairs, interventions, sorted_vehicles, OUTPUT_DIR)
    build_repair(repairs, OUTPUT_DIR)
    build_intervention(interventions, repairs_by_intervention, OUTPUT_DIR)
    build_all_brands(vehicles, OUTPUT_DIR)

if __name__ == "__main__":
    main()