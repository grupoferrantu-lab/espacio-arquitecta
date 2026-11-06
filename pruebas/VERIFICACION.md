# Verificación · Participación editorial y estructura simplificada

Última revisión: 29 de octubre de 2026. Las nuevas interacciones son controles dentro de las publicaciones existentes y no añaden rutas.

## Redes sociales del pie: última revisión

- Pie actualizado con los tres destinos exactos indicados por la clienta: Instagram, Spotify y LinkedIn. Se retiró el enlace a Comunidad.
- En navegador, los tres logos SVG locales cargaron correctamente; cada enlace tiene nombre visible y accesible, target=_blank y rel=noopener noreferrer. El pie no contiene enlaces internos.
- Revisión visual en escritorio (1366 × 900) y móvil (390 × 844). Los enlaces se distribuyen en varias filas en móvil, sin desbordamiento horizontal.
- Se comprobó el destino de cada enlace en el HTML generado; no se verificó la disponibilidad de los perfiles externos ni se inició sesión en las redes.
- Captura de escritorio guardada en revision/pie-redes.png. Mapa Mermaid y README actualizados.

## Nueva paleta azul e imágenes a color: antecedente

- Se aplicó la referencia #2B73C7, #8DC6FF, #E6EEF5, #8B98A5 y #1B2631, conservando fondo blanco.
- Se eliminaron los filtros de escala de grises; las imágenes y el video recuperaron sus colores originales.
- Verificación en navegador: fondo blanco, imagen principal con filter=none y botones con fondo rgb(43,115,199) y texto blanco.
- Inspección visual de portada en escritorio; captura portada.png actualizada. Comunidad conserva Contáctanos y su enlace #/contacto. La consulta de consola no devolvió errores.

## Cambio de paleta anterior y contacto general: antecedente

- Se aplicaron fondo #FFFFFF, acento #B2FFFF y grises de la referencia, con texto #111111. Los recursos editoriales se muestran en escala de grises mediante CSS.
- En navegador, el fondo calculado fue rgb(255,255,255), y el botón principal mostró fondo rgb(178,255,255) con texto rgb(17,17,17).
- Comunidad muestra «Contáctanos» y abre la ruta #/contacto con el formulario de contacto general, mientras los contactos profesionales conservan sus rutas.
- El formulario general marcó cinco errores al enviarlo vacío. En móvil, con datos ficticios válidos, mostró la confirmación de que no se envió ni registró información.
- Revisión visual de portada en escritorio y comprobación móvil de 390 × 844; ancho de documento observado: 375 px, sin desbordamiento horizontal. La consulta de errores de consola devolvió cero errores.
- Se actualizó portada.png, la documentación, el mapa de navegación y el ZIP.

## Participación editorial: pruebas de la actualización anterior

- Sintaxis de `js/participation.js`, `js/app.js` y `data/demo.js` comprobada con Node, sin errores.
- Pruebas en navegador sobre las siete publicaciones, cubriendo los cuatro formatos. En cada una: activar Me gusta suma uno, cambia `aria-pressed` a true y muestra el corazón relleno; retirarlo resta uno y devuelve el estado inicial.
- En las siete publicaciones, un comentario de prueba se agregó inmediatamente, con el nombre «Visitante de demostración», y aumentó el contador de comentarios en uno.
- Al volver a Editorial y abrir nuevamente cada publicación, se conservaron la reacción y el comentario de esa publicación. Las tarjetas mostraron los totales actualizados. Las publicaciones conservaron estados independientes.
- Se rechazaron un comentario vacío y otro compuesto solo por espacios; se mostró un error junto al campo y se marcó `aria-invalid=true`.
- Se probó un comentario con `<b>etiquetas</b>` y `&`: el texto permaneció literal, sin crear elementos HTML, también después de salir y volver al detalle.
- Al recargar la publicación de video, se restablecieron sus datos ficticios iniciales: siete reacciones, un comentario y Me gusta desactivado.
- El botón Me gusta funcionó mediante Space. El video continuó reproduciéndose al interactuar con el corazón; no se reconstruyó el contenido audiovisual.
- Inspección visual en escritorio (1366 × 1000) y móvil (390 × 844). En móvil se activó Me gusta y se publicó un comentario de prueba. El ancho de documento observado fue 375 px para 390 px de ventana, sin desbordamiento horizontal.
- Las consultas de errores de consola durante estas pruebas no devolvieron errores.
- Los comentarios nuevos se insertan con `textContent` y se escapan al volver a generar la vista. El módulo usa un Map en memoria; no contiene envíos de red, cookies ni almacenamiento persistente.
- Diagrama Mermaid actualizado y sincronizado entre NAVEGACION.md y navegacion.mmd. Las interacciones están agrupadas dentro de cada publicación; no son destinos de navegación independientes.

