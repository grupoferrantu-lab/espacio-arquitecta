# ESPACIOaRQUITECTA · Maqueta navegable

## Desarrollo local

Abre la raíz del repositorio en VS Code y ejecuta Live Server desde `index.html`. También puedes usar `python -m http.server 8080` y abrir http://localhost:8080. La primera visita a una vista que usa perfiles u obras inicia la consulta a Google Apps Script. El catálogo se reutiliza durante la navegación en la misma pestaña.

Para validar el sitio, ejecuta `npm ci`, `npx playwright install chromium` y `npm test`. Las pruebas usan una copia de referencia del commit `7f38131` y respuestas simuladas de Sheets. Node y Playwright se usan solo en desarrollo.

## Qué contiene
- `index.html`: estructura semántica, menú principal de seis opciones y pie con enlaces a Instagram, Spotify y LinkedIn.
- `css/styles.css`: identidad visual, estilos responsivos y foco de teclado.
- `js/app.js`: arranque y montaje de vistas.
- `js/features/`: vistas y controles de directorio, publicaciones, formularios, LAB y páginas institucionales.
- `js/ui/templates.js`: plantillas compartidas para encabezados, enlaces y estados.
- `js/core/router.js`: interpretación de rutas hash y sección activa.
- `js/integrations/sheets.js` y `js/catalog.js`: lectura de Google Sheets y unión de perfiles, obras y contenidos locales.
- `js/participation.js` y `css/participation.css`: reacciones, comentarios de demostración y presentación discreta de la participación.
- `data/`: contenidos de podcast, LAB, Encuentros y membresías, además de los datos de demostración.
- `assets/`: símbolo, cinco ilustraciones SVG originales y videos de portada y podcast.
- `scripts/create_assets.py`: fuente reproducible de las ilustraciones, sin dependencias.
- `VERIFICACION.md`: comprobaciones efectuadas y límites de validación.
- `NAVEGACION.md`: mapa Mermaid y rutas vigentes.
- `navegacion.mmd`: fuente del diagrama Mermaid para reutilizar.

## Funcionalidades implementadas
Navegación mediante rutas hash compatibles con HTTP/HTTPS y hosting estático; enlaces directos y volver/avanzar del navegador; menú móvil con estado expandido; búsqueda sin distinción de tildes o mayúsculas; filtros combinables de ciudad y especialidad; contador y estado vacío; restablecimiento de filtros; fichas profesionales sencillas con presentación y contacto demostrativo; agenda y detalle de actividades; formularios con errores por campo, foco en el primer error y confirmación explícita de demostración; estados hover, foco y sección activa.

Las obras de Google Sheets se abren en `#/publicacion/identificador`. El episodio de Podcast enlaza a Spotify. Los artículos de Encuentros se abren desde ESPACIOaRQUITECTA LAB.

Comunidad no contiene un video de presentación independiente. El pie de todas las páginas contiene enlaces externos a Instagram, Spotify y LinkedIn, con sus logos y nombres visibles. Se abren en una pestaña nueva; no hay enlace a Comunidad ni otros enlaces internos en el pie. La marca del pie es texto. La documentación técnica y las posibilidades futuras se mantienen en estos archivos, fuera de la navegación del sitio.

En el artículo de Encuentros, se puede activar o retirar «Me gusta» mediante un corazón con contador, leer y publicar comentarios de prueba. Los campos vacíos o con solo espacios no se aceptan. Los comentarios nuevos se muestran de inmediato como «Visitante de demostración», sin pedir nombre, correo o autenticación. Se insertan como texto literal, sin interpretar HTML. El límite es de 1.000 caracteres.

Las reacciones y comentarios se mantienen por publicación en memoria durante la navegación en la misma pestaña. La tarjeta de Encuentros refleja los totales al volver al listado. **Al recargar o cerrar la pestaña se pierde la participación de prueba y se restablecen los datos ficticios iniciales.** Un aviso junto a los controles explica que no se envía nada a un servidor. No se incorporan respuestas anidadas, valoraciones negativas ni notificaciones.

