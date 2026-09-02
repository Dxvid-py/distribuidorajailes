"""Normaliza el Excel del inventario JAILES a src/data/catalog.json."""
import json, re, unicodedata
import pandas as pd

SRC = "/mnt/user-uploads/Plantilla_completa_de_items_26-08-2026-2.xlsx"
OUT = "src/data/catalog.json"

COLORS = {
    "Blanco Hueso": "#efe9dd", "Blanco": "#ffffff", "Negro": "#151515",
    "Rojo": "#c0392b", "Vinotinto": "#5d1a24", "Azul Cielo": "#a9cfe8",
    "Azul Agua": "#7fc4c9", "Azul Rey": "#1f3f9c", "Azul Turquí": "#1b2a4a",
    "Azul Oscuro": "#22314f", "Azul": "#2b4a9b",
    "Cafe Claro": "#a9825f", "Cafe Oscuro": "#5b3d2b", "Café Claro": "#a9825f",
    "Café Oscuro": "#5b3d2b", "Marron": "#6b4630", "Marrón": "#6b4630",
    "Camel": "#c19a6b", "Kaki": "#bda87c", "Caqui": "#bda87c",
    "Rosado": "#eaa9bb", "Lila": "#b9a3d6", "Morado": "#6b3fa0",
    "Amarillo Suave": "#f3e3a3", "Amarillo Bandera": "#f5c518", "Amarillo": "#f2cd3a",
    "Mostaza": "#c9962c", "Naranja": "#e2703a", "Terracota": "#b4573c",
    "Vainilla": "#f0e6cd", "Beige": "#e3d7c3", "Hueso": "#efe9dd",
    "Gris Claro": "#cfd2d4", "Gris Ratón": "#8d8f92", "Gris Oscuro": "#4a4d50",
    "Gris": "#9a9d9f", "Petróleo": "#1f4a4f", "Petroleo": "#1f4a4f",
    "Verde Oliva": "#6f7442", "Verde Militar": "#4b5320", "Verde Menta": "#a8d9c2",
    "Verde Botella": "#1e5240", "Verde Limón": "#a9c93a", "Verde": "#3f7d4f",
    "Guayaba": "#e07a8a", "Fucsia": "#c62368", "Coral": "#e2725b",
    "Turquesa": "#3aa7a8", "Salmon": "#f0a08a", "Salmón": "#f0a08a",
    "Dorado": "#c9a227", "Plateado": "#c0c4c8", "Crema": "#f2e8d5",
}
COLOR_NAMES = sorted(COLORS, key=len, reverse=True)
SIZE_RE = re.compile(r"^(XS|S|M|L|XL|XXL|XXXL|S/M|L/XL|M/L|\d{1,2}-\d{1,2}|\d{1,2}|Talla [Uú]nica|Única|Unica)$", re.I)


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def num(v):
    if pd.isna(v):
        return None
    if isinstance(v, str):
        v = v.replace(".", "").replace(",", ".") if v.count(",") == 1 and v.count(".") > 1 else v.replace(",", ".")
        try:
            v = float(v)
        except ValueError:
            return None
    v = float(v)
    return round(v) if v > 0 else None


def qty(row):
    total = 0
    for c in row.index:
        if c.startswith("Cantidad inicial en bodega"):
            v = row[c]
            if not pd.isna(v):
                try:
                    total += float(str(v).replace(",", "."))
                except ValueError:
                    pass
    return int(total)


STEMS = [
    "Suéter Adulto", "Suéter Grande", "Suéter Niño", "Bermuda Caballero",
    "Bermuda Dama", "Bermuda Niño", "Blusón Corto Dama", "Blusón Corto",
    "Pantalón Ángel Dama", "Pantalón Ángel Niña", "Rollos de Tela Burda",
    "Rollos de Tela Algodón Licrado", "Rollos de Tela",
]
STEMS.sort(key=len, reverse=True)


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", s.lower()).strip()


