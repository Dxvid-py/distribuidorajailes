import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Music2 } from "lucide-react";

import logo from "@/assets/logo-jailes.png";
import { Reveal } from "@/components/site/Reveal";
import { BRAND, waLink } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-border bg-sand/60">
      <Reveal className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logo} alt="JAILES" width={40} height={55} className="h-12 w-auto" loading="lazy" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {BRAND.description}
          </p>
        </div>

        <div>
          <p className="eyebrow">Navegación</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/catalogo" className="text-muted-foreground hover:text-foreground">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/calidad" className="text-muted-foreground hover:text-foreground">
                La diferencia está en la tela
              </Link>
            </li>
            <li>
              <Link to="/personaliza" className="text-muted-foreground hover:text-foreground">
                Personaliza la tuya
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="text-muted-foreground hover:text-foreground">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contacto</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={waLink("Hola JAILES, quiero información de sus productos.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" /> {BRAND.whatsappNumber}
              </a>
            </li>
            <li>
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <MapPin className="h-4 w-4" /> Ver ubicación en Maps
              </a>
            </li>
            <li>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-4 w-4" /> {BRAND.instagramUser}
              </a>
            </li>
            <li>
              <a
                href={BRAND.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Music2 className="h-4 w-4" /> {BRAND.tiktokUser}
              </a>
            </li>
          </ul>
        </div>
      </Reveal>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} JAILES</span>
          <Link to="/admin" className="hover:text-foreground">
            Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
