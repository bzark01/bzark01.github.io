# Imágenes de proyectos

Cada subcarpeta corresponde a un proyecto del portafolio. Las páginas de detalle
esperan **5 imágenes** numeradas del `1` al `5` con extensión `.png`.

## Estructura

```
images/projects/
├── casashare/             → projects/casashare.html
├── odoo-hub/              → projects/odoo-hub.html
├── nomina-cr/             → projects/nomina-cr.html
├── comisiones-ventas/     → projects/comisiones-ventas.html
├── asistente-ia-odoo/     → projects/asistente-ia-odoo.html
└── jornadas-laborales/    → projects/jornadas-laborales.html
```

## Cómo agregar imágenes

1. Toma capturas/mockups del módulo o app (ideal: ratio 16:9, mínimo 1280×720 px).
2. Guarda 5 imágenes por proyecto con estos nombres exactos:
   - `1.png`, `2.png`, `3.png`, `4.png`, `5.png`
3. Colócalas en la carpeta correspondiente.
4. Si quieres cambiar el caption de cada slide, edita la página HTML del proyecto
   (`projects/<slug>.html`) y modifica el texto dentro de `<figcaption>`.

## Si no hay imágenes

Las páginas funcionan igual: el carrusel muestra un placeholder
*"📷  imagen pendiente"* en cada slide vacío. Las imágenes se cargan
dinámicamente — basta con poner el archivo y recargar.

## Recomendaciones

- **PNG** para capturas con texto, **JPG** para fotos reales
- Si la imagen pesa >500 KB, comprímela con [squoosh.app](https://squoosh.app)
- Mantén el ratio 16:9 — el carrusel recorta verticalmente si es muy alta
