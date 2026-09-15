import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { APPAREL_CATEGORIES } from "@/lib/catalog";
import { mergeCategories, mergeProducts } from "@/lib/merge";
import { getSiteData } from "@/lib/store.functions";
import { cn } from "@/lib/utils";

type CatalogSearch = { categoria?: string; q?: string };

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    ...(typeof search["categoria"] === "string" ? { categoria: search["categoria"] } : {}),
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
  }),
  loader: () => getSiteData(),
  head: () => ({
    meta: [
      { title: "Catálogo JAILES · Camisetas, bermudas, pantalones y telas" },
      {
        name: "description",
        content:
          "Catálogo mayorista de JAILES: suéteres adulto y niño, bermudas, pantalones, blusones, telas y estampados DTF con colores y tallas reales.",
      },
      { property: "og:title", content: "Catálogo JAILES" },
      {
        property: "og:description",
        content: "Prendas por modelo, con colores y tallas disponibles. Cotiza por WhatsApp.",
      },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });
  const [query, setQuery] = useState(search.q ?? "");

  const products = useMemo(() => mergeProducts(data), [data]);
  const categories = useMemo(() => {
    const used = new Set(products.map((p) => p.categorySlug));
    return mergeCategories(data)
      .filter((c) => used.has(c.slug))
      .sort(
        (a, b) =>
          Number(APPAREL_CATEGORIES.includes(b.slug)) - Number(APPAREL_CATEGORIES.includes(a.slug)),
      );
  }, [data, products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (search.categoria ? p.categorySlug === search.categoria : true))
      .filter((p) =>
        q
          ? p.name.toLowerCase().includes(q) ||
            p.colors.some((c) => c.name.toLowerCase().includes(q))
          : true,
      )
      .sort(
        (a, b) =>
          Number(APPAREL_CATEGORIES.includes(b.categorySlug)) -
            Number(APPAREL_CATEGORIES.includes(a.categorySlug)) || a.name.localeCompare(b.name),
      );
  }, [products, query, search.categoria]);

  const setCategoria = (slug?: string) =>
    navigate({
      search: (prev) => {
        const { categoria: _categoria, ...rest } = prev;
        return slug ? { ...rest, categoria: slug } : rest;
      },
    });

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-14 sm:px-8">
      <Reveal>
        <p className="eyebrow">Catálogo</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Todo el inventario, por modelo</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Cada prenda agrupa sus colores y tallas reales. Los precios y la disponibilidad
          corresponden al inventario del negocio.
        </p>
      </Reveal>

      <div className="sticky top-16 z-30 -mx-5 mt-10 border-y border-border bg-background/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <FilterChip active={!search.categoria} onClick={() => setCategoria(undefined)}>
              Todo
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.slug}
                active={search.categoria === c.slug}
                onClick={() => setCategoria(c.slug)}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>
          <label className="relative flex w-full items-center lg:w-72">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar prenda o color"
              className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none transition-colors focus:border-foreground"
            />
          </label>
        </div>
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {filtered.length} productos
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-24 text-center text-sm text-muted-foreground">
          No encontramos prendas con ese criterio.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
