"use client";

import Script from "next/script";
import { useEffect } from "react";
import { tienda } from "@/lib/tienda";

type Fbq = (...args: unknown[]) => void;

/** Pixel de Facebook. Solo se activa si pones tu ID en data/tienda.json → facebookPixelId. */
export default function FacebookPixel() {
  const id = tienda.facebookPixelId?.trim();

  useEffect(() => {
    if (!id) return;
    // Cada toque a un botón de WhatsApp cuenta como "Contact" en Facebook.
    const alTocar = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a?.href.startsWith("https://wa.me/")) (window as unknown as { fbq?: Fbq }).fbq?.("track", "Contact");
    };
    document.addEventListener("click", alTocar);
    return () => document.removeEventListener("click", alTocar);
  }, [id]);

  if (!id) return null;
  return (
    <Script id="fb-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}
    </Script>
  );
}
