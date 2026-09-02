import {
  BASE_CATEGORIES,
  BASE_PRODUCTS,
  categoryImage,
  type CatalogProduct,
  type CatalogVariant,
} from "@/lib/catalog";
import type { SiteData, VariantOverride } from "@/lib/store.functions";

export type StoreCategory = {
  slug: string;
  name: string;
  description: string | null;
  image: string;
  sortOrder: number;
  active: boolean;
};

export type StoreProduct = CatalogProduct & {
  image: string;
  gallery: string[];
};

/** Une el inventario real (Excel) con los cambios hechos desde el panel. */
export function mergeProducts(data: SiteData | null | undefined): StoreProduct[] {
  const overrides = new Map((data?.products ?? []).map((p) => [p.slug, p]));
  const imagesBySlug = new Map<string, string[]>();
  for (const img of data?.images ?? []) {
    const list = imagesBySlug.get(img.product_slug) ?? [];
    if (img.is_primary) list.unshift(img.url);
    else list.push(img.url);
    imagesBySlug.set(img.product_slug, list);
  }

  const merged: StoreProduct[] = BASE_PRODUCTS.map((base) => {
    const o = overrides.get(base.slug);
    overrides.delete(base.slug);
    const gallery = imagesBySlug.get(base.slug) ?? [];
    const image = o?.image_url ?? gallery[0] ?? categoryImage(base.categorySlug);
    return {
      ...base,
      name: o?.name ?? base.name,
      description: o?.description ?? base.description ?? null,
      categorySlug: o?.category_slug ?? base.categorySlug,
      priceFrom: o?.price ?? base.priceFrom,
      wholesaleFrom: o?.wholesale_price ?? base.wholesaleFrom,
      customizable: o?.customizable ?? base.customizable,
      active: o?.active ?? true,
      featured: o?.featured ?? false,
      image,
      gallery,
    };
  });

  // Productos creados desde el panel que no existen en el inventario base.
  for (const o of overrides.values()) {
    const gallery = imagesBySlug.get(o.slug) ?? [];
    merged.push({
      id: o.slug,
      slug: o.slug,
      name: o.name,
      category: o.category_slug,
      categorySlug: o.category_slug,
      description: o.description,
      colors: [],
      sizes: [],
      priceFrom: o.price,
      wholesaleFrom: o.wholesale_price,
      stock: 0,
      variantCount: 0,
      customizable: o.customizable,
      active: o.active,
      featured: o.featured,
      image: o.image_url ?? gallery[0] ?? categoryImage(o.category_slug),
      gallery,
    });
  }

  return merged.filter((p) => p.active);
}

export function mergeCategories(data: SiteData | null | undefined): StoreCategory[] {
  const overrides = new Map((data?.categories ?? []).map((c) => [c.slug, c]));
  const list: StoreCategory[] = BASE_CATEGORIES.map((c) => {
    const o = overrides.get(c.slug);
    overrides.delete(c.slug);
    return {
      slug: c.slug,
      name: o?.name ?? c.name,
      description: o?.description ?? null,
      image: o?.image_url ?? categoryImage(c.slug),
      sortOrder: o?.sort_order ?? c.sort_order,
      active: o?.active ?? true,
    };
  });
  for (const o of overrides.values()) {
    list.push({
      slug: o.slug,
      name: o.name,
      description: o.description,
      image: o.image_url ?? categoryImage(o.slug),
      sortOrder: o.sort_order,
      active: o.active,
    });
  }
  return list.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Aplica sobre las variantes reales los cambios de stock/precio del panel. */
export function mergeVariants(
  base: CatalogVariant[],
  overrides: VariantOverride[],
  productSlug: string,
): CatalogVariant[] {
  const byCode = new Map(
    overrides.filter((o) => o.product_slug === productSlug && o.code).map((o) => [o.code!, o]),
  );
  const merged = base.map((v) => {
    const o = byCode.get(v.code);
    byCode.delete(v.code);
    return o ? { ...v, price: o.price ?? v.price, stock: o.stock, active: o.active } : { ...v, active: true };
  });
  for (const o of byCode.values()) {
    merged.push({
      code: o.code ?? "",
      color: o.color,
      size: o.size,
      price: o.price,
      wholesale: null,
      stock: o.stock,
      barcode: null,
      unit: null,
      active: o.active,
    });
  }
  return merged.filter((v) => v.active !== false);
}

export function settingText(
  data: SiteData | null | undefined,
  key: string,
  fallback: string,
): string {
  const value = data?.settings?.[key];
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object" && "text" in (value as Record<string, unknown>)) {
    const t = (value as Record<string, unknown>)["text"];
    if (typeof t === "string" && t.trim()) return t;
  }
  return fallback;
}
