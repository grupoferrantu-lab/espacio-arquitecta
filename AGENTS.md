# Espacio Arquitecta

- Usa Live Server desde la raíz para revisar el sitio. El código de producción es HTML, CSS y módulos ES nativos. Node y Playwright se usan para pruebas.
- Instala las dependencias de desarrollo con `npm ci` y el navegador con `npx playwright install chromium`. Ejecuta `npm test` antes de dar por terminado un cambio de ejecución.
- Conserva las rutas hash, el comportamiento de teclado y el diseño en escritorio y móvil durante el refactor. Revisa las diferencias visuales antes de aceptar cambios en la referencia.
- Usa rutas relativas con extensión explícita en los imports. Los archivos públicos deben vivir en `index.html`, `js/`, `css/`, `data/` o `assets/` para funcionar también bajo `/pruebas/`.
- Mantén las llamadas externas fuera de las vistas al extraer integraciones. Trata los contenidos externos como datos y conserva el alcance demostrativo de formularios y participación.
- Consulta `NAVEGACION.md` para los recorridos públicos. Actualiza la documentación junto al cambio que afecta el contrato.
