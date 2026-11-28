/* Navegación por hash para alojamiento estático. Sin backend ni persistencia. */
import { events } from '../data/lab.js';
import { podcastTopics } from '../data/podcast.js';
import * as participation from './participation.js';
import { mergeSheetRows } from './catalog.js';
import { activeSection, needsCatalog, parseRoute } from './core/router.js';
import { fetchArchitectRows } from './integrations/sheets.js';
import { directory, initFilters, profile } from './features/directory.js';
import { formPage, initForm } from './features/forms.js';
import { community, home, initHeroVideo, memberships } from './features/institutional.js';
import { activity, agenda, encounterPublication, encounters, mentoring, services } from './features/lab.js';
import { collectionPage, initCollectionFilters, publication, publicationSection } from './features/publications.js';
import { heading, missing, shell } from './ui/templates.js';

const main = document.querySelector('main'),
  nav = document.querySelector('nav'),
  menu = document.querySelector('.menu');

const catalog = {
  people: [],
  publications: [],
  events,
  podcastTopics,
};
let architectLoadState = 'idle';
let displayedRoute;

function render() {
  const route = parseRoute(location.hash);
  if (route.skipToContent) {
    main.focus();
    return;
  }

  renderView(route);
}

function renderView(route) {
  displayedRoute = route;
  const { page, id } = route;
  const usesCatalog = needsCatalog(route);
  if (usesCatalog && architectLoadState === 'idle') loadSheetArchitects();
  const person = page === 'proyectos' && id
    ? catalog.people.find(p => p.id === id)
    : undefined;
  const waitsForCatalog = usesCatalog && page !== 'directorio' && page !== 'voces';
  let html;
  if (waitsForCatalog && architectLoadState === 'loading') {
    html = shell(heading('Directorio', 'Cargando catálogo…') + '<p role="status">Buscando perfiles y obras.</p>');
  } else if (waitsForCatalog && architectLoadState === 'error') {
    html = shell(heading('Directorio', 'No fue posible cargar el catálogo.') +
      '<p role="alert">Recarga la página para volver a intentar.</p>');
  } else {
    switch (page) {
      case 'inicio':
        html = home();
        break;
      case 'comunidad':
        html = community();
        break;
      case 'servicios':
        if (id === 'encuentros') html = encounters();
        else html = id === 'mentoria' ? mentoring() : services();
        break;
      case 'encuentros':
        html = encounterPublication(id);
        break;
      case 'membresias':
        html = memberships();
        break;
      case 'directorio':
        html = directory(catalog.people);
        break;
      case 'perfil':
        html = profile(id, catalog.people);
        break;
      case 'voces':
      case 'proyectos':
        html = id && page === 'proyectos' && !person
          ? missing()
          : collectionPage(page, person, catalog);
        break;
      case 'publicacion':
        html = publication(id, catalog);
        break;
      case 'agenda':
        html = agenda(catalog.events);
        break;
      case 'actividad':
        html = activity(id, catalog.events);
        break;
      case 'contacto':
        html = !id || id === 'publicidad' || id === 'membresia' || catalog.people.some(p => p.id === id)
          ? formPage(page, id, catalog)
          : missing();
        break;
      case 'inscripcion':
        html = catalog.events.some(e => e.id === id) ? formPage(page, id, catalog) : missing();
        break;
      case 'participa':
        html = id === 'membresia' ? memberships() : formPage(page, id, catalog);
        break;
      default:
        html = missing();
    }
  }

  main.innerHTML = html;
  nav.querySelector('.join-menu').open = false;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');

  const publicationPage = page === 'publicacion'
    ? publicationSection(catalog.publications.find(p => p.id === id))[0]
    : undefined;
  const activePage = activeSection(route, publicationPage);
  nav.querySelectorAll('a').forEach(a => {
    if (a.hash === '#/' + activePage) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  document.title = (main.querySelector('h1')?.textContent || 'Inicio') + ' · ESPACIOaRQUITECTA · Demo';
  window.scrollTo(0, 0);
  if (location.hash) main.focus({ preventScroll: true });

  if (page === 'inicio') initHeroVideo(main);
  if (page === 'directorio') initFilters(main, catalog.people, architectLoadState);
  if (main.querySelector('#collection-filters')) initCollectionFilters(main, page, person, catalog);
  if (main.querySelector('#demo-form')) initForm(main);
  if (main.querySelector('#editorial-participation')) participation.mount(id);
}

document.addEventListener('click', e => {
  const dropdown = nav.querySelector('.join-menu');
  if (!dropdown.contains(e.target)) dropdown.open = false;
});

// Cerrar también al elegir la sección que ya está abierta en el menú móvil.
nav.addEventListener('click', e => {
  if (e.target.closest('a')) {
    nav.querySelector('.join-menu').open = false;
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const dropdown = nav.querySelector('.join-menu');
    if (dropdown.open) {
      dropdown.open = false;
      dropdown.querySelector('summary').focus();
      return;
    }
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});

async function loadSheetArchitects() {
  architectLoadState = 'loading';
  try {
    mergeSheetRows(catalog, await fetchArchitectRows());
    architectLoadState = 'ready';
  } catch (error) {
    architectLoadState = 'error';
    console.warn('POC Google Sheets: no se pudieron cargar los perfiles.', error);
  }
  const locationRoute = parseRoute(location.hash);
  const route = locationRoute.skipToContent ? displayedRoute : locationRoute;
  if (route && needsCatalog(route)) renderView(route);
}

window.addEventListener('hashchange', render);
render();
