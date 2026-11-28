import { isidoraEpisode } from '../../data/podcast.js';
import { crumb, heading, link, missing, shell } from '../ui/templates.js';

const publicationCard = p => `<a class="card" href="#/publicacion/${p.id}">
  ${p.image ? `<img src="${p.image}" alt="${p.alt}" loading="lazy" width="600" height="450">` : ""}
  <p class="meta">${p.format} · ${p.themes.join(' / ')}</p>
  <h3>${p.title}</h3><p>${p.text}</p><p class="meta">${[p.city,p.year,p.category].filter(Boolean).join(" · ")}</p><span class="arrow">Ver obra ↗</span></a>`;

export function publicationSection(publication) {
  return publication?.format === 'Podcast' ? ['voces', 'Podcast'] : ['proyectos', 'Obras'];
}

export function publication(id, { people, publications }) {
  const p = publications.find(p => p.id === id);
  if (!p) return missing();
  return shell(crumb("proyectos","Obras") + heading("Obra",p.title,p.text) + `<p class="meta">${[p.city,p.year,p.category].filter(Boolean).join(" · ")}</p>${p.image ? `<img class="wide-image" src="${p.image}" alt="${p.alt}">` : ""}<p>${p.architectIds.map(id => people.find(a => a.id === id)).filter(Boolean).map(a => link("perfil/"+a.id,a.name)).join(" · ")}</p>`);
}

function collectionItems(page, publications) {
  if (page === 'voces') return [isidoraEpisode, ...publications.filter(p => p.format === 'Podcast')];
  return publications.filter(p => p.themes.includes('Proyectos'));
}
export function collectionPage(page, person, { people, podcastTopics, publications }) {
  const isPodcast = page === 'voces';
  const title = person ? 'Obras de ' + person.name : isPodcast ? 'Sus Voces' : 'Sus Proyectos';
  const description = isPodcast
    ? 'ESPACIOaRQUITECTA: diseñando y creando con la voz de mujeres en la arquitectura'
    : person ? '' : 'Publicaciones sobre proyectos. Explora por arquitecta y tema.';
  const topics = isPodcast ? [...podcastTopics, ...isidoraEpisode.podcastTopics] : [...new Set(collectionItems(page, publications).flatMap(work => work.themes))];
  const podcastDetails = isPodcast
    ? `<div class="podcast-intro">
        <div>
          ${heading('Podcast', title, description)}
          <p class="prose">Conversaciones inspiradoras con arquitectas, abogadas, agrónomas e ingenieras que están dando forma al entorno que habitamos. Desde espacios públicos accesibles hasta espacios seguros, del buen construir y otras complejidades del campo, escuchamos cómo se lidera, se crea y se colabora desde una mirada femenina.</p>
        </div>
        <div class="podcast-intro-video">
          <video controls autoplay muted playsinline aria-label="Introducción al podcast de ESPACIOaRQUITECTA">
            <source src="assets/video_podcast.mp4" type="video/mp4">
            Tu navegador no puede reproducir el video. <a href="assets/video_podcast.mp4">Descargar el video de introducción</a>.
          </video>
        </div>
      </div>
      <p><a class="button" href="https://open.spotify.com/show/2gKyb8o620HxBYZ4spyAE0">Escuchar ESPACIOaRQUITECTA en Spotify ↗</a></p>
      <p>25 episodios · 25 voces en la temporada 1</p>
      ${link('contacto', '¿Quieres contar tu historia?', 'button secondary')}`
    : '';
  return shell((person ? crumb('perfil/' + person.id, person.name) : crumb('inicio', 'Inicio')) + (isPodcast ? podcastDetails : heading(person ? 'Arquitectas|Oficios y Obras' : 'Obras', title, description)) +
    `<form class="filters editorial-filters" id="collection-filters" aria-label="Filtros de ${title}">
      ${person ? '' : `<label>Arquitecta<select id="architect"><option value="">Todas las arquitectas</option>
        ${people.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        ${isPodcast ? '<option value="isidora-gouet">Isidora Gouet</option>' : ''}
        <option value="unassigned">Sin arquitecta asignada</option></select></label>`}
      <label>Tema<select id="topic"><option value="">Todos los temas</option>
        ${topics.map(t => `<option>${t}</option>`).join('')}</select></label>
      <button type="reset" class="small">Limpiar filtros</button>
    </form><p id="collection-count" class="count" role="status"></p><div class="grid${isPodcast ? ' podcast-results' : ''}" id="collection-results"></div>`);
}
export function initCollectionFilters(root, page, person, { people, publications }) {
  const items = collectionItems(page, publications).filter(p => !person || p.architectIds?.includes(person.id));
  const form = root.querySelector('#collection-filters');
  const topicField = page === 'voces' ? 'podcastTopics' : 'themes';
  function update() {
    const architect = form.querySelector('#architect')?.value, topic = form.querySelector('#topic').value;
    const found = items.filter(p => (!architect || (architect === 'unassigned' ? !p.architectIds?.length : p.architectIds?.includes(architect))) && (!topic || p[topicField]?.includes(topic)));
    root.querySelector('#collection-count').textContent = `${found.length} de ${items.length} ${page === 'voces' ? 'podcasts' : 'publicaciones sobre proyectos'}`;
    root.querySelector('#collection-results').innerHTML = found.length ? found.map(p => p === isidoraEpisode ? `<article>
      <a class="card" href="${p.spotifyUrl}">
        <img class="podcast-guest-photo" src="assets/isidora.jpeg" alt="Retrato de Isidora Gouet" width="1064" height="1600" loading="lazy">
        <p class="meta">Podcast · Iluminación</p>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        <span class="arrow">Escuchar el capítulo en Spotify ↗</span>
      </a>
    </article>` : `<article>${publicationCard(p)}<p class="micro">${(p.architectIds || []).map(id => people.find(person => person.id === id)?.name).filter(Boolean).join(', ') || 'Sin arquitecta asignada'}</p></article>`).join('') :
      person && !items.length
      ? '<div class="empty"><h2>Esta arquitecta aún no tiene obras publicadas.</h2></div>'
      : `<div class="empty"><h2>No encontramos contenidos.</h2><p>${person ? 'Prueba otro tema o limpia los filtros.' : 'Prueba otra arquitecta o tema, o limpia los filtros.'}</p></div>`;
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
