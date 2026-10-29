# Espacio Arquitecta · Maqueta navegable

## Abrir y compartir
1. Descomprime el ZIP completo en una carpeta.
2. Haz doble clic en `index.html`. No requiere instalar programas ni conexión a Internet.
3. Usa el menú: Inicio, Comunidad, Directorio, Agenda, Editorial y Ser parte. «Ser parte» abre un formulario de prueba.
4. Comparte el ZIP completo, manteniendo las carpetas juntas. No abras el HTML dentro del ZIP sin extraerlo.

También puedes servir la carpeta con `python -m http.server 8080` y abrir `http://localhost:8080`. Detén el servidor con Ctrl+C.

## Qué contiene
- `index.html`: estructura semántica, menú principal de seis opciones y pie con enlaces a Instagram, Spotify y LinkedIn.
- `css/styles.css`: identidad visual, estilos responsivos y foco de teclado.
- `js/app.js`: páginas, filtros del directorio y Editorial, publicaciones y formularios, sin dependencias.
- `js/participation.js` y `css/participation.css`: reacciones, comentarios de demostración y presentación discreta de la participación.
- `data/demo.js`: seis perfiles, tres actividades y siete publicaciones ficticias, con reacciones y comentarios iniciales también ficticios. Cada publicación tiene un identificador único, un formato y una o varias temáticas.
- `assets/`: símbolo, cinco ilustraciones SVG originales y animación conceptual WebM sin audio.
- `scripts/create_assets.py`: fuente reproducible de las ilustraciones, sin dependencias.
- `scripts/record-video.html`: herramienta opcional para regenerar el video en un navegador con MediaRecorder. Genera, descarga y copia el archivo como `assets/espacio-demo.webm`.
- `VERIFICACION.md`: comprobaciones efectuadas y límites de validación.
- `NAVEGACION.md`: mapa Mermaid actualizado, rutas y explicación de las clasificaciones editoriales.
- `navegacion.mmd`: fuente del diagrama Mermaid para reutilizar.

## Funcionalidades implementadas
Navegación mediante rutas hash compatible con archivos locales y hosting estático; enlaces directos y volver/avanzar del navegador; menú móvil con estado expandido; búsqueda sin distinción de tildes o mayúsculas; filtros combinables de ciudad y especialidad; contador y estado vacío; restablecimiento de filtros; fichas profesionales sencillas con presentación y contacto demostrativo; agenda y detalle de actividades; formularios con errores por campo, foco en el primer error y confirmación explícita de demostración; estados hover, foco y sección activa.

Editorial reúne todas las publicaciones, incluidos los contenidos sobre proyectos. Tiene dos clasificaciones independientes y combinables:

- **Formato:** Podcast, Video, Entrevista y Artículo escrito.
- **Temática:** Personas, Proyectos, Tendencias, Innovación, Sustentabilidad y Comunidad.

Cada publicación aparece una sola vez y tiene una página de detalle `#/publicacion/identificador`, aunque pertenezca a varias temáticas. «Proyectos» es únicamente una temática editorial; no hay sección, entidad de proyecto, galería ni enlaces de proyectos desde las fichas profesionales. El video conceptual existente se reproduce en su publicación editorial. El ejemplo de podcast presenta sinopsis y guion, claramente identificados como demostrativos; no incluye audio. No se han incorporado reproductores, inscripciones ni servicios reales adicionales.

Comunidad no contiene un video de presentación independiente. El pie de todas las páginas contiene enlaces externos a Instagram, Spotify y LinkedIn, con sus logos y nombres visibles. Se abren en una pestaña nueva; no hay enlace a Comunidad ni otros enlaces internos en el pie. La marca del pie es texto. La documentación técnica y las posibilidades futuras se mantienen en estos archivos, fuera de la navegación del sitio.

En cada publicación, cualquiera sea su formato, se puede activar o retirar «Me gusta» mediante un corazón con contador, leer comentarios ficticios y publicar un comentario de prueba. Los campos vacíos o con solo espacios no se aceptan. Los comentarios nuevos se muestran de inmediato como «Visitante de demostración», sin pedir nombre, correo o autenticación. Se insertan como texto literal, sin interpretar HTML. El límite es de 1.000 caracteres.

Las reacciones y comentarios se mantienen por publicación en memoria durante la navegación en la misma pestaña. Las tarjetas de Editorial y de Inicio reflejan los totales al volver a ellas. **Al recargar o cerrar la pestaña se pierde la participación de prueba y se restablecen los datos ficticios iniciales.** Un aviso junto a los controles explica que no se envía nada a un servidor. No se incorporan respuestas anidadas, valoraciones negativas ni notificaciones.

