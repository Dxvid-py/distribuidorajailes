import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductImage } from "@/components/site/ProductImage";
import { Reveal } from "@/components/site/Reveal";
import { formatCOP, waLink, waProductMessage } from "@/lib/brand";
import { loadVariants, productColorImage, stockLevel, type CatalogVariant } from "@/lib/catalog";
import { mergeProducts, mergeVariants } from "@/lib/merge";
import { getSiteData } from "@/lib/store.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/producto/$slug")({
  loader: async ({ params }) => {
    const data = await getSiteData();
    const product = mergeProducts(data).find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { data, product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Producto no disponible · JAILES" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const description =
      product.description ??
      `${product.name} de JAILES. Colores y tallas disponibles según inventario. Cotiza por WhatsApp.`;
    return {
      meta: [
        { title: `${product.name} · JAILES` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} · JAILES` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { data, product } = Route.useLoaderData();
  const [variants, setVariants] = useState<CatalogVariant[] | null>(null);
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadVariants(product.slug).then((base) => {
      if (alive) setVariants(mergeVariants(base, data?.variants ?? [], product.slug));
    });
    return () => {
      alive = false;
    };
  }, [product.slug, data]);

  const colorVariants = useMemo(
    () => (variants ?? []).filter((v) => (color ? v.color === color : true)),
    [variants, color],
  );

  const sizes = useMemo(() => {
    const set = new Map<string, number>();
    for (const v of colorVariants) {
      if (!v.size) continue;
      set.set(v.size, (set.get(v.size) ?? 0) + v.stock);
    }
    return [...set.entries()];
  }, [colorVariants]);

  const selected = colorVariants.find((v) => (size ? v.size === size : true));
  const price = formatCOP(selected?.price ?? product.priceFrom);
  const wholesale = formatCOP(selected?.wholesale ?? product.wholesaleFrom);
  const selectedImage = productColorImage(product.categorySlug, color, product.image);
  const stock = selected?.stock ?? product.stock;
  const level = stockLevel(stock);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-8 sm:px-8">
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="anim-scale-in">
          <ProductImage
            src={selectedImage}
            alt={product.name}
            priority
            className="aspect-4/5 w-full"
          />
          {product.gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.gallery.slice(0, 4).map((g) => (
                <img key={g} src={g} alt={product.name} loading="lazy" className="aspect-square w-full object-cover" />
              ))}
            </div>
          )}
        </div>

        <Reveal>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-5xl">{product.name}</h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-4">
            {price ? (
              <span className="text-2xl font-medium">{price}</span>
            ) : (
              <span className="text-sm text-muted-foreground">Precio por WhatsApp</span>
            )}
            {wholesale && (
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Mayorista {wholesale}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <span className="hairline mt-8 block w-full" />

          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow">Color · {color ?? "Selecciona"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => {
                      setColor(c.name);
                      setSize(null);
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full border transition-transform duration-300 hover:scale-110",
                      color === c.name ? "border-foreground ring-1 ring-foreground/30 ring-offset-2" : "border-border",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow">Talla</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map(([s, qty]) => (
                  <button
                    key={s}
                    type="button"
                    disabled={qty <= 0}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors",
                      size === s ? "border-foreground bg-foreground text-background" : "border-border",
                      qty <= 0 && "cursor-not-allowed text-muted-foreground line-through opacity-50",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                level === "disponible" && "bg-emerald-500",
                level === "poco" && "bg-amber-500",
                level === "agotado" && "bg-red-500",
              )}
            />
            {level === "disponible" ? "Disponible" : level === "poco" ? "Poco stock" : "Agotado"}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={waLink(waProductMessage(product.name, color, size))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[12px] uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" /> Cotizar por WhatsApp
            </a>
            {product.customizable && (
              <Link
                to="/personaliza"
                search={{ producto: product.slug }}
                className="rounded-full border border-foreground/25 px-7 py-3.5 text-[12px] uppercase tracking-[0.16em] hover:border-foreground"
              >
                Personalizar
              </Link>
            )}
          </div>

          {variants && (
            <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {variants.length} referencias en inventario
            </p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
