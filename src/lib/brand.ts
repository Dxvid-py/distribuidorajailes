/**
 * Datos oficiales de JAILES.
 * NO inventar ni reemplazar por información ficticia.
 */
export const BRAND = {
  name: "JAILES",
  tagline: "Distribuidores de ropa y estampados DTF",
  description:
    "Distribuidores de ropa y estampados DTF. Calidad seria, atención directa y precios de mayorista.",
  whatsappNumber: "+57 302 380 7521",
  whatsappDigits: "573023807521",
  instagramUser: "@camisetas_jailes",
  instagramUrl: "https://instagram.com/camisetas_jailes",
  tiktokUser: "@jaimemarimoncastr",
  tiktokUrl: "https://tiktok.com/@jaimemarimoncastr",
  mapsUrl: "https://maps.app.goo.gl/DMnQszggQdKDd8kH9",
  logoUrl: "https://i.ibb.co/5g9fWdvr/Logo-Jailes.png",
} as const;

export function waLink(message: string, number = BRAND.whatsappDigits) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function waProductMessage(product: string, color?: string | null, size?: string | null) {
  let msg = `Hola JAILES, quiero cotizar ${product}.`;
  if (color) msg += `\nColor: ${color}`;
  if (size) msg += `\nTalla: ${size}`;
  return msg;
}

export function waCustomMessage(parts: {
  product?: string;
  color?: string;
  size?: string;
  quantity?: string;
  idea?: string;
}) {
  return [
    "Hola JAILES, quiero cotizar una camiseta personalizada.",
    parts.product ? `Tipo: ${parts.product}` : null,
    parts.color ? `Color: ${parts.color}` : null,
    parts.size ? `Talla: ${parts.size}` : null,
    parts.quantity ? `Cantidad: ${parts.quantity}` : null,
    parts.idea ? `Estampado: ${parts.idea}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatCOP(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
