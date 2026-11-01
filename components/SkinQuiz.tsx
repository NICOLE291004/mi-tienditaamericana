"use client";

import Image from "next/image";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { WhatsAppIcon } from "./icons";
import Link from "next/link";
import { precioMx, tienda, urlWhatsApp, type Producto } from "@/lib/tienda";

const tipos = [
  { id: "grasa", nombre: "Grasa", nota: "Brilla en toda la cara", img: "/piel/tipo-grasa.svg" },
  { id: "mixta", nombre: "Mixta", nota: "Frente y nariz brillan, mejillas normales o secas", img: "/piel/tipo-mixta.svg" },
  { id: "seca", nombre: "Seca", nota: "Se siente tirante o con descamación", img: "/piel/tipo-seca.svg" },
  { id: "normal", nombre: "Normal", nota: "Ni brilla ni se reseca", img: "/piel/tipo-normal.svg" },
];

const preocupaciones = [
  { id: "granitos", nombre: "Granitos", nota: "Bolitas rojas, a veces con punto blanco", img: "/piel/granitos.svg" },
  { id: "comedones", nombre: "Comedones", nota: "Puntitos negros o blancos en nariz y frente", img: "/piel/comedones.svg" },
  { id: "irritacion", nombre: "Irritación", nota: "Enrojecimiento, ardor o comezón", img: "/piel/irritacion.svg" },
  { id: "resequedad", nombre: "Resequedad", nota: "Escamitas y piel áspera", img: "/piel/resequedad.svg" },
  { id: "manchas", nombre: "Manchas", nota: "Zonas más oscuras o marcas", img: "/piel/manchas.svg" },
  { id: "envejecimiento", nombre: "Envejecimiento", nota: "Líneas finas, arrugas o piel sin firmeza", img: "/piel/envejecimiento.svg" },
];

function Opcion({ img, nombre, nota, activa, onClick }: { img: string; nombre: string; nota: string; activa: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activa}
      className={`overflow-hidden rounded-2xl border bg-white/70 text-left transition ${activa ? "border-cacao ring-2 ring-cacao" : "border-linea hover:border-rosa"}`}
    >
      <div className="relative aspect-[4/3] bg-nude">
        <Image src={img} alt={`Ilustración de piel: ${nombre}`} fill sizes="(min-width: 768px) 20vw, 45vw" className="object-cover" />
      </div>
      <div className="p-3">
        <p className="font-medium">{nombre}</p>
        <p className="text-xs text-muted">{nota}</p>
      </div>
    </button>
  );
}

