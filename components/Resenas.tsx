import Image from "next/image";
import type { Resena } from "@/lib/tienda";

export default function Resenas({ resenas }: { resenas: Resena[] }) {
  if (resenas.length === 0) return null;
  return (
    <section id="clientas" className="mx-auto mt-20 max-w-6xl scroll-mt-16 px-4">
      <h2 className="font-display text-center text-3xl">Clientas felices 💬</h2>
      <p className="mx-auto mt-1 max-w-md text-center text-muted">Lo que dicen quienes ya compraron.</p>
      <div className="sin-barra -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {resenas.map((r, i) => (
          <figure key={i} className="w-72 shrink-0 snap-center overflow-hidden rounded-2xl border border-linea bg-white/70 md:w-auto">
            {r.foto && (
              <div className="relative aspect-[3/4] bg-nude">
                <Image src={r.foto} alt={`Reseña de ${r.nombre}`} fill sizes="(min-width: 768px) 33vw, 288px" className="object-contain" />
              </div>
            )}
            <figcaption className="p-4">
              <p className="text-sm">“{r.texto}”</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{r.nombre}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
