import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import heroImg from "@/assets/hero-jailes.jpg";
import telaMacro from "@/assets/tela-macro.jpg";
import dtfImg from "@/assets/dtf-estampado.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { APPAREL_CATEGORIES } from "@/lib/catalog";
import { mergeCategories, mergeProducts, settingText } from "@/lib/merge";
import { getSiteData } from "@/lib/store.functions";

export const Route = createFileRoute("/")({
  loader: () => getSiteData(),
  head: () => ({
    meta: [
      { title: "JAILES · Camisetas, ropa y estampados DTF al por mayor" },
      {
        name: "description",
        content:
          "Distribuidores de ropa y estampados DTF. Camisetas de algodón licrado, bermudas, pantalones y personalización por WhatsApp. Precios de mayorista.",
      },
      { property: "og:title", content: "JAILES · Ropa y estampados DTF" },
      {
        property: "og:description",
        content:
          "Calidad seria, atención directa y precios de mayorista. Camisetas y prendas personalizables con estampado DTF.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const products = mergeProducts(data);
  const categories = mergeCategories(data).filter((c) => APPAREL_CATEGORIES.includes(c.slug));
  const featured = [...products]
    .filter((p) => APPAREL_CATEGORIES.includes(p.categorySlug))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.stock - a.stock)
    .slice(0, 8);

  return (
    <>
      <Hero
        title={settingText(data, "hero_title", "Prendas que se sienten distintas")}
        subtitle={settingText(
          data,
          "hero_subtitle",
          "Distribuidores de ropa y estampados DTF. Calidad seria, atención directa y precios de mayorista.",
        )}
      />

      <QualitySection />

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Colecciones</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Categorías</h2>
          </div>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
          >
            Ver catálogo completo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link
                to="/catalogo"
                search={{ categoria: c.slug }}
                className="group block"
              >
                <div className="aspect-4/5 overflow-hidden bg-sand">
                  <img
                    src={c.image}
                    alt={c.name}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="font-display text-base">{c.name}</h3>
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-sand/50">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
          <Reveal>
            <p className="eyebrow">Selección</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Prendas destacadas</h2>
          </Reveal>
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CustomSection />
    </>
  );
}

function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  const [offset, setOffset] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setOffset(Math.min(window.scrollY, 700));
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const tags = [
    { label: "01 / 03", className: "left-[6%] top-[16%]", depth: 14 },
    { label: "Algodón licrado", className: "right-[8%] top-[26%]", depth: 22 },
    { label: "Alto gramaje", className: "left-[9%] bottom-[30%]", depth: 18 },
    { label: "Estampados DTF", className: "right-[12%] bottom-[18%]", depth: 26 },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto flex min-h-[86vh] max-w-[1400px] flex-col justify-center px-5 pb-16 pt-10 sm:px-8">
        <div className="anim-fade-up relative z-10 max-w-2xl">
          <p className="eyebrow">JAILES · Mayoristas</p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">{title}</h1>
          <span className="anim-line mt-7 block h-px w-32 bg-bronze" />
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="rounded-full bg-primary px-7 py-3.5 text-[12px] uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              Ver camisetas
            </Link>
            <Link
              to="/personaliza"
              className="rounded-full border border-foreground/25 px-7 py-3.5 text-[12px] uppercase tracking-[0.16em] transition-colors hover:border-foreground"
            >
              Personaliza la tuya
            </Link>
          </div>
        </div>

        <div
          className="anim-scale-in pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
          style={{ transform: `translate3d(${pointer.x * 8}px, ${-offset * 0.12}px, 0)` }}
        >
          <img
            src={heroImg}
            alt="Camisetas de algodón dobladas en tonos neutros"
            width={1600}
            height={1600}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-12 lg:hidden">
          <img
            src={heroImg}
            alt="Camisetas de algodón dobladas en tonos neutros"
            width={1600}
            height={1600}
            className="aspect-square w-full object-cover"
          />
        </div>

        {tags.map((tag) => (
          <span
            key={tag.label}
            className={`anim-fade pointer-events-none absolute hidden text-[10px] uppercase tracking-[0.24em] text-foreground/70 lg:block ${tag.className}`}
            style={{
              transform: `translate3d(${pointer.x * tag.depth}px, ${pointer.y * tag.depth}px, 0)`,
              animationDelay: "700ms",
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function QualitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className="border-y border-border bg-sand/40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
        <div className="overflow-hidden">
          <img
            src={telaMacro}
            alt="Detalle macro del tejido de algodón licrado"
            width={1600}
            height={1200}
            loading="lazy"
            className="aspect-4/3 w-full object-cover"
            style={{ transform: `scale(${1 + progress * 0.08})`, transition: "transform 120ms linear" }}
          />
        </div>
        <Reveal>
          <p className="eyebrow">La diferencia está en la tela</p>
          <h2 className="mt-4 text-3xl sm:text-5xl">Algodón licrado</h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Una camiseta pensada para sentirse diferente. Trabajamos con tela de algodón licrado y
            estampado DTF, con atención directa y precios de mayorista.
          </p>
          <ul className="mt-9 space-y-4 text-sm">
            {["Algodón licrado", "Estampados DTF", "Precios de mayorista", "Atención directa"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3 border-b border-border/70 pb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <Link
            to="/calidad"
            className="mt-9 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] hover:text-bronze"
          >
            Conocer la tela <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function CustomSection() {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2">
      <Reveal>
        <p className="eyebrow">Personalización</p>
        <h2 className="mt-4 text-3xl sm:text-5xl">Tu estampado, nuestra prenda</h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Elige la prenda, el color y la talla, cuéntanos qué quieres estampar y recibe la
          cotización por WhatsApp.
        </p>
        <ol className="mt-9 space-y-5">
          {[
            "Elige camiseta",
            "Elige color",
            "Elige talla",
            "Cuéntanos qué quieres estampar",
            "Envía tu solicitud por WhatsApp",
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-4">
              <span className="eyebrow pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ol>
        <Link
          to="/personaliza"
          className="mt-10 inline-flex rounded-full bg-primary px-7 py-3.5 text-[12px] uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
        >
          Personaliza la tuya
        </Link>
      </Reveal>
      <Reveal delay={100} className="overflow-hidden">
        <img
          src={dtfImg}
          alt="Prensa de estampado DTF sobre una camiseta blanca"
          width={1280}
          height={1024}
          loading="lazy"
          className="aspect-4/3 w-full object-cover"
        />
      </Reveal>
    </section>
  );
}
