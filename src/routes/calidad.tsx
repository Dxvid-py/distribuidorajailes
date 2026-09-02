import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import telaMacro from "@/assets/tela-macro.jpg";
import telasImg from "@/assets/producto-telas.jpg";
import dtfImg from "@/assets/dtf-estampado.jpg";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/calidad")({
  head: () => ({
    meta: [
      { title: "La diferencia está en la tela · JAILES" },
      {
        name: "description",
        content:
          "Algodón licrado, alto gramaje y estampado DTF: por qué las prendas de JAILES se sienten distintas a una camiseta básica.",
      },
      { property: "og:title", content: "La diferencia está en la tela · JAILES" },
      {
        property: "og:description",
        content: "Algodón licrado y estampado DTF, con atención directa y precios de mayorista.",
      },
    ],
  }),
  component: Calidad,
});

function Calidad() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setP(1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-5 pt-14 sm:px-8">
        <Reveal>
          <p className="eyebrow">Calidad</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
            La diferencia está en la tela
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Una camiseta pensada para sentirse diferente. Trabajamos con algodón licrado y
            estampados DTF, con atención directa y precios de mayorista.
          </p>
        </Reveal>
      </section>

      <div ref={ref} className="mt-14 overflow-hidden">
        <img
          src={telaMacro}
          alt="Detalle macro del tejido de algodón licrado"
          width={1600}
          height={1200}
          className="h-[60vh] w-full object-cover"
          style={{ transform: `scale(${1.02 + p * 0.1})`, transition: "transform 120ms linear" }}
        />
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-3">
        {[
          {
            title: "Algodón licrado",
            body: "La tela base de nuestras camisetas y prendas: elástica, con caída natural y textura visible.",
          },
          {
            title: "Estampados DTF",
            body: "Servicio de estampado DTF sobre la prenda, disponible también como servicio independiente.",
          },
          {
            title: "Precios de mayorista",
            body: "Manejamos precio público y precio al por mayor sobre el mismo inventario.",
          },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <span className="hairline block w-full" />
            <h2 className="mt-6 font-display text-xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-border bg-sand/50">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <Reveal className="overflow-hidden">
            <img
              src={telasImg}
              alt="Rollos de tela en tonos neutros"
              width={1024}
              height={1280}
              loading="lazy"
              className="aspect-4/3 w-full object-cover"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">También distribuimos</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">Telas por rollo</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Rollos de tela de algodón licrado, burda y elásticos, disponibles dentro del mismo
              catálogo con sus colores reales.
            </p>
            <Link
              to="/catalogo"
              search={{ categoria: "telas" }}
              className="mt-8 inline-flex rounded-full border border-foreground/25 px-6 py-3 text-[12px] uppercase tracking-[0.16em] hover:border-foreground"
            >
              Ver telas
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Servicio</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Estampado DTF</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Estampamos sobre nuestras prendas o como servicio independiente. Cotiza tu diseño por
            WhatsApp.
          </p>
          <Link
            to="/personaliza"
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-[12px] uppercase tracking-[0.16em] text-primary-foreground"
          >
            Personaliza la tuya
          </Link>
        </Reveal>
        <Reveal delay={80} className="overflow-hidden">
          <img
            src={dtfImg}
            alt="Prensa de estampado DTF"
            width={1280}
            height={1024}
            loading="lazy"
            className="aspect-4/3 w-full object-cover"
          />
        </Reveal>
      </section>
    </div>
  );
}
