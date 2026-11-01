"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Producto } from "@/lib/tienda";

const REGALOS = "🎁 Regalos";

export default function ProductExplorer({ productos, categorias }: { productos: Producto[]; categorias: string[] }) {
  const [cat, setCat] = useState("Todos");
  const hayRegalos = productos.some((p) => p.regalo);
  const visibles =
    cat === "Todos" ? productos : cat === REGALOS ? productos.filter((p) => p.regalo) : productos.filter((p) => p.categoria === cat);
  const filtros = ["Todos", ...(hayRegalos ? [REGALOS] : []), ...categorias];
  return (
    <div>
      <div className="sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Categorías">
        {filtros.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm transition ${
              cat === c ? "border-cacao bg-cacao text-crema" : "border-linea bg-white/60 text-cacao hover:border-rosa"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {visibles.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
      {visibles.length === 0 && <p className="py-12 text-center text-muted">Pronto tendremos productos en esta categoría.</p>}
    </div>
  );
}
