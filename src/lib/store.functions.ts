import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type SiteSettings = Record<string, JsonValue>;

export type ProductOverride = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_slug: string;
  price: number | null;
  wholesale_price: number | null;
  image_url: string | null;
  featured: boolean;
  customizable: boolean;
  active: boolean;
  sort_order: number;
  updated_at: string;
};

export type VariantOverride = {
  id: string;
  product_slug: string;
  code: string | null;
  color: string | null;
  color_hex: string | null;
  size: string | null;
  price: number | null;
  stock: number;
  active: boolean;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
};

export type SliderRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  active: boolean;
};

export type ProductImageRow = {
  id: string;
  product_slug: string;
  url: string;
  sort_order: number;
  is_primary: boolean;
};

export type SiteData = {
  settings: SiteSettings;
  sliders: SliderRow[];
  categories: CategoryRow[];
  products: ProductOverride[];
  variants: VariantOverride[];
  images: ProductImageRow[];
};

export function publicSupabase() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/**
 * Contenido administrable del sitio (textos, sliders, y los cambios que el
 * administrador haya hecho sobre el inventario base). El catálogo completo
 * vive en src/data como fuente del inventario real del negocio.
 */
export const getSiteData = createServerFn({ method: "GET" }).handler(async (): Promise<SiteData> => {
  const supabase = publicSupabase();
  const [settings, sliders, categories, products, variants, images] = await Promise.all([
    supabase.from("site_settings").select("key,value"),
    supabase.from("sliders").select("*").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").order("sort_order"),
    supabase.from("product_variants").select("*,products(slug)"),
    supabase.from("product_images").select("*,products(slug)").order("sort_order"),
  ]);

  const settingsMap: SiteSettings = {};
  for (const row of settings.data ?? []) settingsMap[row.key as string] = row.value as JsonValue;

  return {
    settings: settingsMap,
    sliders: (sliders.data ?? []) as SliderRow[],
    categories: (categories.data ?? []) as CategoryRow[],
    products: (products.data ?? []) as ProductOverride[],
    variants: ((variants.data ?? []) as Array<Record<string, unknown>>).map((v) => ({
      id: v["id"] as string,
      product_slug: (v["products"] as { slug: string } | null)?.slug ?? "",
      code: v["code"] as string | null,
      color: v["color"] as string | null,
      color_hex: v["color_hex"] as string | null,
      size: v["size"] as string | null,
      price: v["price"] as number | null,
      stock: (v["stock"] as number) ?? 0,
      active: (v["active"] as boolean) ?? true,
    })),
    images: ((images.data ?? []) as Array<Record<string, unknown>>).map((i) => ({
      id: i["id"] as string,
      product_slug: (i["products"] as { slug: string } | null)?.slug ?? "",
      url: i["url"] as string,
      sort_order: (i["sort_order"] as number) ?? 0,
      is_primary: (i["is_primary"] as boolean) ?? false,
    })),
  };
});
