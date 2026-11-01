import tiendaJson from "@/data/tienda.json";
import productosJson from "@/data/productos.json";
import kitsJson from "@/data/kits.json";
import resenasJson from "@/data/resenas.json";

export const tienda = tiendaJson;

export type Producto = {
  nombre: string;
  slug: string;
  marca: string;
  categoria: string;
  precio: number;
  precioAnterior?: number;
  tamano: string;
  descripcionCorta: string;
  beneficios: string[];
  modoDeUso: string;
  stock: number;
  fotos: string[];
  /** Opcional: texto de insignia, por ejemplo "Nuevo" o "Más vendido" */
  etiqueta?: string;
  /** Opcional: true = aparece en el filtro "Regalos" */
  regalo?: boolean;
  /** Opcional: true = en "Armar kit" solo se puede elegir 1 pieza (bodys, masajeadoras) */
  unoPorKit?: boolean;
  /** Opcional, para el test de piel: si la persona marca alguna de estas, el producto siempre se recomienda y sale primero (ej. comedones → ácido salicílico) */
  principalPara?: string[];
  /** Opcional, para el test de piel: grasa, mixta, seca, normal */
  tiposDePiel?: string[];
  /** Opcional, para el test de piel: granitos, comedones, irritacion, resequedad, manchas */
  paraPreocupaciones?: string[];
};

type ProductoJson = Omit<Producto, "slug"> & { slug?: string };

export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const categorias: string[] = productosJson.categorias;

export const productos: Producto[] = (productosJson.productos as ProductoJson[]).map((p) => ({
  ...p,
  slug: p.slug ? slugify(p.slug) : slugify(p.nombre),
}));

export function productoPorSlug(slug: string) {
  return productos.find((p) => p.slug === slug);
}

export function relacionados(p: Producto, max = 4) {
  const otros = productos.filter((x) => x.slug !== p.slug);
  const misma = otros.filter((x) => x.categoria === p.categoria);
  const resto = otros.filter((x) => x.categoria !== p.categoria);
  return [...misma, ...resto].slice(0, max);
}

export type EstadoStock = "disponible" | "ultimas" | "agotado";

export function estadoStock(stock: number): EstadoStock {
  if (stock <= 0) return "agotado";
  if (stock <= 3) return "ultimas";
  return "disponible";
}

export const etiquetaStock: Record<EstadoStock, string> = {
  disponible: "Disponible",
  ultimas: "¡Últimas piezas!",
  agotado: "Agotado",
};

export function precioMx(n: number) {
  return `$${n.toLocaleString("es-MX")}`;
}

export function descuento(p: Producto) {
  if (!p.precioAnterior || p.precioAnterior <= p.precio) return 0;
  return Math.round((1 - p.precio / p.precioAnterior) * 100);
}

export function urlWhatsApp(mensaje: string) {
  return `https://wa.me/${tienda.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeProducto(p: Producto) {
  return `Hola, me interesa el ${p.nombre} de ${precioMx(p.precio)}. ¿Sigue disponible?`;
}

export function urlAbsoluta(ruta: string) {
  return new URL(ruta, tienda.sitioUrl).toString();
}

// ---- Kits listos ----
type KitJson = { nombre: string; descripcion: string; regalo?: boolean; productos: string[] };

export function kitsListos() {
  return (kitsJson.kits as KitJson[]).map((k) => {
    const items = k.productos.map((s) => productoPorSlug(s)).filter((p): p is Producto => !!p);
    const subtotal = items.reduce((s, p) => s + p.precio, 0);
    const ahorro = Math.round((subtotal * tienda.kit.descuentoPorcentaje) / 100);
    return {
      ...k,
      items,
      subtotal,
      ahorro,
      total: subtotal - ahorro,
      disponible: items.length > 0 && items.every((p) => p.stock > 0),
    };
  });
}

export type Resena = { nombre: string; texto: string; foto?: string };
export const resenas: Resena[] = resenasJson.resenas as Resena[];
