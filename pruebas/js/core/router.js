const menuSection = {
  encuentros: 'servicios',
  proyectos: 'directorio',
  perfil: 'directorio',
  contacto: 'directorio',
  actividad: 'agenda',
  inscripcion: 'agenda',
};

export function parseRoute(hash) {
  if (hash === '#main') return { skipToContent: true };
  const [page, id] = (hash.replace(/^#\/?/, '') || 'inicio').split('/');
  return { page, id };
}

export function activeSection({ page, id }, publicationPage) {
  if (page === 'participa' && id === 'membresia') return 'membresias';
  if (page === 'contacto' && id === 'membresia') return 'contacto';
  if (page === 'contacto' && !id) return 'comunidad';
  const section = page === 'publicacion' ? publicationPage : page;
  return Object.hasOwn(menuSection, section) ? menuSection[section] : section;
}

const catalogPages = new Set(['directorio', 'perfil', 'proyectos', 'publicacion', 'voces']);

export function needsCatalog({ page, id }) {
  return catalogPages.has(page) ||
    (page === 'contacto' && Boolean(id) && id !== 'publicidad' && id !== 'membresia');
}
