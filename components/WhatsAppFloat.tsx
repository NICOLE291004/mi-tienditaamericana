"use client";

import { usePathname } from "next/navigation";
import { tienda, urlWhatsApp } from "@/lib/tienda";
import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat() {
  // En "Armar kit" ya hay una barra inferior con su propio botón de WhatsApp.
  const ruta = usePathname();
  if (ruta === "/armar-kit") return null;
  // En celular, la página de producto ya tiene su barra fija con "Lo quiero".
  const soloEscritorio = ruta.startsWith("/producto/");
  return (
    <a
      href={urlWhatsApp(`Hola, vi ${tienda.nombre} y me gustaría más información.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`fixed bottom-5 right-5 z-40 ${soloEscritorio ? "hidden md:flex" : "flex"} h-14 w-14 items-center justify-center rounded-full bg-wa text-white shadow-lg shadow-black/20 transition hover:brightness-105 active:scale-95`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
