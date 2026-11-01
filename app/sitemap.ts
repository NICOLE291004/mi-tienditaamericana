import type { MetadataRoute } from "next";
import { productos, urlAbsoluta } from "@/lib/tienda";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: urlAbsoluta("/") },
    { url: urlAbsoluta("/armar-kit") },
    ...productos.map((p) => ({ url: urlAbsoluta(`/producto/${p.slug}`) })),
  ];
}
