import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Music2 } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { BRAND, waLink } from "@/lib/brand";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto JAILES · WhatsApp, ubicación y redes" },
      {
        name: "description",
        content:
          "Escríbenos por WhatsApp al +57 302 380 7521, visita nuestra ubicación en Google Maps o síguenos en Instagram y TikTok.",
      },
      { property: "og:title", content: "Contacto JAILES" },
      {
        property: "og:description",
        content: "Atención directa por WhatsApp y ubicación en Google Maps.",
      },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  const items = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: BRAND.whatsappNumber,
      href: waLink("Hola JAILES, quiero información de sus productos."),
    },
    { icon: MapPin, label: "Ubicación", value: "Ver ubicación en Maps", href: BRAND.mapsUrl },
    { icon: Instagram, label: "Instagram", value: BRAND.instagramUser, href: BRAND.instagramUrl },
    { icon: Music2, label: "TikTok", value: BRAND.tiktokUser, href: BRAND.tiktokUrl },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-14 sm:px-8">
      <Reveal>
        <p className="eyebrow">Contacto</p>
        <h1 className="mt-3 text-4xl sm:text-6xl">Hablemos directo</h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Todo se cotiza por WhatsApp: prendas, colores, tallas, estampados DTF y pedidos al por
          mayor.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 70}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-soft"
            >
              <item.icon className="h-5 w-5 text-bronze" />
              <div className="mt-10">
                <p className="eyebrow">{item.label}</p>
                <p className="mt-2 text-sm">{item.value}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 overflow-hidden border border-border">
        <iframe
          title="Ubicación de JAILES en Google Maps"
          src="https://www.google.com/maps?q=JAILES&output=embed"
          className="h-[420px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="underline">
          Abrir la ubicación oficial en Google Maps
        </a>
      </p>
    </div>
  );
}