export default function SkinQuiz({ productos }: { productos: Producto[] }) {
  const [tipo, setTipo] = useState<string | null>(null);
  const [cosas, setCosas] = useState<string[]>([]);
  const [paso, setPaso] = useState(1);

  const alternar = (id: string) => setCosas((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const reiniciar = () => { setTipo(null); setCosas([]); setPaso(1); };

  const resultados = productos
    .map((p) => ({
      p,
      // Producto "principal" para algo que marcó (ej. comedones → ácido salicílico): siempre va y va primero.
      principal: (p.principalPara ?? []).filter((x) => cosas.includes(x)).length,
      puntos: (p.paraPreocupaciones ?? []).filter((x) => cosas.includes(x)).length,
      sirveParaSuPiel: !!p.tiposDePiel?.includes(tipo ?? ""),
    }))
    .filter((r) => r.principal > 0 || (r.sirveParaSuPiel && (cosas.length === 0 || r.puntos > 0)))
    .sort((a, b) => b.principal - a.principal || b.puntos - a.puntos)
    .map((r) => r.p);

  const subtotal = resultados.reduce((s, p) => s + p.precio, 0);
  const totalKit = subtotal - Math.round((subtotal * tienda.kit.descuentoPorcentaje) / 100);
  const mensajeKit = [
    `Hola, el test de piel me recomendó estos productos y quiero armar mi kit (${tienda.kit.descuentoPorcentaje}% de descuento):`,
    ...resultados.map((p) => `- ${p.nombre}`),
    `Total: ${precioMx(totalKit)}. ¿Siguen disponibles?`,
  ].join("\n");

  const resumen =`Mi piel es ${tipo}${cosas.length ? ` y tengo ${cosas.join(", ")}` : ""}. ¿Qué me recomiendas?`;

  return (
    <div className="rounded-3xl border border-linea bg-nude/50 p-5 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-rosa-hondo">Paso {paso} de 3</p>
      {paso < 3 && (
        <p className="mt-1 text-xs text-muted">No es un diagnóstico oficial. Se recomienda acudir con un dermatólogo.</p>
      )}

      {paso === 1 && (
        <>
          <h3 className="font-display mt-1 text-2xl">¿Cómo describes tu piel?</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {tipos.map((t) => (
              <Opcion key={t.id} {...t} activa={tipo === t.id} onClick={() => setTipo(t.id)} />
            ))}
          </div>
          <button disabled={!tipo} onClick={() => setPaso(2)} className="mt-5 w-full rounded-full bg-cacao px-6 py-3 text-crema disabled:opacity-40 md:w-auto">
            Siguiente
          </button>
        </>
      )}

      {paso === 2 && (
        <>
          <h3 className="font-display mt-1 text-2xl">¿Qué notas en tu piel?</h3>
          <p className="text-sm text-muted">Puedes elegir más de una. Son ilustraciones para que te identifiques.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {preocupaciones.map((c) => (
              <Opcion key={c.id} {...c} activa={cosas.includes(c.id)} onClick={() => alternar(c.id)} />
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={() => setPaso(1)} className="rounded-full border border-linea px-6 py-3">Atrás</button>
            <button onClick={() => setPaso(3)} className="flex-1 rounded-full bg-cacao px-6 py-3 text-crema md:flex-none">
              {cosas.length ? "Ver recomendaciones" : "Ninguna, ver recomendaciones"}
            </button>
          </div>
        </>
      )}

      {paso === 3 && (
        <>
          <h3 className="font-display mt-1 text-2xl">Para tu piel {tipo}{cosas.length ? ` con ${cosas.join(", ")}` : ""}</h3>
          {resultados.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {resultados.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          ) : (
            <p className="mt-3 text-muted">Aún no tengo un producto exacto para esa combinación. Escríbeme y te lo busco.</p>
          )}
          {resultados.length > 0 && (
            <div className="mt-8 rounded-2xl border border-linea bg-white/70 p-5">
              {resultados.length >= tienda.kit.minimoProductos ? (
                <>
                  <p className="font-display text-xl">🎁 Llévate toda tu rutina en un kit</p>
                  <p className="mt-1 text-sm text-muted">
                    {resultados.length} productos con {tienda.kit.descuentoPorcentaje}% de descuento:{" "}
                    <span className="line-through">{precioMx(subtotal)}</span> <b className="text-cacao">{precioMx(totalKit)}</b>
                  </p>
                  <a href={urlWhatsApp(mensajeKit)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-cacao px-6 py-3 font-medium text-crema">
                    Quiero mi rutina con descuento
                  </a>
                </>
              ) : (
                <>
                  <p className="font-display text-xl">🎁 Arma tu kit y ahorra {tienda.kit.descuentoPorcentaje}%</p>
                  <p className="mt-1 text-sm text-muted">Con {tienda.kit.minimoProductos} o más productos tienes descuento. Suma estos y lo que más te guste.</p>
                  <Link href="/armar-kit" className="mt-3 inline-flex rounded-full bg-cacao px-6 py-3 font-medium text-crema">Armar mi kit</Link>
                </>
              )}
            </div>
          )}
          <p className="mt-6 rounded-xl bg-white/60 p-3 text-xs text-muted">
            ⚠️ Este test es solo una orientación general y <b>no es un diagnóstico oficial</b>. Se recomienda acudir con un dermatólogo, sobre todo si tienes
            acné fuerte, dolor o una irritación que no mejora.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a href={urlWhatsApp(resumen)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-wa px-6 py-3 font-medium text-white">
              <WhatsAppIcon className="h-5 w-5" /> Pedir asesoría por WhatsApp
            </a>
            <button onClick={reiniciar} className="rounded-full border border-linea px-6 py-3">Volver a empezar</button>
          </div>
        </>
      )}
    </div>
  );
}
