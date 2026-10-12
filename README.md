# Apirober

![Apirober · Miel cruda de Burgos](assets/og.png)

Web de **Apirober**, miel cruda de flores de las colmenas de Roberto en Fuentemolinos (Burgos).
Sitio estático en **HTML, CSS y JS puro**, sin frameworks, desplegado en Vercel.

🌐 **[apirober.es](https://apirober.es)**

## Qué incluye

- **Página principal**: la miel, el proceso en cuatro pasos, calendario de cosecha, origen, preguntas frecuentes y pedidos por WhatsApp (tarros de 250 g, 500 g y 1 kg).
- **Blog** con 6 artículos sobre miel cruda: conservación, cristalización, cómo saber si es pura, etc.
- **Animación**: vídeo de introducción (WebM y MP4), scroll suave con [Lenis](https://github.com/darkroomengineering/lenis) que se desactiva si el sistema pide reducir animaciones, y fondos de panal generados al azar en cada visita.
- **SEO**: datos estructurados (JSON-LD) de `Product` con ofertas y precios, `FAQPage` y `WebSite`; `sitemap.xml`, `robots.txt` y `llms.txt` para buscadores con IA; imagen para redes sociales.

## Estructura

```
├── index.html        Página principal
├── blog/             Índice del blog y artículos
├── assets/           Estilos, scripts, vídeo de introducción e imágenes
├── 404.html          Página de error
├── sitemap.xml  robots.txt  llms.txt
└── vercel.json       URLs limpias (sin .html)
```

## Uso

No necesita instalar nada: se edita el HTML directamente. Para previsualizar en local, cualquier servidor estático vale:

```bash
npx serve .
```

Cada `git push` a `main` se publica automáticamente en Vercel.

## Pendiente

- Aviso legal, política de privacidad y de cookies.

## Créditos

Diseño y desarrollo: [El Escaparate](https://elescaparateweb.com).