## Verificación de estructura de la actualización anterior

Las siguientes comprobaciones se realizaron al simplificar la navegación y se conservan como antecedente. Esta actualización mantiene esas rutas y menús.


- Servidor estático local: respuesta HTTP 200. Sintaxis JavaScript verificada con Node.
- Recorrido en navegador de los 31 destinos enlazados: seis secciones principales, seis fichas profesionales, seis contactos, tres actividades, tres inscripciones y siete publicaciones. Ninguno mostró la pantalla de contenido no encontrado.
- Menú principal: exactamente Inicio, Comunidad, Directorio, Agenda, Editorial y Ser parte.
- En las 31 páginas, el pie contiene exactamente un enlace: Comunidad.
- No se encontraron enlaces a las rutas retiradas de proyectos, artículos antiguos o alcance. No hay rutas de proyecto activas en el router.
- Las seis fichas profesionales contienen solamente los enlaces de retorno a Inicio y Directorio y el contacto de su propia profesional. No contienen galerías, proyectos ni enlaces hacia otras fichas.
- Comunidad no contiene un elemento de video. El video existente está integrado en una publicación de Editorial.
- Editorial: siete publicaciones con siete enlaces únicos. Controles con los cuatro formatos y las seis temáticas solicitadas.
- Filtros por formato: Podcast 1, Video 1, Entrevista 1, Artículo escrito 4.
- Filtros por temática: Personas 2, Proyectos 4, Tendencias 1, Innovación 1, Sustentabilidad 3 y Comunidad 4. Las cifras se solapan porque una publicación puede pertenecer a varias temáticas; no son publicaciones duplicadas.
- Combinación Entrevista + Proyectos: una publicación. Entrevista + Sustentabilidad: cero y mensaje de estado vacío. Limpiar filtros: siete publicaciones.
- Directorio: buscar «ines» encontró Inés; Santiago + Vivienda mostró un perfil.
- Participación, contacto e inscripción: campos vacíos generaron cinco errores; datos inventados válidos produjeron confirmación explícita sin envío, registro ni recepción real. Los campos se limpiaron después de la prueba.
- Video en Editorial: inicio mediante Space, estado de reproducción activo, datos suficientes y tiempo avanzando. Sin audio ni reproducción automática.
- Revisión visual en escritorio y móvil. En la vista móvil de 390 × 844, Editorial mostró los filtros en una columna; la combinación Entrevista + Proyectos funcionó. El ancho de documento observado fue 375 px para 390 px de ventana, sin desbordamiento horizontal.
- Menú móvil: muestra las seis opciones, se cierra al navegar y también al elegir la sección ya abierta.
- Las consultas de errores de consola realizadas durante la revisión devolvieron cero errores.
- Se contrastó el diagrama de NAVEGACION.md con navegacion.mmd y con los enlaces vigentes. Los filtros son controles dentro de las páginas, no rutas de categoría.

## Evidencias locales

La carpeta revision contiene las capturas portada.png, editorial.png, editorial-movil.png y perfil.png. verificacion-navegacion.json contiene el inventario de las 31 páginas, enlaces y resultados de los filtros y formularios. Las capturas y evidencias se conservan fuera del ZIP para mantener liviana la distribución.

Para esta actualización se añadieron participacion.png, participacion-movil.png y verificacion-interacciones.json, con los resultados por publicación. Las pruebas solo modificaron la memoria de la pestaña de verificación, no los datos iniciales del proyecto.

## Límites

La herramienta de navegador permite HTTP/HTTPS y bloquea file://. La apertura por doble clic no se verificó mediante esa herramienta; se mantienen scripts clásicos, rutas relativas y ausencia de fetch o módulos ES para facilitar esa modalidad. Se comprobó el sitio mediante servidor estático local.

No se realizó una auditoría formal WCAG ni pruebas con lector de pantalla, todos los dispositivos físicos o todos los navegadores. La reproducción WebM depende del soporte del navegador y dispone de mensaje alternativo ante error. El ejemplo de podcast muestra sinopsis y guion, sin audio. No se publicó el prototipo ni se añadieron servicios de backend.

## Recorrido sugerido

1. Inicio → Directorio → filtrar → abrir una ficha → contacto demostrativo.
2. Editorial → elegir formato y temática → abrir una publicación → volver a Editorial.
   Dentro de la publicación: activar y retirar Me gusta; leer comentarios; probar un campo vacío y luego publicar texto ficticio; volver desde Editorial y comprobar los totales. Recargar para restablecer la demostración.
3. Agenda → actividad → inscripción demostrativa.
4. Ser parte → probar validaciones con datos inventados.
5. Pie de cualquier página → Comunidad.