CANON = {norm(s): s for s in STEMS}

df = pd.read_excel(SRC)
products = {}

for _, row in df.iterrows():
    name = str(row["Nombre"]).strip()
    cat = str(row["Categoria"]).strip() if not pd.isna(row["Categoria"]) else "Otros"
    parts = [p.strip() for p in name.split(" / ")]
    base = re.sub(r"\s+", " ", parts[0]).strip()
    color, size = None, None
    for p in parts[1:]:
        if SIZE_RE.match(p):
            size = p.upper() if len(p) <= 4 else p.title()
        elif p in COLORS:
            color = p
        else:
            color = color or p
    # modificadores de modelo que van al final del nombre
    modifier = ""
    for mod in (" Oversize", " Premium"):
        if base.endswith(mod):
            modifier = mod
            base = base[: -len(mod)].strip()
            break
    # color embebido en el nombre base ("Suéter Adulto Rojo")
    if color is None:
        for cn in COLOR_NAMES:
            if norm(base).endswith(" " + norm(cn)):
                color = cn
                base = base[: -len(cn) - 1].strip()
                break
    if color is None:
        for stem in STEMS:
            if norm(base).startswith(norm(stem) + " ") and len(base) > len(stem) + 1:
                color = base[len(stem) + 1 :].strip().title()
                base = stem
                break
    base = base + modifier
    # talla embebida ("Pantalón Ángel Dama Talla única")
    m = re.search(r"\s+(Talla [UuÚú]nica)$", base, re.I)
    if m:
        size = size or "Talla única"
        base = base[: m.start()].strip()

    nb = norm(base)
    for k, v in CANON.items():
        if nb == k:
            base = v
        elif nb.startswith(k + " "):
            base = v + base[len(k):]
    key = (cat, norm(base))
    prod = products.setdefault(key, {
        "id": slug(f"{base}"),
        "name": base,
        "category": cat,
        "variants": [],
    })
    prod["variants"].append({
        "code": str(row["Codigo"]).strip(),
        "color": color,
        "size": size,
        "price": num(row["Precio: Publico en General"]),
        "wholesale": num(row["Precio: Al por mayor"]),
        "stock": qty(row),
        "barcode": None if pd.isna(row["Codigo de barras"]) else str(row["Codigo de barras"]).strip(),
        "unit": None if pd.isna(row["Unidad de medida"]) else str(row["Unidad de medida"]).strip(),
    })

catalog = []
for (cat, _k), p in products.items():
    base = p["name"]
    variants = p["variants"]
    # descartar filas "padre" sin color ni talla cuando existen variantes reales
    real = [v for v in variants if v["color"] or v["size"]]
    if real:
        variants = real
    colors, sizes = [], []
    for v in variants:
        if v["color"] and v["color"] not in colors:
            colors.append(v["color"])
        if v["size"] and v["size"] not in sizes:
            sizes.append(v["size"])
    prices = [v["price"] for v in variants if v["price"]]
    whole = [v["wholesale"] for v in variants if v["wholesale"]]
    catalog.append({
        "id": p["id"],
        "name": base,
        "category": cat,
        "colors": [{"name": c, "hex": COLORS.get(c, "#b9b2a6")} for c in colors],
        "sizes": sizes,
        "priceFrom": min(prices) if prices else None,
        "wholesaleFrom": min(whole) if whole else None,
        "stock": sum(v["stock"] for v in variants),
        "variants": variants,
    })

catalog.sort(key=lambda p: (p["category"], p["name"]))
cats = []
for p in catalog:
    if p["category"] not in cats:
        cats.append(p["category"])

json.dump(
    {"categories": cats, "products": catalog},
    open(OUT, "w", encoding="utf-8"),
    ensure_ascii=False,
    indent=1,
)
print(len(catalog), "productos,", sum(len(p["variants"]) for p in catalog), "variantes")
print(cats)
