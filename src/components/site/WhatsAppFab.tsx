import { MessageCircle } from "lucide-react";

import { waLink } from "@/lib/brand";

export function WhatsAppFab() {
  return (
    <a
      href={waLink("Hola JAILES, quiero información de sus productos.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform duration-300 hover:-translate-y-1 sm:h-13 sm:w-13"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
