# Mi Tiendita Americana

Tienda en línea (catálogo + compra por WhatsApp). Sin base de datos ni pagos en línea.

## Lo que editas (sin tocar código)

- `data/tienda.json` → nombre, lema, número de WhatsApp (`52` + 10 dígitos, sin `+`), URL del sitio, mensajes de confianza y pasos de "Cómo comprar".
- En `data/tienda.json`, el bloque `kit` controla "Armar kit": `minimoProductos` (4 = más de 3) y `descuentoPorcentaje` (10).
- `facebookPixelId` en `data/tienda.json`: pega aquí el ID de tu pixel de Facebook (solo números) y se activa solo, contando también los toques a WhatsApp. Vacío = apagado.
- `entregas` en `data/tienda.json`: puntos de entrega y horarios que se muestran en el inicio y en cada producto.
- `etiqueta` en un producto (ej. "Nuevo", "Más vendido") pone una insignia en la foto.
- `principalPara` en un producto: si en el test de piel marcan eso (ej. `["comedones"]`), el producto siempre se recomienda y sale primero.
- `data/kits.json` → kits ya armados del inicio. Cada kit lista los `slug` de sus productos; el precio y el descuento se calculan solos.
- `data/resenas.json` → reseñas reales de clientas (con captura opcional en `public/resenas/`). Si está vacío, la sección no se muestra.
- En `data/productos.json`, `"regalo": true` hace que el producto salga en el filtro "Regalos".
- `data/productos.json` → categorías y productos.
- `public/productos/` → fotos. En el JSON se escriben como `/productos/mi-foto.jpg`.

### Campos de un producto

`nombre`, `marca`, `categoria` (debe existir en `categorias`), `precio`, `precioAnterior` (opcional), `tamano`,
`descripcionCorta`, `beneficios` (lista), `modoDeUso`, `stock`, `fotos` (lista).
La URL se crea sola: "Sérum Vitamina C" → `/producto/serum-vitamina-c`. (Opcional: campo `slug` para fijarla.)

Stock: más de 3 = "Disponible", de 1 a 3 = "¡Últimas piezas!", 0 = "Agotado" (botón desactivado).

## Comandos

```bash
npm install     # una sola vez
npm run dev     # ver el sitio en http://localhost:3000
npm run build   # revisar que todo compila antes de publicar
```

## Importante para compartir en Messenger/WhatsApp

Facebook y WhatsApp solo muestran la vista previa con fotos **.jpg, .png o .webp** (no .svg).
Las fotos de ejemplo son .svg: cámbialas por tus fotos reales. Y `sitioUrl` en `tienda.json` debe ser tu dominio real.
