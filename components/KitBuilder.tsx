"use client";

import Image from "next/image";
import { useState } from "react";
import { WhatsAppIcon } from "./icons";
import { estadoStock, precioMx, urlWhatsApp, type Producto } from "@/lib/tienda";

type Props = { productos: Producto[]; minimo: number; porcentaje: number };

export default function KitBuilder({ productos, minimo, porcentaje }: Props) {
  // slug -> cantidad
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const maximo = (p: Producto) => (p.unoPorKit ? 1 : Math.max(1, p.stock));

  function cambiar(p: Producto, delta: number) {
    setCantidades((c) => {
      const nueva = Math.min(maximo(p), Math.max(0, (c[p.slug] ?? 0) + delta));
      const { [p.slug]: _, ...resto } = c;
      void _;
      return nueva > 0 ? { ...resto, [p.slug]: nueva } : resto;
    });
  }

  const items = productos.filter((p) => cantidades[p.slug] > 0);
  const piezas = items.reduce((s, p) => s + cantidades[p.slug], 0);
  const subtotal = items.reduce((s, p) => s + p.precio * cantidades[p.slug], 0);
  const aplica = piezas >= minimo;
  const ahorro = aplica ? Math.round((subtotal * porcentaje) / 100) : 0;
  const total = subtotal - ahorro;
  const faltan = minimo - piezas;

  const mensaje = [
    "Hola, quiero armar un kit con:",
    ...items.map((p) => `- ${cantidades[p.slug]} x ${p.nombre} (${precioMx(p.precio)} c/u)`),
    "",
    aplica
      ? `Subtotal ${precioMx(subtotal)}, descuento ${porcentaje}% (-${precioMx(ahorro)}). Total: ${precioMx(total)}.`
      : `Total: ${precioMx(subtotal)}.`,
    "¿Siguen disponibles?",
  ].join("\n");

  return (
    <div className="pb-44">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {productos.map((p) => {
          const agotado = estadoStock(p.stock) === "agotado";
          const cant = cantidades[p.slug] ?? 0;
          const activo = cant > 0;
          return (
            <div key={p.slug}>
              <button
                disabled={agotado}
                onClick={() => cambiar(p, activo && p.unoPorKit ? -1 : activo ? 0 : 1)}
                aria-pressed={activo}
                aria-label={`${activo ? "Quitar" : "Agregar"} ${p.nombre}`}
                className="block w-full text-left disabled:cursor-not-allowed"
              >
                <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-nude ring-2 transition ${activo ? "ring-cacao" : "ring-transparent"}`}>
                  <Image src={p.fotos[0]} alt={`${p.marca} ${p.nombre}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className={`object-contain ${agotado ? "opacity-50 grayscale" : ""}`} />
                  <span className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-lg ${activo ? "bg-cacao text-crema" : "bg-white/90 text-cacao"}`}>
                    {agotado ? "–" : activo ? "✓" : "+"}
                  </span>
                </div>
                <div className="mt-3 space-y-0.5 px-0.5">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{p.marca}</p>
                  <h3 className="font-display text-lg leading-snug">{p.nombre}</h3>
                  <p className="font-medium">{agotado ? "Agotado" : precioMx(p.precio)}</p>
                </div>
              </button>

              {!agotado && !p.unoPorKit && activo && (
                <div className="mt-2 flex items-center justify-between rounded-full border border-linea bg-white/70 px-1 py-1">
                  <button onClick={() => cambiar(p, -1)} aria-label="Quitar una pieza" className="h-9 w-9 rounded-full text-xl hover:bg-nude">–</button>
                  <span className="text-sm font-medium">{cant}</span>
                  <button onClick={() => cambiar(p, 1)} disabled={cant >= maximo(p)} aria-label="Agregar una pieza" className="h-9 w-9 rounded-full text-xl hover:bg-nude disabled:opacity-30">+</button>
                </div>
              )}
              {!agotado && p.unoPorKit && <p className="mt-1 px-0.5 text-xs text-muted">Máximo 1 por kit</p>}
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-crema/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {piezas === 0 && <p className="text-muted">Elige {minimo} o más productos y llévate {porcentaje}% de descuento.</p>}
            {piezas > 0 && !aplica && (
              <p>
                <b>{piezas}</b> en tu kit · {precioMx(subtotal)} ·{" "}
                <span className="text-rosa-hondo">agrega {faltan} más para el {porcentaje}% de descuento</span>
              </p>
            )}
            {aplica && (
              <p>
                <b>{piezas}</b> en tu kit · <span className="text-muted line-through">{precioMx(subtotal)}</span>{" "}
                <b className="text-base">{precioMx(total)}</b> · <span className="text-emerald-700">¡{porcentaje}% de descuento aplicado!</span>
              </p>
            )}
          </div>
          <a
            href={items.length ? urlWhatsApp(mensaje) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!items.length}
            className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium ${items.length ? "bg-wa text-white" : "pointer-events-none bg-linea text-muted"}`}
          >
            <WhatsAppIcon className="h-5 w-5" /> Pedir mi kit por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
