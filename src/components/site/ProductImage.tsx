import { cn } from "@/lib/utils";

/**
 * Fotografía final de estudio. Las variantes usan archivos terminados por color,
 * por lo que nunca se aplica un tinte que pueda alterar la etiqueta física.
 */
export function ProductImage({
  src,
  alt,
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
    </div>
  );
}
