import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import Gallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/icons";
import {
  descuento,
  estadoStock,
  etiquetaStock,
  mensajeProducto,
  precioMx,
  productoPorSlug,
  productos,
  relacionados,
  tienda,
  urlAbsoluta,
  urlWhatsApp,
} from "@/lib/tienda";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  const titulo = `${p.nombre} – ${precioMx(p.precio)}`;
  const imagen = urlAbsoluta(p.fotos[0]);
  return {
    title: titulo,
    description: p.descripcionCorta,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: {
      type: "website",
      siteName: tienda.nombre,
      locale: "es_MX",
      title: titulo,
      description: `${p.marca} · ${p.tamano} · ${p.descripcionCorta}`,
      url: urlAbsoluta(`/producto/${p.slug}`),
      images: [{ url: imagen, alt: p.nombre }],
    },
    twitter: { card: "summary_large_image", title: titulo, description: p.descripcionCorta, images: [imagen] },
    other: { "product:price:amount": String(p.precio), "product:price:currency": "MXN" },
  };
}

const colorStock = {
  disponible: "bg-emerald-50 text-emerald-800",
  ultimas: "bg-rosa/20 text-rosa-hondo",
  agotado: "bg-nude text-muted",
};

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) notFound();

  const estado = estadoStock(p.stock);
  const desc = descuento(p);
  const agotado = estado === "agotado";
  const similares = relacionados(p);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:pb-0">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-cacao">Inicio</Link> / <span>{p.categoria}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Gallery fotos={p.fotos} alt={`${p.marca} ${p.nombre}`} />

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{p.marca} · {p.tamano}</p>
          <h1 className="font-display mt-1 text-4xl leading-tight">{p.nombre}</h1>

          <p className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-medium">{precioMx(p.precio)}</span>
            {desc > 0 && (
              <>
                <span className="text-lg text-muted line-through">{precioMx(p.precioAnterior!)}</span>
                <span className="rounded-full bg-rosa-hondo px-2.5 py-1 text-xs font-medium text-white">-{desc}%</span>
              </>
            )}
          </p>

          {desc > 0 && p.precioAnteriorDe && (
            <p className="mt-1 text-sm text-emerald-700">
              Precio en {p.precioAnteriorDe}: {precioMx(p.precioAnterior!)} · ¡Ahorras {precioMx(p.precioAnterior! - p.precio)}!
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <p className={`inline-block rounded-full px-3 py-1 text-sm ${colorStock[estado]}`}>{etiquetaStock[estado]}</p>
            {p.etiqueta && <p className="inline-block rounded-full bg-cacao px-3 py-1 text-sm text-crema">{p.etiqueta}</p>}
          </div>

          <p className="mt-5 text-muted">{p.descripcionCorta}</p>

          <div className="mt-6 space-y-3">
            {agotado ? (
              <button disabled className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-linea px-6 py-4 text-base font-medium text-muted">
                Agotado
              </button>
            ) : (
              <a
                href={urlWhatsApp(mensajeProducto(p))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-wa px-6 py-4 text-base font-medium text-white shadow-md shadow-wa/30 transition hover:brightness-105 active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Lo quiero
              </a>
            )}
            <CopyLink />
          </div>

          <ul className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
            {tienda.mensajesConfianza.map((m) => (
              <li key={m} className="rounded-full border border-linea px-3 py-1.5">✓ {m}</li>
            ))}
          </ul>

          <div className="mt-4 rounded-2xl bg-nude/60 p-4 text-sm">
            <p className="font-medium">📍 ¿Cómo te lo entregamos?</p>
            <ul className="mt-1 space-y-0.5 text-muted">
              {tienda.entregas.map((e) => (
                <li key={e.zona}>
                  <b className="text-cacao">{e.zona}:</b> {e.lugar}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-muted">Horarios y detalles por WhatsApp al apartar tu producto.</p>
          </div>

          <section className="mt-8">
            <h2 className="font-display text-2xl">Beneficios</h2>
            <ul className="mt-2 space-y-1.5">
              {p.beneficios.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-rosa-hondo">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="font-display text-2xl">Modo de uso</h2>
            <p className="mt-2 text-muted">{p.modoDeUso}</p>
          </section>
        </div>
      </div>

      {/* Barra fija en celular: el botón siempre a la mano */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-linea bg-crema/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-xs text-muted">{p.nombre}</p>
          <p className="text-lg font-medium">{precioMx(p.precio)}</p>
        </div>
        {agotado ? (
          <span className="rounded-full bg-linea px-6 py-3 font-medium text-muted">Agotado</span>
        ) : (
          <a
            href={urlWhatsApp(mensajeProducto(p))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full bg-wa px-6 py-3 font-medium text-white active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5" /> Lo quiero
          </a>
        )}
      </div>

      {similares.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-5 text-3xl">También te puede gustar</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {similares.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
