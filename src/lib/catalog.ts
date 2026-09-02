import rawCatalog from "@/data/catalog-index.json";

import sueterAdulto from "@/assets/producto-sueter-adulto.jpg";
import sueterNino from "@/assets/producto-sueter-nino.jpg";
import bermudaCaballero from "@/assets/producto-bermuda-caballero.jpg";
import bermudaDama from "@/assets/producto-bermuda-dama.jpg";
import bermudaNino from "@/assets/producto-bermuda-nino.jpg";
import blusonDama from "@/assets/producto-bluson-dama.jpg";
import pantalonDama from "@/assets/producto-pantalon-dama.jpg";
import pantalonNina from "@/assets/producto-pantalon-nina.jpg";
import telas from "@/assets/producto-telas.jpg";
import dtf from "@/assets/dtf-estampado.jpg";

export type CatalogVariant = {
  code: string;
  color: string | null;
  size: string | null;
  price: number | null;
  wholesale: number | null;
  stock: number;
  barcode: string | null;
  unit: string | null;
  active?: boolean;
};

export type CatalogColor = { name: string; hex: string };

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description?: string | null;
  image?: string | null;
  colors: CatalogColor[];
  sizes: string[];
  priceFrom: number | null;
  wholesaleFrom: number | null;
  stock: number;
  variantCount: number;
  customizable: boolean;
  active: boolean;
  featured?: boolean;
};

type RawProduct = Omit<
  CatalogProduct,
  "slug" | "categorySlug" | "customizable" | "active" | "image"
>;

let variantCache: Map<string, CatalogVariant[]> | null = null;

/** Carga perezosa de las 1.1k variantes reales del inventario. */
export async function loadVariants(slug: string): Promise<CatalogVariant[]> {
  if (!variantCache) {
    const full = (await import("@/data/catalog.json")) as unknown as {
      default: { products: Array<{ name: string; category: string; variants: CatalogVariant[] }> };
    };
    variantCache = new Map(
      full.default.products.map((p) => [slugify(`${p.name}-${p.category}`), p.variants]),
    );
  }
  return variantCache.get(slug) ?? [];
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORY_IMAGES: Record<string, string> = {
  "sueter-adulto": sueterAdulto,
  "sueter-nino": sueterNino,
  "bermudas-caballero": bermudaCaballero,
  "bermudas-dama": bermudaDama,
  "bermudas-nino": bermudaNino,
  "bluson-corto-dama": blusonDama,
  "pantalones-dama": pantalonDama,
  "pantalones-nina": pantalonNina,
  telas: telas,
  servicio: dtf,
  confecciones: dtf,
  apliques: dtf,
  otros: dtf,
};

/** Imagen de catálogo por categoría (fotografía de estudio consistente). */
export function categoryImage(categorySlug: string) {
  return CATEGORY_IMAGES[categorySlug] ?? sueterAdulto;
}

/** Categorías que corresponden a prendas de vestir (se priorizan en la tienda). */
export const APPAREL_CATEGORIES = [
  "sueter-adulto",
  "sueter-nino",
  "bermudas-caballero",
  "bermudas-dama",
  "bermudas-nino",
  "bluson-corto-dama",
  "pantalones-dama",
  "pantalones-nina",
];

const CUSTOMIZABLE = new Set(APPAREL_CATEGORIES);

const raw = rawCatalog as { categories: string[]; products: RawProduct[] };

export const BASE_PRODUCTS: CatalogProduct[] = raw.products.map((p) => {
  const categorySlug = slugify(p.category);
  return {
    ...p,
    slug: slugify(`${p.name}-${p.category}`),
    categorySlug,
    customizable: CUSTOMIZABLE.has(categorySlug),
    active: true,
    image: null,
    description: null,
  };
});

export const BASE_CATEGORIES = raw.categories.map((name, index) => ({
  slug: slugify(name),
  name,
  description: null as string | null,
  image_url: null as string | null,
  sort_order: index,
  active: true,
}));

export function stockLevel(stock: number): "disponible" | "poco" | "agotado" {
  if (stock <= 0) return "agotado";
  if (stock <= 10) return "poco";
  return "disponible";
}
