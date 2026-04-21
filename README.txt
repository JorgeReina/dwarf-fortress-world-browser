# Dwarf Fortress World Browser v4

## Cómo arrancarlo
1. Descomprime el zip
2. Abre la carpeta del proyecto
3. Ejecuta:
   npm install
   npm run dev

## Qué cambia
- Parsing XML asíncrono en Web Worker
- App dividida en componentes y pestañas modulares
- Contexto resumido y estado UI persistidos en localStorage
- Mapa solo con dragones y figuras de impacto
- Traducción heurística del texto del XML según idioma
- Detalles de dragones y figuras usando nombres resueltos en vez de IDs cuando es posible

## Nota
La traducción del texto del XML se hace de forma local y heurística. Para traducción perfecta de narrativa libre haría falta integrar una API o un modelo adicional.
