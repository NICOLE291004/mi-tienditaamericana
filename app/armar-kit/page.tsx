import type { Metadata } from "next";
import KitBuilder from "@/components/KitBuilder";
import { productos, tienda } from "@/lib/tienda";

export const metadata: Metadata = {
  title: `Arma tu kit y ahorra ${tienda.kit.descuentoPorcentaje}%`,
  description: `Elige ${tienda.kit.minimoProductos} o más productos y llévate ${tienda.kit.descuentoPorcentaje}% de descuento.`,
};

export default function ArmarKit() {
  const { minimoProductos, descuentoPorcentaje } = tienda.kit;
  return (
    <main className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="font-display text-4xl">Arma tu kit</h1>
      <p className="mb-6 mt-2 max-w-xl text-muted">
        Elige <b>{minimoProductos} o más productos</b> y llévate un <b>{descuentoPorcentaje}% de descuento</b> en tu kit. Toca los productos que quieras y
        pídelo por WhatsApp.
      </p>
      <KitBuilder productos={productos} minimo={minimoProductos} porcentaje={descuentoPorcentaje} />
    </main>
  );
}