## Simulaciones y protección de datos
Los formularios de Ser parte, contacto e inscripción **solo son recorridos demostrativos**. Se validan en memoria y se limpian al terminar la prueba. Las reacciones y comentarios editoriales también son demostrativos y se conservan únicamente en memoria hasta recargar la pestaña. No existe envío de red ni recepción por la organización; los avisos y confirmaciones lo indican expresamente. No uses datos personales reales. No hay autenticación, pagos, gestión real de membresías, analítica, cookies ni almacenamiento persistente local o remoto. Los perfiles, obras, comentarios iniciales, contadores y fechas son ficticios. El video y las imágenes son conceptuales, no institucionales.

## Posibilidades futuras por validar (no requisitos aprobados)
- Registro de miembros, tipos de membresía y eventual modelo de financiamiento.
- Administración de perfiles y aprobación de solicitudes de incorporación.
- Mentorías e inscripción a actividades.
- Publicación real de contenidos; comentarios y reacciones con moderación y persistencia. Lo implementado ahora es solo una demostración local.
- Registro de solicitudes de contacto y métricas de participación.
- Alianzas comerciales.

Antes de implementar: acordar prioridades, roles administrativos, criterios de acceso, procesos de aprobación, moderación, consentimiento, retención de datos, contenidos y responsables. No se ha construido un backend para estas posibilidades. WordPress es una alternativa a evaluar para el sitio definitivo; no es una decisión aprobada.

## Tecnología y evolución
HTML5, CSS3 y JavaScript tradicional, sin framework ni compilación. Es suficiente para la maqueta, permite abrirla mediante `file://`, facilita el ZIP y evita dependencias. Las vistas se generan desde funciones y los datos están separados. Una etapa posterior puede sustituir los datos por una API y dividir componentes sin descartar la identidad visual. No hay que generar un `dist`: la carpeta del proyecto es la distribución estática.

## Publicación estática
No se ha publicado este prototipo ni se ha creado ninguna cuenta. Instrucciones orientativas; los paneles y condiciones de los proveedores pueden cambiar.

**GitHub Pages:** crea un repositorio, sube `index.html`, `css`, `js`, `data` y `assets` manteniendo su estructura. En Settings → Pages, configura la publicación desde la rama principal y carpeta raíz. La navegación hash evita necesitar reglas de servidor. Consulta la ayuda vigente desde el propio panel si las opciones difieren.

**Netlify:** desde el panel de despliegue manual, arrastra una carpeta que contenga `index.html` y sus carpetas de recursos. No hay comando de build. Si conectas un repositorio, la carpeta de publicación es la raíz. Revisa la disponibilidad y límites del plan gratuito antes de publicar.

No subas `.git`, capturas de revisión ni información personal. Los scripts de generación no son necesarios para publicar. Conserva el aviso de demostración mientras se utilice contenido ficticio.

## Accesibilidad y revisión
Idioma español, etiquetas semánticas, enlace para saltar al contenido, foco visible, etiquetas de formularios, errores asociados por `aria-describedby`, contadores y confirmaciones anunciables, navegación por teclado, imágenes con alternativas, SVG ligeros, carga diferida salvo imagen principal y respeto a movimiento reducido. Video con controles nativos y sin reproducción automática. Esto no equivale a una certificación de accesibilidad: conviene revisar con tecnologías de asistencia y dispositivos reales antes de producción.

## Solicitar cambios
Indica la sección, el cambio esperado y, si corresponde, facilita logo, paleta, imágenes o textos autorizados. Por ejemplo: «Cambia el texto de inicio» o «Ajusta la presentación de las publicaciones». El alcance actual está descrito en este README y en el mapa de navegación; las propuestas futuras siguen pendientes de validación y no son requisitos aprobados.

## Paleta visual y contacto de Comunidad
Fondo principal blanco (#FFFFFF), azul principal #2B73C7, celeste #8DC6FF, superficies #E6EEF5, gris #8B98A5 y texto #1B2631. Los botones principales usan azul con texto blanco; los estados secundarios y monogramas utilizan celeste. Las imágenes y el video muestran sus colores originales, sin filtros de escala de grises. Comunidad conserva «Contáctanos» y su contacto general demostrativo sin envío de información.

Los logos de las redes se encuentran como SVG locales en `assets/redes/`. Los destinos son los enlaces indicados por la clienta.
