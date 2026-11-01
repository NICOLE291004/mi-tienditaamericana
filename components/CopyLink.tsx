"use client";

import { useState } from "react";

export default function CopyLink() {
  const [ok, setOk] = useState(false);

  async function copiar() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  }

  return (
    <button
      onClick={copiar}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-linea bg-white/60 px-6 py-3 text-sm transition hover:border-rosa"
    >
      {ok ? "¡Link copiado!" : "Copiar link"}
    </button>
  );
}
