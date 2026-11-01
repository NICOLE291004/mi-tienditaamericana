import Link from "next/link";
import KitCard from "@/components/KitCard";
import ProductExplorer from "@/components/ProductExplorer";
import Resenas from "@/components/Resenas";
import SkinQuiz from "@/components/SkinQuiz";
import { categorias, kitsListos, productos, resenas, tienda } from "@/lib/tienda";

export default function Inicio() {
  const kits = kitsListos().filter((k) => k.items.length > 0);
  return (
    <main>
      <section className="bg-gradient-to-b from-nude to-crema px-4 pb-10 pt-12 text-center md:pt-20">
        <p className="text-xs uppercase tracking-[0.25em] text-rosa-hondo">Directo de USA a {tienda.ciudad.split(",")[0]}</p>
        <h1 className="font-display mx-auto mt-3 max-w-2xl text-5xl font-medium leading-[1.05] md:text-7xl">{tienda.nombre}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{tienda.lema}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#mi-piel"
            className="inline-block rounded-full bg-cacao px-7 py-3.5 text-base font-medium text-crema shadow-md shadow-black/10 transition hover:bg-rosa-hondo active:scale-[0.98]"
          >
            🌸 Haz tu test de piel gratis
          </a>
          <Link
            href="/armar-kit"
            className="inline-block rounded-full border-2 border-cacao px-7 py-3 text-base font-medium transition hover:bg-cacao hover:text-crema active:scale-[0.98]"
          >
            🎁 Armar kit · {tienda.kit.descuentoPorcentaje}% de descuento
          </Link>
        </div>
        <ul className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          {tienda.mensajesConfianza.map((m) => (
            <li key={m} className="rounded-full border border-linea bg-white/70 px-4 py-2">
              <span className="mr-1.5 text-rosa-hondo">✓</span>
              {m}
            </li>
          ))}
        </ul>
      </section>

      {kits.length > 0 && (
        <section id="kits" className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-6">
          <h2 className="font-display text-3xl">Kits listos con {tienda.kit.descuentoPorcentaje}% de descuento</h2>
          <p className="mb-5 mt-1 text-muted">Ya armados para que no tengas que pensarle. Pídelos con un toque por WhatsApp.</p>
          <div className="grid gap-5 md:grid-cols-3">
            {kits.map((k) => (
              <KitCard key={k.nombre} kit={k} />
            ))}
          </div>
        </section>
      )}

      <section id="productos" className="mx-auto mt-16 max-w-6xl scroll-mt-16 px-4">
        <h2 className="font-display mb-5 text-3xl">Nuestros productos</h2>
        <ProductExplorer productos={productos} categorias={categorias} />
      </section>

      <section id="mi-piel" className="mx-auto mt-16 max-w-6xl scroll-mt-16 px-4">
        <h2 className="font-display mb-1 text-3xl">Saber qué productos son adecuados para mi piel</h2>
        <p className="mb-5 text-muted">Responde 2 preguntitas y te mostramos lo que mejor te puede funcionar.</p>
        <SkinQuiz productos={productos} />
      </section>

      <Resenas resenas={resenas} />

      <section id="como-comprar" className="mx-auto mt-20 max-w-4xl scroll-mt-16 px-4">
        <h2 className="font-display text-center text-3xl">Cómo comprar</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {tienda.comoComprar.map((paso, i) => (
            <li key={paso.titulo} className="rounded-2xl border border-linea bg-white/60 p-6 text-center">
              <span className="font-display text-4xl text-rosa">{i + 1}</span>
              <h3 className="mt-2 font-medium">{paso.titulo}</h3>
              <p className="mt-1 text-sm text-muted">{paso.texto}</p>
            </li>
          ))}
        </ol>
        <h3 className="font-display mt-10 text-center text-2xl">Puntos de entrega en Hermosillo 📍</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {tienda.entregas.map((e) => (
            <div key={e.zona} className="rounded-2xl border border-linea bg-white/60 p-5">
              <p className="font-medium">{e.zona}</p>
              <p className="text-sm text-muted">{e.lugar}</p>
              <ul className="mt-2 space-y-0.5 text-sm">
                {e.horarios.map((h) => (
                  <li key={h}>🕒 {h}</li>
                ))}
                {e.horarios.length === 0 && <li className="text-muted">Horario por confirmar por WhatsApp</li>}
              </ul>
            </div>
          ))}
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {tienda.reglas.map((r) => (
            <li key={r.titulo} className="rounded-2xl bg-nude/60 p-4 text-sm">
              <p className="font-medium">✓ {r.titulo}</p>
              <p className="mt-0.5 text-muted">{r.texto}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
