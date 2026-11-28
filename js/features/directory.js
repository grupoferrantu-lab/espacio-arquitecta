import { crumb, heading, link, missing, notice, shell } from '../ui/templates.js';

const personCard=p=>`<a class="card person" href="#/perfil/${p.id}">${p.photo ? `<img class="person-photo" src="${p.photo}" alt="" width="1125" height="1079" loading="lazy">` : `<div class="avatar" style="background:${p.color}" aria-hidden="true">${p.initials}</div>`}<span class="tag">${p.field}</span><h3>${p.name}</h3><p>${p.city}${p.career ? "" : " · Perfil ficticio"}</p><span class="arrow">Conocer su mirada ↗</span></a>`;

export function directory(people){return shell(heading('Arquitectas|Oficios y Obras', 'Conoce a nuestras arquitectas') + `
    <div class="split directory-intro">
      <div class="prose directory-prose">
        <p>Aquí están las arquitectas y lo que han construido. Un directorio para encontrarnos, reconocernos y recomendarnos, y para que las obras hablen tanto como las voces.</p>
        <p><strong>Cómo explorar</strong> Busca por perfil o por obra, y filtra por región, especialidad, tipo de proyecto o etapa profesional.</p>
        <p><strong>Qué muestra cada perfil</strong> Nombre y trayectoria · especialidad · región · obras destacadas con fotos y una breve descripción · enlaces a su sitio y redes · si está disponible para colaborar o mentorar.</p>
        <p><strong>Qué muestra cada obra</strong> Nombre, ubicación y año · arquitecta o equipo · desafío que resolvió · qué la hace distinta.</p>
        <p><strong>Convocatoria</strong> ¿Eres arquitecta y quieres aparecer? Hay un lugar para quien empieza, para quien consolida y para quien se está reinventando. ${link('participa', 'Formulario de postulación')}</p>
      </div>
      <img src="assets/collage-arquitectas.png" alt="Collage de entrevistas y publicaciones de ESPACIOaRQUITECTA" width="776" height="782">
    </div>
    <form class="filters" id="filters" role="search"><label>Buscar arquitecta<input id="search" type="search" placeholder="Nombre, ciudad o especialidad" autocomplete="off"></label><label>Ciudad<select id="city"><option value="">Todas las ciudades</option>${[...new Set(people.map(p=>p.city))].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Especialidad<select id="field"><option value="">Todas las especialidades</option>${[...new Set(people.map(p=>p.field))].map(x=>`<option>${x}</option>`).join('')}</select></label><button type="reset" class="small">Limpiar</button></form><p id="count" class="count" role="status"></p><div class="grid" id="results"></div>`);}
export function profile(id, people) {
  const p = people.find(p => p.id === id);
  if (!p) return missing();
  const worksLink = link('proyectos/' + p.id, 'Ver sus obras', 'button secondary');
  if (p.career) {
    return shell(crumb('directorio', 'Directorio') + `
      <div class="profile-head">
        <div>
          ${heading('Perfil profesional', p.name, p.bio)}
          <span class="tag">${p.field} · ${p.city}</span>
          <div class="actions">${link('contacto/' + p.id, 'Formulario de contacto ↗', 'button')}${worksLink}</div>
        </div>
        ${p.photo ? `<img class="profile-photo" src="${p.photo}" alt="Retrato de ${p.name}" width="1125" height="1079" referrerpolicy="no-referrer">` : `<div class="profile-visual"><div class="avatar" style="background:${p.color}">${p.initials}</div></div>`}
      </div>
      <div class="prose">${p.career.map(([title, items]) => `
        <section>
          <h2>${title}</h2>
          <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
        </section>`).join('')}
      </div>`);
  }
  return shell(crumb('directorio', 'Directorio') + `
    <div class="profile-head"><div><p class="eyebrow">Arquitecta / Perfil ficticio</p>
      <h1>${p.name}</h1><span class="tag">${p.field} · ${p.city}</span>
      <p class="lead">${p.bio}</p>
      <div class="actions">${link('contacto/' + p.id, 'Probar contacto demostrativo ↗', 'button')}${worksLink}</div>
    </div><div class="profile-visual"><div class="avatar" style="background:${p.color}"
      aria-label="Monograma de ${p.name}">${p.initials}</div></div></div>${notice}`);
}

function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export function initFilters(root, people, loadState) {
  const form = root.querySelector('#filters');
  const search = form.querySelector('#search');
  const city = form.querySelector('#city');
  const field = form.querySelector('#field');
  const count = root.querySelector('#count');
  const results = root.querySelector('#results');

  function update() {
    const query = normalize(search.value.trim());
    const found = people.filter(person =>
      (!city.value || person.city === city.value) &&
      (!field.value || person.field === field.value) &&
      normalize(person.name + ' ' + person.city + ' ' + person.field).includes(query)
    );
    count.textContent = `${found.length} de ${people.length} perfiles`;
    if (loadState === 'loading') {
      results.innerHTML = '<p role="status">Cargando arquitectas…</p>';
    } else if (loadState === 'error') {
      results.innerHTML = '<p role="alert">No fue posible cargar el directorio. Recarga la página para volver a intentar.</p>';
    } else {
      results.innerHTML = found.length
        ? found.map(personCard).join('')
        : '<div class="empty"><h2>No encontramos coincidencias.</h2><p>Prueba otra búsqueda o limpia los filtros.</p></div>';
    }
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
