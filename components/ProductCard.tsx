import Image from "next/image";
import Link from "next/link";
import { descuento, estadoStock, etiquetaStock, precioMx, type Producto } from "@/lib/tienda";

const colorStock = {
  disponible: "text-emerald-700",
  ultimas: "text-rosa-hondo",
  agotado: "text-muted",
};

export default function ProductCard({ p }: { p: Producto }) {
  const estado = estadoStock(p.stock);
  const desc = descuento(p);
  return (
    <Link href={`/producto/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-nude">
        <Image
          src={p.fotos[0]}
          alt={`${p.marca} ${p.nombre}`}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={`object-contain transition duration-500 group-hover:scale-105 ${estado === "agotado" ? "opacity-60 grayscale" : ""}`}
        />
        {p.etiqueta && estado !== "agotado" && (
          <span className="absolute right-2 top-2 rounded-full bg-cacao px-2.5 py-1 text-xs font-medium text-crema">{p.etiqueta}</span>
        )}
        {desc > 0 && estado !== "agotado" && (
          <span className="absolute left-2 top-2 rounded-full bg-rosa-hondo px-2.5 py-1 text-xs font-medium text-white">-{desc}%</span>
        )}
      </div>
      <div className="mt-3 space-y-0.5 px-0.5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{p.marca}</p>
        <h3 className="font-display text-lg leading-snug">{p.nombre}</h3>
        <p className="flex items-baseline gap-2">
          <span className="font-medium">{precioMx(p.precio)}</span>
          {desc > 0 && <span className="text-sm text-muted line-through">{precioMx(p.precioAnterior!)}</span>}
        </p>
        <p className={`text-xs ${colorStock[estado]}`}>{etiquetaStock[estado]}</p>
      </div>
    </Link>
  );
}
