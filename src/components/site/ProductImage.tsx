import { cn } from "@/lib/utils";

/**
 * Fotografía de estudio de la prenda. Como el modelo es el mismo y sólo cambia
 * el color, se aplica el tono real de la variante sobre la prenda blanca para
 * previsualizar el color sin inventar fotografías distintas.
 */
export function ProductImage({
  src,
  alt,
  hex,
  className,
  imgClassName,
  priority = false,
}: {
  src: string;
  alt: string;
  hex?: string | null;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      <img
        src={src}
        alt={alt}
        width={1024}
        height={1280}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
      {hex && hex.toLowerCase() !== "#ffffff" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: hex, mixBlendMode: "multiply", opacity: 0.82 }}
        />
      )}
    </div>
  );
}
