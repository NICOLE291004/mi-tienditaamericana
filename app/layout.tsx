import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Link from "next/link";
import FacebookPixel from "@/components/FacebookPixel";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { tienda } from "@/lib/tienda";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

export const metadata: Metadata = {
  metadataBase: new URL(tienda.sitioUrl),
  title: { default: `${tienda.nombre} | ${tienda.lema}`, template: `%s | ${tienda.nombre}` },
  description: `${tienda.lema}. Productos 100% originales de USA con entregas en ${tienda.ciudad}.`,
  openGraph: { siteName: tienda.nombre, locale: "es_MX", type: "website" },
};

export const viewport: Viewport = { themeColor: "#fbf6f3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-dvh antialiased">
        <header className="sticky top-0 z-30 border-b border-linea bg-crema/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {tienda.nombre}
            </Link>
            <nav className="flex shrink-0 gap-4 text-sm text-muted">
              <Link href="/#productos" className="hover:text-cacao">Productos</Link>
              <Link href="/armar-kit" className="font-medium text-rosa-hondo hover:text-cacao">Armar kit</Link>
              <Link href="/#como-comprar" className="hover:text-cacao">Cómo comprar</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-20 border-t border-linea bg-nude/60 px-4 py-10 text-center text-sm text-muted">
          <p className="font-display text-xl text-cacao">{tienda.nombre}</p>
          <p className="mt-1">{tienda.lema}</p>
          <p className="mt-1">{tienda.ciudad}</p>
        </footer>
        <WhatsAppFloat />
        <FacebookPixel />
      </body>
    </html>
  );
}
