import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductImage } from "@/components/site/ProductImage";
import { Reveal } from "@/components/site/Reveal";
import { waCustomMessage, waLink } from "@/lib/brand";
import { APPAREL_CATEGORIES, loadVariants, type CatalogVariant } from "@/lib/catalog";
import { mergeProducts } from "@/lib/merge";
import { getSiteData } from "@/lib/store.functions";
import { cn } from "@/lib/utils";

type Search = { producto?: string };

export const Route = createFileRoute("/personaliza")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(typeof search["producto"] === "string" ? { producto: search["producto"] } : {}),
  }),
  loader: () => getSiteData(),
  head: () => ({
    meta: [
      { title: "Personaliza tu camiseta · JAILES" },
      {
        name: "description",
        content:
          "Elige prenda, color y talla, cuéntanos tu estampado DTF y envía la solicitud por WhatsApp. Cotización rápida y directa.",
      },
      { property: "og:title", content: "Personaliza tu camiseta · JAILES" },
      {
        property: "og:description",
        content: "Configura tu prenda personalizada y cotiza por WhatsApp con JAILES.",
      },
    ],
  }),
  component: Personaliza,
});

function Personaliza() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const products = useMemo(
    () => mergeProducts(data).filter((p) => APPAREL_CATEGORIES.includes(p.categorySlug) && p.customizable),
    [data],
  );

  const [slug, setSlug] = useState(search.producto ?? products[0]?.slug ?? "");
  const product = products.find((p) => p.slug === slug) ?? products[0];
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [idea, setIdea] = useState("");
  const [variants, setVariants] = useState<CatalogVariant[]>([]);

  useEffect(() => {
    if (!product) return;
    setColor("");
    setSize("");
    let alive = true;
    loadVariants(product.slug).then((v) => alive && setVariants(v));
    return () => {
      alive = false;
    };
  }, [product?.slug]);

  const sizes = useMemo(() => {
    const set = new Set<string>();
    for (const v of variants) if (v.size && (!color || v.color === color)) set.add(v.size);
    return [...set];
  }, [variants, color]);

  const message = waCustomMessage({
    ...(product?.name ? { product: product.name } : {}),
    ...(color ? { color } : {}),
    ...(size ? { size } : {}),
    ...(quantity ? { quantity } : {}),
    ...(idea ? { idea } : {}),
  });

  const steps = [
    { n: "01", label: "Elige camiseta" },
    { n: "02", label: "Elige color" },
    { n: "03", label: "Elige talla" },
    { n: "04", label: "Cuéntanos tu estampado" },
    { n: "05", label: "Envía por WhatsApp" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-14 sm:px-8">
      <Reveal>
        <p className="eyebrow">Personalización</p>
        <h1 className="mt-3 text-4xl sm:text-6xl">Quiero mi camiseta personalizada</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Configura tu prenda y envíanos la solicitud. Por ahora todo se cotiza por WhatsApp.
        </p>
      </Reveal>

      <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        {steps.map((s) => (
          <li key={s.n} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
            <span className="text-bronze">{s.n}</span>
            <span className="text-muted-foreground">{s.label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          {product && (
            <ProductImage
              src={product.image}
              alt={product.name}
              hex={product.colors.find((c) => c.name === color)?.hex}
              className="aspect-4/5 w-full"
              priority
            />
          )}
        </div>

        <div>
          <Field label="01 · Prenda">
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          {product && product.colors.length > 0 && (
            <Field label="02 · Color">
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => setColor(c.name === color ? "" : c.name)}
                    className={cn(
                      "h-8 w-8 rounded-full border transition-transform hover:scale-110",
                      color === c.name ? "border-foreground ring-1 ring-foreground/30 ring-offset-2" : "border-border",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </Field>
          )}

          {sizes.length > 0 && (
            <Field label="03 · Talla">
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s === size ? "" : s)}
                    className={cn(
                      "min-w-12 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em]",
                      size === s ? "border-foreground bg-foreground text-background" : "border-border",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field label="Cantidad aproximada (opcional)">
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputMode="numeric"
              placeholder="Ej. 20 unidades"
              className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
            />
          </Field>

          <Field label="04 · Cuéntanos qué quieres estampar">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value.slice(0, 600))}
              rows={5}
              placeholder="Describe tu diseño, texto, logo o referencia."
              className="w-full border border-border bg-background p-3 text-sm outline-none focus:border-foreground"
            />
          </Field>

          <div className="mt-8 border border-border bg-sand/50 p-5">
            <p className="eyebrow">Vista previa del mensaje</p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-muted-foreground">
              {message}
            </pre>
          </div>

          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[12px] uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" /> 05 · Enviar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="eyebrow mb-3">{label}</p>
      {children}
    </div>
  );
}
