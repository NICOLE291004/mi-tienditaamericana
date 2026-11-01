"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function Gallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);

  function irA(i: number) {
    const el = pista.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={pista}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActual(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="sin-barra flex snap-x snap-mandatory overflow-x-auto rounded-2xl bg-nude"
      >
        {fotos.map((src, i) => (
          <div key={src} className="relative aspect-[3/4] w-full shrink-0 snap-center md:aspect-[4/5]">
            <Image src={src} alt={`${alt} - foto ${i + 1}`} fill priority={i === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
          </div>
        ))}
      </div>
      {fotos.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => irA(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === actual ? "w-6 bg-cacao" : "w-2 bg-linea"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
