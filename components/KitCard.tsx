import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "./icons";
import { precioMx, tienda, urlWhatsApp, type Producto } from "@/lib/tienda";

type Kit = {
  nombre: string;
  descripcion: string;
  regalo?: boolean;
  items: Producto[];
  subtotal: number;
  ahorro: number;
  total: number;
  disponible: boolean;
};

export default function KitCard({ kit }: { kit: Kit }) {
  const mensaje = [
    `Hola, me interesa el kit "${kit.nombre}" con:`,
    ...kit.items.map((p) => `- ${p.nombre}`),
    "",
    `Total con ${tienda.kit.descuentoPorcentaje}% de descuento: ${precioMx(kit.total)}. ¿Sigue disponible?`,
  ].join("\n");

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-linea bg-white/70">
      <div className="grid grid-cols-4 gap-px bg-linea">
        {kit.items.slice(0, 4).map((p) => (
          <Link key={p.slug} href={`/producto/${p.slug}`} className="relative aspect-[3/4] bg-nude">
            <Image src={p.fotos[0]} alt={p.nombre} fill sizes="(min-width: 768px) 8vw, 22vw" className="object-cover" />
          </Link>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {kit.regalo && <span className="mb-2 w-fit rounded-full bg-rosa/20 px-3 py-1 text-xs text-rosa-hondo">🎁 Ideal para regalar</span>}
        <h3 className="font-display text-2xl leading-tight">{kit.nombre}</h3>
        <p className="mt-1 text-sm text-muted">{kit.descripcion}</p>
        <ul className="mt-3 space-y-1 text-sm">
          {kit.items.map((p) => (
            <li key={p.slug} className="flex gap-2">
              <span className="text-rosa-hondo">✓</span>
              <Link href={`/producto/${p.slug}`} className="hover:underline">{p.nombre}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-medium">{precioMx(kit.total)}</span>
            <span className="text-muted line-through">{precioMx(kit.subtotal)}</span>
            <span className="rounded-full bg-rosa-hondo px-2.5 py-1 text-xs font-medium text-white">-{tienda.kit.descuentoPorcentaje}%</span>
          </p>
          {kit.disponible ? (
            <a
              href={urlWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-3.5 font-medium text-white transition hover:brightness-105 active:scale-[0.99]"
            >
              <WhatsAppIcon className="h-5 w-5" /> Quiero este kit
            </a>
          ) : (
            <button disabled className="mt-3 w-full cursor-not-allowed rounded-full bg-linea px-6 py-3.5 font-medium text-muted">
              Agotado por ahora
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
