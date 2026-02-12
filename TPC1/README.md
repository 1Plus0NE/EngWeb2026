# TPC1: Oficina Automóvel

# Data

- 04/02/2026

# Autor

- **Nome**: Luís Filipe Araújo Ferreira
- **Número**: A98286
- **Fotografia**:

![Fotografia](../Fotografia.jpg)

# Resumo

## Objetivo

Neste trabalho pretende-se desenvolver páginas html de acordo com o dataset.

O serviço deve incluir:

Análise do dataset dataset_reparacoes.json sobre as intervenções realizadas numa oficina automóvel;

Definir a estrutura de um website de exploração do dataset:

- Página principal: lista de dados consultáveis;

- Listagem das reparações: Data, nif, nome, marca, modelo, número de intervenções realizadas;

- Listagem dos tipos de intervenção: lista alfabética de código das intervenções - código, nome e descrição;

- Listagem das marcas e modelos dos carros intervencionados: lista alfabética das marcas e modelos dos carros reparados - marca, modelo, número de carros;

- Página da Reparação: página com toda a informação de uma reparação;

- Página do tipo de intervenção: dados da intervenção (código, nome e descrição) e lista de reparações onde foi realizada;

- Página do marca/modelo: página com a marca e os respetivos modelos, bem como o número total de carros da marca

## Resolução

Para a resolução deste trabalho foi desenvolvido um script em python, o script `generate_html.py` começa por criar as diretorias necessárias para as páginas html e processa o dataset em várias etapas:

1. **Carregamento e pré-processamento**: Lê o JSON e atribui IDs únicos a cada reparação
2. **Organização de dados**: Agrupa informações em quatro estruturas principais:
   - Reparações: informação completa de cada reparação
   - Veículos: marca, modelo e contagem
   - Intervenções: código, nome e descrição
   - Mapeamento: intervenção -> reparações

3. **Geração de páginas**: Cria 4 tipos de páginas HTML
   - Páginas individuais de [reparações](output/repairs)
   - Páginas por [tipo de intervenção](output/intervention)
   - Páginas por [marca/modelo](output/brand_model)

Para gerar as páginas HTML a partir do dataset:

```bash
python3 generate_html.py
```

Para testar as páginas geradas na diretoria output, sendo PORT uma porta à sua escolha:

```bash
python3 -m http.server PORT --directory output
```

Para aceder ao website gerado via browser, sendo PORT a porta escolhida anteriormente:

```bash
localhost:PORT/index.html
```

# Resultados

### Ficheiros resultantes deste trabalho

- Dataset de reparações dado pelo professor: [dataset_reparacoes.json](dataset_reparacoes.json)
- Script em Python transforma o dataset em json para páginas html: [generate_html.py](generate_html.py)
- Pasta output onde estão localizados todos os ficheiros html gerados pelo script: [output](output)
- Dentro da pasta output existem 3 outras diretorias, [brand_model](output/brand_model), [interventions](output/interventions) e [repairs](output/repairs), cada diretoria representa todos as páginas geradas para as marcas/modelos, os tipos de intervenções e as reparações, respetivamente