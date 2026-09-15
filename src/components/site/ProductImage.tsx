import { cn } from "@/lib/utils";

const LABEL_CLIPS: Array<[string, string]> = [
  ["producto-sueter-adulto", "polygon(47.4% 18.1%, 52.6% 18.1%, 52.6% 24.2%, 47.4% 24.2%)"],
  ["producto-sueter-nino", "polygon(47.2% 18.1%, 52.8% 18.1%, 52.8% 25%, 47.2% 25%)"],
  ["producto-bluson-dama", "polygon(47.2% 22.4%, 52.5% 22.4%, 52.5% 29.2%, 47.2% 29.2%)"],
  ["producto-bermuda-caballero", "polygon(46.6% 16.2%, 53.2% 16.2%, 53.2% 22.4%, 46.6% 22.4%)"],
  ["producto-bermuda-dama", "polygon(61.1% 16.4%, 69.1% 16.4%, 69.1% 24.2%, 61.1% 24.2%)"],
  ["producto-bermuda-nino", "polygon(46.4% 16.2%, 53.4% 16.2%, 53.4% 23.3%, 46.4% 23.3%)"],
];

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
  hex?: string | null | undefined;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const labelClip = LABEL_CLIPS.find(([file]) => src.includes(file))?.[1];
  const tinted = Boolean(hex && hex.toLowerCase() !== "#ffffff");

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
      {tinted && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-colors duration-700"
            style={{ backgroundColor: hex ?? undefined, mixBlendMode: "multiply", opacity: 0.82 }}
          />
          {labelClip && (
            <img
              src={src}
              alt=""
              width={1024}
              height={1280}
              aria-hidden="true"
              className={cn("pointer-events-none absolute inset-0 h-full w-full object-cover", imgClassName)}
              style={{ clipPath: labelClip }}
            />
          )}
        </>
      )}
    </div>
  );
}
