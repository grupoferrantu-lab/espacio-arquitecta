/* Navegación por hash compatible con file:// y alojamiento estático. Sin backend ni persistencia. */
(() => {
'use strict';
const D=window.DEMO, encounterArticle=window.EncounterArticle, participation=window.EditorialParticipation, main=document.querySelector('main'), nav=document.querySelector('nav'), menu=document.querySelector('.menu');
D.people = [];
let architectLoadState = 'loading';
const link=(path,text,cls='')=>`<a class="${cls}" href="#/${path}">${text}</a>`;
const notice='<p class="notice">Demostración: perfiles ilustrativos, publicaciones y actividades de demostración. No representan servicios ni convocatorias reales.</p>';
const publicationCard = p => `<a class="card" href="#/publicacion/${p.id}">
  ${p.image ? `<img src="${p.image}" alt="${p.alt}" loading="lazy" width="600" height="450">` : ""}
  <p class="meta">${p.format} · ${p.themes.join(' / ')}</p>
  <h3>${p.title}</h3><p>${p.text}</p>${p.source === "sheets" ? `<p class="meta">${[p.city,p.year,p.category].filter(Boolean).join(" · ")}</p>` : `<span class="card-participation">${participation.summary(p.id)}</span>`}<span class="arrow">${p.source === "sheets" ? "Ver obra" : "Ver publicación"} ↗</span></a>`;
const personCard=p=>`<a class="card person" href="#/perfil/${p.id}">${p.photo ? `<img class="person-photo" src="${p.photo}" alt="" width="1125" height="1079" loading="lazy">` : `<div class="avatar" style="background:${p.color}" aria-hidden="true">${p.initials}</div>`}<span class="tag">${p.field}</span><h3>${p.name}</h3><p>${p.city}${p.career ? "" : " · Perfil ficticio"}</p><span class="arrow">Conocer su mirada ↗</span></a>`;
const eventRow=e=>`<article class="event"><div class="date"><strong>${e.day}</strong>${e.month}</div><div><h3>${link('actividad/'+e.id,e.title)}</h3><p>${e.type} · Actividad ficticia</p></div>${link('actividad/'+e.id,'Ver actividad ↗','button secondary small')}</article>`;
const heading=(k,title,desc='')=>`<div class="intro"><p class="eyebrow">${k}</p><h1>${title}</h1>${desc?`<p class="lead">${desc}</p>`:''}</div>`;
const shell=html=>`<section class="wrap">${html}</section>`;
const crumb=(path,label)=>`<div class="breadcrumb">${link('inicio','Inicio')} / ${link(path,label)}</div>`;
function home(){return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Arquitectura · Comunidad · Conexiones</p><h1>Un espacio para<br><em>construir juntas.</em></h1><p class="lead">Conectamos miradas, compartimos experiencias y damos lugar a nuevas posibilidades en la arquitectura.</p><div class="actions">${link('voces','Sus Voces','button secondary')}${link('proyectos','Sus Obras','button secondary')}</div><p class="micro">Una comunidad por imaginar. Una maqueta para explorar.</p></div><div class="hero-art"><img src="assets/patio.svg" alt="Ilustración arquitectónica de un patio con arcos, vegetación y luz cálida" width="800" height="800"><video class="hero-video" src="assets/video_inicio.mp4" poster="assets/patio.svg" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video><div class="art-caption">${link('comunidad','DESCUBRE EL ESPACIO')}<span>Ilustración conceptual · Demo</span></div></div></section><div class="strip"><span>Miradas diversas</span><span>Conocimiento compartido</span><span>Conexiones que crecen</span></div>`;}
function directory(){return shell(heading('Arquitectas y Obras', 'Conoce a nuestras arquitectas') + `
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
    <form class="filters" id="filters" role="search"><label>Buscar arquitecta<input id="search" type="search" placeholder="Nombre, ciudad o especialidad" autocomplete="off"></label><label>Ciudad<select id="city"><option value="">Todas las ciudades</option>${[...new Set(D.people.map(p=>p.city))].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Especialidad<select id="field"><option value="">Todas las especialidades</option>${[...new Set(D.people.map(p=>p.field))].map(x=>`<option>${x}</option>`).join('')}</select></label><button type="reset" class="small">Limpiar</button></form><p id="count" class="count" role="status"></p><div class="grid" id="results"></div>`);}
function profile(id) {
  const p = D.people.find(p => p.id === id);
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
function formPage(kind,id){let target=D.people.find(x=>x.id===id),event=D.events.find(x=>x.id===id);const membership=kind==='contacto'&&id==='membresia',work=kind==='participa'&&id==='obra',publicity=kind==='contacto'&&id==='publicidad';const title=work?'Enviar obra':kind==='participa'?'Hay lugar para tu mirada.':kind==='inscripcion'?'Imaginemos el próximo encuentro.':'Conversemos.';return shell(crumb('comunidad','Comunidad')+heading('Formulario de demostración',title,'Prueba el recorrido con datos inventados. Esta maqueta no envía ni almacena información.')+`<p class="notice">${target?'Contacto de prueba con '+target.name+'. ':kind==='contacto'?'Contacto de prueba con ESPACIOaRQUITECTA. ':event?'Actividad ficticia: '+event.title+'. ':''}No se crea una cuenta, inscripción ni solicitud real. No introduzcas datos personales reales.</p><form id="demo-form" novalidate><div class="form-grid"><label>Nombre ficticio<input name="nombre" aria-label="Nombre ficticio" required minlength="2" maxlength="80" autocomplete="off" placeholder="Ej.: Andrea Demo" aria-describedby="err-nombre"><span class="error" id="err-nombre"></span></label><label>Correo ficticio<input name="correo" aria-label="Correo ficticio" type="email" required maxlength="150" autocomplete="off" placeholder="andrea@example.com" aria-describedby="err-correo"><span class="error" id="err-correo"></span></label></div><label>${work?'Tipo de obra':kind==='contacto'?'Tipo de contacto':'Interés'}<select name="interes" required aria-describedby="err-interes"><option value="">Selecciona una opción</option>${(work?['Obra construida','Proyecto','Concurso']:kind==='contacto'?['Consulta','Membresía','Participar del podcast','Ser Partner (patrocinio, publicidad u otro)']:['Conocer la comunidad','Explorar colaboración','Mentorías','Actividad demostrativa']).map(option=>`<option${(membership&&option==='Membresía'||publicity&&option==='Ser Partner (patrocinio, publicidad u otro)')?' selected':''}>${option}</option>`).join('')}</select><span class="error" id="err-interes"></span></label>${work?'<label>Archivos de la obra<input type="file" name="archivos" multiple aria-describedby="file-help"></label><p class="micro" id="file-help">Puedes seleccionar varios archivos. En esta demostración permanecen en tu dispositivo: no se suben ni se envían.</p>':''}<label>Mensaje ficticio<textarea name="mensaje" aria-label="Mensaje ficticio" required minlength="10" maxlength="1000" placeholder="Escribe al menos 10 caracteres de prueba." aria-describedby="err-mensaje"></textarea><span class="error" id="err-mensaje"></span></label><label class="check"><input name="demo" aria-label="Entiendo que es una demostración y usaré datos inventados." type="checkbox" required aria-describedby="err-demo">Entiendo que es una demostración y usaré datos inventados.<span class="error" id="err-demo"></span></label><button type="submit">Probar validación ↗</button> <button type="reset">Limpiar</button><div id="form-status" role="status" tabindex="-1" hidden></div></form>`);}
function community() {
  return shell(heading('ESPACIOaRQUITECTA', 'Quienes somos') + `
    <div class="prose community-prose">
      <p>ESPACIOaRQUITECTA nació como un podcast para escuchar las voces de mujeres vinculadas a la arquitectura: arquitectas, abogadas, agrónomas, ingenieras, que desde distintas disciplinas apuestan por un futuro sostenible. En cada conversación apareció un hilo común, ese “algo más” que une a todas: una mirada sistémica, colaboración, sensibilidad social y urbana, e innovación.</p>
      <p>Hoy damos el siguiente paso. ESPACIOaRQUITECTA LAB es una plataforma digital de colaboración, aprendizaje y encuentro para visibilizar el trabajo y la creatividad de las arquitectas de América, y para conectarlas entre sí.</p>
      <h2>Nuestra mirada</h2>
      <p>Creemos que los liderazgos de mujeres en arquitectura y construcción conectan: escuchan a los habitantes y a los contextos, cuidan la naturaleza, integran las sensibilidades culturales a las normativas y respetan la diversidad de comunidades y ciudades.</p>
      <h2>Nuestro propósito</h2>
      <p>Una plataforma de colaboración, aprendizaje, encuentro y visibilización. La forma de la solución todavía está abierta, y la construimos con la comunidad.</p>
      <h2>Quién la impulsa</h2>
      <p>Ana María Torres, arquitecta, fundadora de ESPACIOaRQUITECTA. Experta en edificación pública y proyectos complejos. Mentora y coach, disfruta inspirando y compartiendo experiencia y recetas concretas para alcanzar metas.</p>
    </div>
    <section class="founders" aria-labelledby="founders-title">
      <h2 id="founders-title">Creadoras de ESPACIOaRQUITECTA</h2>
      <div class="founders-grid">
        <article>
          <img src="assets/anita.jpeg" alt="Retrato de Ana María Torres" width="1235" height="1600" loading="lazy">
          <h3>Ana María Torres</h3>
          <p>Arquitecta Departamento de Aduanas<br>
            Creadora de ESPACIOaRQUITECTA<br>
            Co-fundadora de ESPACIOaRQUITECTA LAB</p>
        </article>
        <article>
          <img src="assets/paula.jpeg" alt="Retrato de Paula Cortés M." width="1122" height="1402" loading="lazy">
          <h3>Paula Cortés M.</h3>
          <p>Arquitecta Walmart Chile Inmobiliaria<br>
            Co-animadora Mentomujeres el Podcast<br>
            Co-fundadora de ESPACIOaRQUITECTA LAB</p>
        </article>
      </div>
    </section>`);
}

function publicationSection(publication) {
  return publication?.format === 'Podcast' ? ['voces', 'Podcast'] : ['proyectos', 'Obras'];
}

function publication(id) {
  const p = D.publications.find(p => p.id === id);
  if (!p) return missing();
  if (p.source === "sheets") return shell(crumb("proyectos","Obras") + heading("Obra",p.title,p.text) + `<p class="meta">${[p.city,p.year,p.category].filter(Boolean).join(" · ")}</p>${p.image ? `<img class="wide-image" src="${p.image}" alt="${p.alt}">` : ""}<p>${p.architectIds.map(id => D.people.find(a => a.id === id)).filter(Boolean).map(a => link("perfil/"+a.id,a.name)).join(" · ")}</p>`);
  const [returnPath, returnLabel] = publicationSection(p);
  return shell(crumb(returnPath, returnLabel) + `<article class="publication-detail">
    ${heading(p.format + ' / Publicación ficticia', p.title, p.text)}
    <p class="publication-topics"><span class="meta-label">Temática:</span> ${p.themes.map(x => `<span class="tag">${x}</span>`).join(' ')}</p>
    <img class="wide-image" src="${p.image}" alt="${p.alt}" width="1200" height="700">
    <div class="prose publication-body">${p.body.map(text => `<p>${text}</p>`).join('')}
    ${notice}</div></article>${participation.render(id)}${link(returnPath, 'Volver a ' + returnLabel + ' →', 'button secondary')}`);
}

const isidoraEpisode = {
  architectIds: ['isidora-gouet'],
  podcastTopics: ['Iluminación'],
  title: 'Luz y Arquitectura',
  text: 'En este capítulo conversamos con Isidora Gouet, arquitecta y diseñadora de iluminación de la Universidad Autónoma de Chile y referente internacional en iluminación, sobre la importancia de la luz en los proyectos de arquitectura.',
  spotifyUrl: 'https://open.spotify.com/episode/2Sp6UHBSruGMEaxjAZkRcY?si=dO6XxJG4QmyPTs5h-3TENQ&amp;utm_source=whatsapp&amp;sci=spotify%3Acard-config%3A4E9eVpzTeotVDKmOq8xykp'
};

function collectionItems(page) {
  if (page === 'voces') return [isidoraEpisode, ...D.publications.filter(p => p.format === 'Podcast')];
  return D.publications.filter(p => p.themes.includes('Proyectos'));
}
function collectionPage(page, person) {
  const isPodcast = page === 'voces';
  const title = person ? 'Obras de ' + person.name : isPodcast ? 'Sus Voces' : 'Sus Proyectos';
  const description = isPodcast
    ? 'ESPACIOaRQUITECTA: diseñando y creando con la voz de mujeres en la arquitectura'
    : person ? '' : 'Publicaciones sobre proyectos. Explora por arquitecta y tema.';
  const topics = isPodcast ? [...D.podcastTopics, ...isidoraEpisode.podcastTopics] : D.themes;
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
  return shell((person ? crumb('perfil/' + person.id, person.name) : crumb('inicio', 'Inicio')) + (isPodcast ? podcastDetails : heading(person ? 'Arquitectas y Obras' : 'Contenidos de demostración', title, description)) +
    `<form class="filters editorial-filters" id="collection-filters" aria-label="Filtros de ${title}">
      ${person ? '' : `<label>Arquitecta<select id="architect"><option value="">Todas las arquitectas</option>
        ${D.people.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        ${isPodcast ? '<option value="isidora-gouet">Isidora Gouet</option>' : ''}
        <option value="unassigned">Sin arquitecta asignada</option></select></label>`}
      <label>Tema<select id="topic"><option value="">Todos los temas</option>
        ${topics.map(t => `<option>${t}</option>`).join('')}</select></label>
      <button type="reset" class="small">Limpiar filtros</button>
    </form><p id="collection-count" class="count" role="status"></p><div class="grid${isPodcast ? ' podcast-results' : ''}" id="collection-results"></div>`);
}
function initCollectionFilters(page, person) {
  const items = collectionItems(page).filter(p => !person || p.architectIds?.includes(person.id));
  const form = document.querySelector('#collection-filters');
  const topicField = page === 'voces' ? 'podcastTopics' : 'themes';
  function update() {
    const architect = form.querySelector('#architect')?.value, topic = form.querySelector('#topic').value;
    const found = items.filter(p => (!architect || (architect === 'unassigned' ? !p.architectIds?.length : p.architectIds?.includes(architect))) && (!topic || p[topicField]?.includes(topic)));
    document.querySelector('#collection-count').textContent = `${found.length} de ${items.length} ${page === 'voces' ? 'podcasts' : 'publicaciones sobre proyectos'}`;
    document.querySelector('#collection-results').innerHTML = found.length ? found.map(p => p === isidoraEpisode ? `<article>
      <a class="card" href="${p.spotifyUrl}">
        <img class="podcast-guest-photo" src="assets/isidora.jpeg" alt="Retrato de Isidora Gouet" width="1064" height="1600" loading="lazy">
        <p class="meta">Podcast · Iluminación</p>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        <span class="arrow">Escuchar el capítulo en Spotify ↗</span>
      </a>
    </article>` : `<article>${publicationCard(p)}<p class="micro">${(p.architectIds || []).map(id => D.people.find(person => person.id === id)?.name).filter(Boolean).join(', ') || 'Sin arquitecta asignada'}</p></article>`).join('') :
      person && !items.length
      ? '<div class="empty"><h2>Esta arquitecta aún no tiene obras publicadas.</h2></div>'
      : `<div class="empty"><h2>No encontramos contenidos.</h2><p>${person ? 'Prueba otro tema o limpia los filtros.' : 'Prueba otra arquitecta o tema, o limpia los filtros.'}</p></div>`;
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
function services() {
  const offerings = [
    ['Agenda', 'Accede a la información de nuestras próximas actividades.', 'agenda', 'Ver Agenda'],
    ['Mentorías y coaching', 'Un espacio para emparejar a quien empieza con quien ya tiene recorrido.', 'servicios/mentoria', 'Conoce Mentorías y coaching ↗'],
    ['Encuentros', 'Charlas, talleres, clases, conversaciones abiertas como puerta de entrada.', 'servicios/encuentros', 'Ver artículos de encuentros']
  ];
  return shell(
    heading('ESPACIOaRQUITECTA LAB', 'ESPACIOaRQUITECTA LAB') +
    '<div class="grid">' + offerings.map(([title, description, path, label]) =>
      `<article class="person"><h2>${title}</h2><p>${description}</p>${path ? link(path, label, 'button secondary') : ''}</article>`
    ).join('') + '</div>'
  );
}

function encounters() {
  return shell(crumb('servicios', 'ESPACIOaRQUITECTA LAB') +
    heading('ESPACIOaRQUITECTA LAB', 'Encuentros',
      'Artículos elaborados a partir de encuentros realizados por ESPACIOaRQUITECTA y sus colaboradores y colaboradoras.') + `
    <div class="grid">
      <article class="person">
        <h2>${link('encuentros/' + encounterArticle.id, encounterArticle.title)}</h2>
        <p class="card-participation">${participation.summary(encounterArticle.id)}</p>
      </article>
    </div>`);
}

function encounterPublication(id) {
  if (id !== encounterArticle.id) return missing();
  return `
    <div class="wrap encounter-navigation">${crumb('servicios/encuentros', 'Encuentros')}</div>
    <article class="encounter-article">
      <div class="encounter-hero">
        <p class="encounter-brand">ESPACIOaRQUITECTA</p>
        <p class="encounter-eyebrow">Conversación abierta · Arquitectura y liderazgo</p>
        <h1>${encounterArticle.title}</h1>
        <p class="encounter-description">${encounterArticle.description}</p>
      </div>
      <div class="encounter-body">${encounterArticle.body}</div>
      <section class="encounter-closing">${encounterArticle.closing}</section>
    </article>
    ${shell(participation.render(id) + link('servicios/encuentros', 'Volver a Encuentros', 'button secondary'))}`;
}

function memberships() {
  return shell(heading('ESPACIOaRQUITECTA', 'Membresías',
    'Elige cómo quieres ser parte. Todas las membresías sostienen una comunidad que busca que más arquitectas lideren.') + `
    <div class="grid">
      <article class="person">
        <h2>Comunidad (gratuita)</h2>
        <p>Acceso a la agenda y al podcast, perfil básico en el directorio y noticias de la comunidad.</p>
      </article>
      <article class="person">
        <h2>Socia (de pago)</h2>
        <p>Perfil destacado con obras, acceso al LAB, prioridad en convocatorias de proyectos y mentorías, y descuentos en talleres.</p>
      </article>
      <article class="person">
        <h2>Mentoría con Ana María</h2>
        <p>Acompañamiento individual y programas grupales de pocas semanas, con un resultado concreto: pasar de egresada a primer proyecto, o de profesional a liderazgo. Experiencia real y herramientas para llegar a tus metas.</p>
      </article>
      <article class="person">
        <h2>Para organizaciones</h2>
        <p>Auspicios, avisos y alianzas con empresas, colegios y universidades.</p>
        <p>${link('agenda', 'Ver Agenda')} y ${link('contacto/publicidad', 'Publicidad')}</p>
      </article>
      <div class="membership-contact">${link('contacto/membresia', 'Consultar por una membresía', 'button')}</div>
    </div>`);
}
function mentoring() {
  return shell(crumb('servicios', 'ESPACIOaRQUITECTA LAB') +
    heading('ESPACIOaRQUITECTA LAB', 'Mentoría y coaching', 'Acompañamiento práctico para avanzar hacia un resultado concreto.') +
    '<p class="lead">Servicio aparte de las membresías, con sesiones individuales y programas grupales de pocas semanas.</p>' +
    '<div class="grid"><article class="person"><h2>De egresada a primer proyecto</h2><p>Define los pasos para convertir tus conocimientos en un primer proyecto.</p></article>' +
    '<article class="person"><h2>De profesional a liderazgo</h2><p>Trabaja un objetivo de liderazgo con pasos concretos para tu práctica profesional.</p></article></div>' +
    '<p class="notice" style="margin-top:32px">Programas propuestos. Fechas, duración específica, precios y condiciones por definir.</p>' +
    link('servicios', 'Volver al LAB →', 'button secondary'));
}

function missing(){return shell(heading('Contenido no encontrado','Volvamos a encontrarnos.')+link('inicio','Volver al inicio','button'));}
function render() {
  if (location.hash === '#main') { main.focus(); return; }
  const [page, id] = (location.hash.replace(/^#\/?/, '') || 'inicio').split('/');
  const person = page === 'proyectos' && id ? D.people.find(p => p.id === id) : undefined;
  let html;
  switch (page) {
    case 'inicio': html = home(); break;
    case 'comunidad': html = community(); break;
    case 'servicios':
      if (id === 'encuentros') html = encounters();
      else html = id === 'mentoria' ? mentoring() : services();
      break;
    case 'encuentros': html = encounterPublication(id); break;
    case 'membresias': html = memberships(); break;
    case 'directorio': html = directory(); break;
    case 'perfil': html = profile(id); break;
    case 'voces':
    case 'proyectos': html = id && page === 'proyectos' && !person ? missing() : collectionPage(page, person); break;
    case 'publicacion': html = publication(id); break;
    case 'agenda':
      html = shell(heading('Agenda / Actividades ficticias', 'Encontrarnos abre caminos.',
        'Fechas ilustrativas, sin convocatoria vigente ni inscripciones reales. Año de referencia: 2026.') + notice + D.events.map(eventRow).join(''));
      break;
    case 'actividad': {
      const e = D.events.find(x => x.id === id);
      html = e ? shell(crumb('agenda', 'Agenda') + heading(e.type, e.title, e.text) + notice +
        `<p>${e.day} de ${e.month.toLowerCase()} · 2026 · Fecha ilustrativa, no confirmada</p>` +
        link('inscripcion/' + e.id, 'Probar inscripción demostrativa ↗', 'button') +
        '<h2 style="margin-top:55px">Sigue conectando</h2>' + link('directorio', 'Explorar profesionales →')) : missing();
      break;
    }
    case 'contacto':
      html = !id || id === 'publicidad' || id === 'membresia' || D.people.some(p => p.id === id) ? formPage(page, id) : missing(); break;
    case 'inscripcion':
      html = D.events.some(e => e.id === id) ? formPage(page, id) : missing(); break;
    case 'participa': html = id === 'membresia' ? memberships() : formPage(page, id); break;
    default: html = missing();
  }
  main.innerHTML = html;
  nav.querySelector('.join-menu').open = false;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  const navigationPage = page === 'publicacion' ? publicationSection(D.publications.find(p => p.id === id))[0] : page;
  const activePage = person ? 'directorio' : page === 'participa' && id === 'membresia' ? 'membresias' : page === 'contacto' && id === 'membresia' ? 'contacto' : page === 'contacto' && !id ? 'comunidad' : {encuentros:'servicios', proyectos:'directorio', perfil:'directorio', contacto:'directorio', actividad:'agenda', inscripcion:'agenda'}[navigationPage] || navigationPage;
  nav.querySelectorAll('a').forEach(a => {
    if (a.hash === '#/' + activePage) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = (main.querySelector('h1')?.textContent || 'Inicio') + ' · ESPACIOaRQUITECTA · Demo';
  window.scrollTo(0, 0);
  if (location.hash) main.focus({preventScroll:true});
  if (page === 'inicio') initHeroVideo();
  if (page === 'directorio') initFilters();
  if (document.querySelector('#collection-filters')) initCollectionFilters(page, person);
  if (document.querySelector('#demo-form')) initForm();
  if (document.querySelector('#editorial-participation')) participation.mount(id);
}
function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function initFilters(){const f=document.querySelector('#filters');function update(){const q=normalize(f.querySelector('#search').value.trim()),city=f.querySelector('#city').value,field=f.querySelector('#field').value;const found=D.people.filter(p=>(!city||p.city===city)&&(!field||p.field===field)&&normalize(p.name+' '+p.city+' '+p.field).includes(q));document.querySelector('#count').textContent=`${found.length} de ${D.people.length} perfiles`;document.querySelector('#results').innerHTML=architectLoadState === 'loading' ? '<p role="status">Cargando arquitectas…</p>' : architectLoadState === 'error' ? '<p role="alert">No fue posible cargar el directorio. Recarga la página para volver a intentar.</p>' : found.length?found.map(personCard).join(''):'<div class="empty"><h2>No encontramos coincidencias.</h2><p>Prueba otra búsqueda o limpia los filtros.</p></div>';}
f.addEventListener('input',update);f.addEventListener('change',update);f.addEventListener('submit',e=>e.preventDefault());f.addEventListener('reset',()=>setTimeout(update,0));update();}
function initForm(){const form=document.querySelector('#demo-form'),status=document.querySelector('#form-status');function clear(){status.hidden=true;form.querySelectorAll('.error').forEach(x=>x.textContent='');form.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));}form.addEventListener('reset',clear);form.addEventListener('submit',e=>{e.preventDefault();clear();let first;for(const name of ['nombre','correo','interes','mensaje','demo']){const field=form.elements[name];let msg='';if(name==='demo'&&!field.checked)msg='Confirma que comprendes el carácter demostrativo.';else if(name!=='demo'&&!field.value.trim())msg='Completa este campo con datos ficticios.';else if(name==='nombre'&&field.value.trim().length<2)msg='Escribe al menos 2 caracteres.';else if(name==='correo'&&field.validity.typeMismatch)msg='Usa un formato como nombre@example.com.';else if(name==='mensaje'&&field.value.trim().length<10)msg='Escribe al menos 10 caracteres.';if(msg){document.querySelector('#err-'+name).textContent=msg;field.setAttribute('aria-invalid','true');first??=field;}}if(first){first.focus();return;}form.reset();status.className='form-status';status.hidden=false;status.textContent='Prueba completada: los campos cumplen la validación básica. No se envió ni registró información. La organización no ha recibido ninguna solicitud.';status.focus();});}
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  const fallback = () => video.classList.remove('is-playing');
  video.muted = true;
  video.addEventListener('playing', () => video.classList.add('is-playing'));
  video.addEventListener('error', fallback);
  video.play().catch(fallback);
}
document.addEventListener('click', e => { const dropdown=nav.querySelector('.join-menu'); if(!dropdown.contains(e.target)) dropdown.open=false; });
// Cerrar también al elegir la sección que ya está abierta en el menú móvil.
nav.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.querySelector('.join-menu').open = false; nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.addEventListener('keydown',e=>{if(e.key==='Escape'){const dropdown=nav.querySelector('.join-menu');if(dropdown.open){dropdown.open=false;dropdown.querySelector('summary').focus();return;}nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
/* POC: perfiles publicados en Google Sheets. Conserva los datos demo. */
async function loadSheetArchitects() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbw7sUy_4oc40s5NzPli_f2dyfIX9G8wkIs-j4iFYUew0mcaOeGu7YIOyOn6OF3d2CGM4A/exec', {signal: controller.signal, cache: 'no-store', credentials: 'omit'});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Formato inesperado');
    const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const publicUrl = value => { try { const url = new URL(value); if (url.protocol !== 'https:') return ''; const match = url.hostname === 'drive.google.com' && url.pathname.match(/^\/file\/d\/([\w-]+)/); const driveId = url.hostname === 'drive.google.com' ? (match?.[1] || url.searchParams.get('id')) : null; return safe(driveId && /^[\w-]+$/.test(driveId) ? 'https://drive.google.com/thumbnail?id=' + driveId + '&sz=w1000' : url.href); } catch { return ''; } };
    const ids = new Set(D.people.map(p => p.id));
    for (const row of rows) {
      if (!row || typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(row.id) || ids.has(row.id) || typeof row.name !== 'string' || !row.name.trim()) continue;
      const career = Array.isArray(row.career) ? row.career.filter(x => Array.isArray(x) && Array.isArray(x[1])).map(([title, items]) => [safe(title), items.map(safe)]) : [];
      const p = {id: row.id, name: safe(row.name), city: safe(row.city), field: safe(row.field), bio: safe(row.bio), initials: safe(row.name.trim().split(/\s+/).slice(0,2).map(n => n[0]).join('').toUpperCase()), color: '#A7E3DD', photo: publicUrl(row.photo), source: 'sheets', career};
      D.people.push(p);
      for (const w of Array.isArray(row.works) ? row.works : []) {
        if (!w || typeof w.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(w.id) || !w.title) continue;
        const id = 'sheet-work-' + w.id;
        let work = D.publications.find(x => x.id === id);
        if (!work) {
          work = {id, source:'sheets', title:safe(w.title), format:'Artículo escrito', themes:['Proyectos'], image:publicUrl(w.photo), alt:safe(w.title), text:safe(w.description), body:[safe(w.description)], city:safe(w.city), year:safe(w.year), category:safe(w.category), architectIds:[]};
          D.publications.push(work);
        }
        if (!work.architectIds.includes(p.id)) work.architectIds.push(p.id);
      }
      ids.add(row.id);
    }
    architectLoadState = 'ready';
    if (/^#\/(directorio|perfil|proyectos|contacto|publicacion|voces)(\/|$)/.test(location.hash)) render();
  } catch (error) {
    architectLoadState = 'error';
    console.warn('POC Google Sheets: no se pudieron cargar los perfiles.', error);
    if (/^#\/?(directorio|perfil|proyectos|contacto)(\/|$)/.test(location.hash)) render();
  } finally {
    clearTimeout(timeout);
  }
}
window.addEventListener('hashchange',render);render();loadSheetArchitects();
})();
