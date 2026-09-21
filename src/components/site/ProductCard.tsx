import { Link } from "@tanstack/react-router";

import { ProductImage } from "@/components/site/ProductImage";
import { formatCOP, waLink, waProductMessage } from "@/lib/brand";
import { productColorImage } from "@/lib/catalog";
import type { StoreProduct } from "@/lib/merge";

export function ProductCard({ product }: { product: StoreProduct }) {
  const price = formatCOP(product.priceFrom);
  const colors = product.colors.slice(0, 6);

  return (
    <article className="group relative flex flex-col">
      <Link
        to="/producto/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-sand"
      >
        <ProductImage
          src={productColorImage(product.categorySlug, product.colors[0]?.name, product.image)}
          alt={product.name}
          className="aspect-4/5"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
        />
      </Link>

      <div className="relative mt-4 flex flex-1 flex-col">
        <span className="absolute -top-px left-0 h-px w-0 bg-bronze transition-all duration-500 group-hover:w-10" />
        <div className="flex items-start justify-between gap-3 pt-3">
          <div>
            <Link
              to="/producto/$slug"
              params={{ slug: product.slug }}
              className="font-display text-[15px] leading-snug"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {product.variantCount > 0
                ? `${product.variantCount} referencias`
                : "Referencia única"}
            </p>
          </div>
          {price && <p className="whitespace-nowrap text-sm font-medium">{price}</p>}
        </div>

        {colors.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            {colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > colors.length && (
              <span className="text-[11px] text-muted-foreground">
                +{product.colors.length - colors.length}
              </span>
            )}
          </div>
        )}

        {product.customizable && (
          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-bronze">
            Personalizable con DTF
          </p>
        )}

        <div className="mt-4 flex gap-2 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          <Link
            to="/producto/$slug"
            params={{ slug: product.slug }}
            className="flex-1 rounded-full border border-border px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-foreground"
          >
            Ver detalle
          </Link>
          <a
            href={waLink(waProductMessage(product.name))}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-primary-foreground"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