## Simulaciones y protección de datos
Los formularios de Ser parte, contacto e inscripción **solo son recorridos demostrativos**. Se validan en memoria y se limpian al terminar la prueba. Las reacciones y comentarios editoriales también son demostrativos y se conservan únicamente en memoria hasta recargar la pestaña. No existe envío de red ni recepción por la organización; los avisos y confirmaciones lo indican expresamente. No uses datos personales reales. No hay autenticación, pagos, gestión real de membresías, analítica, cookies ni almacenamiento persistente local o remoto. Los perfiles y las obras se cargan desde Google Sheets. Las actividades de Agenda siguen siendo ilustrativas.

## Posibilidades futuras por validar (no requisitos aprobados)
- Registro de miembros, tipos de membresía y eventual modelo de financiamiento.
- Administración de perfiles y aprobación de solicitudes de incorporación.
- Mentorías e inscripción a actividades.
- Publicación real de contenidos; comentarios y reacciones con moderación y persistencia. Lo implementado ahora es solo una demostración local.
- Registro de solicitudes de contacto y métricas de participación.
- Alianzas comerciales.

Antes de implementar: acordar prioridades, roles administrativos, criterios de acceso, procesos de aprobación, moderación, consentimiento, retención de datos, contenidos y responsables. No se ha construido un backend para estas posibilidades. WordPress es una alternativa a evaluar para el sitio definitivo; no es una decisión aprobada.

## Tecnología y evolución
HTML5, CSS3 y módulos ES nativos, sin framework ni compilación. Sirve el sitio por HTTP/HTTPS. Las vistas se generan desde funciones y los datos están separados. Una etapa posterior puede sustituir los datos por una API y dividir componentes sin descartar la identidad visual. No hay que generar un `dist`: la carpeta del proyecto es la distribución estática.

## Publicación estática

El workflow de GitHub Pages copia `index.html`, `assets/`, `css/`, `data/` y `js/` desde `main` a la raíz y desde `develop` a `/pruebas/`. Los imports de módulos usan rutas relativas. El sitio publicado se sirve directamente, sin instalar dependencias de desarrollo ni generar un artefacto con un compilador.

## Accesibilidad y revisión
Idioma español, etiquetas semánticas, enlace para saltar al contenido, foco visible, etiquetas de formularios, errores asociados por `aria-describedby`, contadores y confirmaciones anunciables, navegación por teclado, imágenes con alternativas, SVG ligeros, carga diferida salvo imagen principal y respeto a movimiento reducido. Video con controles nativos y sin reproducción automática. Esto no equivale a una certificación de accesibilidad: conviene revisar con tecnologías de asistencia y dispositivos reales antes de producción.

## Solicitar cambios
Indica la sección, el cambio esperado y, si corresponde, facilita logo, paleta, imágenes o textos autorizados. Por ejemplo: «Cambia el texto de inicio» o «Ajusta la presentación de las publicaciones». El alcance actual está descrito en este README y en el mapa de navegación; las propuestas futuras siguen pendientes de validación y no son requisitos aprobados.

## Paleta visual y contacto de Comunidad
Fondo principal blanco (#FFFFFF), azul principal #2B73C7, celeste #8DC6FF, superficies #E6EEF5, gris #8B98A5 y texto #1B2631. Los botones principales usan azul con texto blanco; los estados secundarios y monogramas utilizan celeste. Las imágenes y el video muestran sus colores originales, sin filtros de escala de grises. Comunidad conserva «Contáctanos» y su contacto general demostrativo sin envío de información.

Los logos de las redes se encuentran como SVG locales en `assets/redes/`. Los destinos son los enlaces indicados por la clienta.

## Listados desde Inicio

«Sus Voces» (`#/voces`) lista los podcasts y «Sus Proyectos» (`#/proyectos`) las publicaciones de temática Proyectos. Ambos permiten filtrar por arquitecta y tema, combinarlos y restablecerlos. `architectIds` vincula publicaciones con los identificadores de profesionales; la ausencia de vínculo aparece como «Sin arquitecta asignada». El listado del podcast incluye un enlace a Spotify y un guion demostrativo. El enlace «DESCUBRE EL ESPACIO» sobre el video lleva a Comunidad.
