/* Navegación por hash compatible con file:// y alojamiento estático. Sin backend ni persistencia. */
(() => {
'use strict';
const D=window.DEMO, encounterArticle=window.EncounterArticle, participation=window.EditorialParticipation, main=document.querySelector('main'), nav=document.querySelector('nav'), menu=document.querySelector('.menu');
const link=(path,text,cls='')=>`<a class="${cls}" href="#/${path}">${text}</a>`;
const notice='<p class="notice">Demostración: perfiles ilustrativos, publicaciones y actividades de demostración. No representan servicios ni convocatorias reales.</p>';
const publicationCard = p => `<a class="card" href="#/publicacion/${p.id}">
  <img src="${p.image}" alt="${p.alt}" loading="lazy" width="600" height="450">
  <p class="meta">${p.format} · ${p.themes.join(' / ')}</p>
  <h3>${p.title}</h3><p>${p.text}</p><span class="card-participation">${participation.summary(p.id)}</span><span class="arrow">Ver publicación ↗</span></a>`;
const personCard=p=>`<a class="card person" href="#/perfil/${p.id}">${p.photo ? `<img class="person-photo" src="${p.photo}" alt="" width="1125" height="1079" loading="lazy">` : `<div class="avatar" style="background:${p.color}" aria-hidden="true">${p.initials}</div>`}<span class="tag">${p.field}</span><h3>${p.name}</h3><p>${p.city}${p.career ? "" : " · Perfil ficticio"}</p><span class="arrow">Conocer su mirada ↗</span></a>`;
const eventRow=e=>`<article class="event"><div class="date"><strong>${e.day}</strong>${e.month}</div><div><h3>${link('actividad/'+e.id,e.title)}</h3><p>${e.type} · Actividad ficticia</p></div>${link('actividad/'+e.id,'Ver actividad ↗','button secondary small')}</article>`;
const heading=(k,title,desc='')=>`<div class="intro"><p class="eyebrow">${k}</p><h1>${title}</h1>${desc?`<p class="lead">${desc}</p>`:''}</div>`;
const shell=html=>`<section class="wrap">${html}</section>`;
const crumb=(path,label)=>`<div class="breadcrumb">${link('inicio','Inicio')} / ${link(path,label)}</div>`;
function home(){return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Arquitectura · Comunidad · Conexiones</p><h1>Un espacio para<br><em>construir juntas.</em></h1><p class="lead">Conectamos miradas, compartimos experiencias y damos lugar a nuevas posibilidades en la arquitectura.</p><div class="actions">${link('voces','Sus Voces','button secondary')}${link('proyectos','Sus Obras','button secondary')}</div><p class="micro">Una comunidad por imaginar. Una maqueta para explorar.</p></div><div class="hero-art"><img src="assets/patio.svg" alt="Ilustración arquitectónica de un patio con arcos, vegetación y luz cálida" width="800" height="800"><video class="hero-video" src="assets/video_inicio.mp4" poster="assets/patio.svg" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video><div class="art-caption">${link('comunidad','DESCUBRE EL ESPACIO')}<span>Ilustración conceptual · Demo</span></div></div></section><div class="strip"><span>Miradas diversas</span><span>Conocimiento compartido</span><span>Conexiones que crecen</span></div>`;}
function directory(){return shell(heading('Arquitectas y Obras', 'Conoce a nuestras arquitectas') + `
    <div class="prose directory-prose">
      <p>Aquí están las arquitectas y lo que han construido. Un directorio para encontrarnos, reconocernos y recomendarnos, y para que las obras hablen tanto como las voces.</p>
      <p><strong>Cómo explorar</strong> Busca por perfil o por obra, y filtra por región, especialidad, tipo de proyecto o etapa profesional.</p>
      <p><strong>Qué muestra cada perfil</strong> Nombre y trayectoria · especialidad · región · obras destacadas con fotos y una breve descripción · enlaces a su sitio y redes · si está disponible para colaborar o mentorar.</p>
      <p><strong>Qué muestra cada obra</strong> Nombre, ubicación y año · arquitecta o equipo · desafío que resolvió · qué la hace distinta.</p>
      <p><strong>Convocatoria</strong> ¿Eres arquitecta y quieres aparecer? Hay un lugar para quien empieza, para quien consolida y para quien se está reinventando. ${link('participa', 'Formulario de postulación')}</p>
    </div>
    <form class="filters" id="filters" role="search"><label>Buscar arquitecta<input id="search" type="search" placeholder="Nombre, ciudad o especialidad" autocomplete="off"></label><label>Ciudad<select id="city"><option value="">Todas las ciudades</option>${[...new Set(D.people.map(p=>p.city))].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Especialidad<select id="field"><option value="">Todas las especialidades</option>${[...new Set(D.people.map(p=>p.field))].map(x=>`<option>${x}</option>`).join('')}</select></label><button type="reset" class="small">Limpiar</button></form><p id="count" class="count" role="status"></p><div class="grid" id="results"></div>`);}
function profile(id) {
  const p = D.people.find(p => p.id === id);
  if (!p) return missing();
  if (p.career) {
    return shell(crumb('directorio', 'Directorio') + `
      <div class="profile-head">
        <div>
          ${heading('Perfil profesional', p.name, p.bio)}
          <span class="tag">${p.field} · ${p.city}</span>
          <div class="actions">${link('contacto/' + p.id, 'Formulario de contacto ↗', 'button')}</div>
        </div>
        <img class="profile-photo" src="${p.photo}" alt="Retrato de ${p.name}" width="1125" height="1079">
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
      ${link('contacto/' + p.id, 'Probar contacto demostrativo ↗', 'button')}
    </div><div class="profile-visual"><div class="avatar" style="background:${p.color}"
      aria-label="Monograma de ${p.name}">${p.initials}</div></div></div>${notice}`);
}
function formPage(kind,id){let target=D.people.find(x=>x.id===id),event=D.events.find(x=>x.id===id);const membership=kind==='participa'&&id==='membresia',work=kind==='participa'&&id==='obra',publicity=kind==='contacto'&&id==='publicidad';const title=membership?'Acceder a Membresía':work?'Enviar obra':kind==='participa'?'Hay lugar para tu mirada.':kind==='inscripcion'?'Imaginemos el próximo encuentro.':'Conversemos.';return shell(crumb('comunidad','Comunidad')+heading('Formulario de demostración',title,'Prueba el recorrido con datos inventados. Esta maqueta no envía ni almacena información.')+`<p class="notice">${target?'Contacto de prueba con '+target.name+'. ':kind==='contacto'?'Contacto de prueba con Espacio Arquitecta. ':event?'Actividad ficticia: '+event.title+'. ':''}No se crea una cuenta, inscripción ni solicitud real. No introduzcas datos personales reales.</p><form id="demo-form" novalidate><div class="form-grid"><label>Nombre ficticio<input name="nombre" aria-label="Nombre ficticio" required minlength="2" maxlength="80" autocomplete="off" placeholder="Ej.: Andrea Demo" aria-describedby="err-nombre"><span class="error" id="err-nombre"></span></label><label>Correo ficticio<input name="correo" aria-label="Correo ficticio" type="email" required maxlength="150" autocomplete="off" placeholder="andrea@example.com" aria-describedby="err-correo"><span class="error" id="err-correo"></span></label></div><label>${membership?'Plan de membresía':work?'Tipo de obra':kind==='contacto'?'Tipo de contacto':'Interés'}<select name="interes" required aria-describedby="err-interes"><option value="">Selecciona una opción</option>${(membership?['Membresía gratuita','Membresía de pago']:work?['Obra construida','Proyecto','Concurso']:kind==='contacto'?['Consulta','Participar del podcast','Ser Partner (patrocinio, publicidad u otro)']:['Conocer la comunidad','Explorar colaboración','Mentorías','Actividad demostrativa']).map(option=>`<option${publicity&&option==='Ser Partner (patrocinio, publicidad u otro)'?' selected':''}>${option}</option>`).join('')}</select><span class="error" id="err-interes"></span></label>${work?'<label>Archivos de la obra<input type="file" name="archivos" multiple aria-describedby="file-help"></label><p class="micro" id="file-help">Puedes seleccionar varios archivos. En esta demostración permanecen en tu dispositivo: no se suben ni se envían.</p>':''}<label>Mensaje ficticio<textarea name="mensaje" aria-label="Mensaje ficticio" required minlength="10" maxlength="1000" placeholder="Escribe al menos 10 caracteres de prueba." aria-describedby="err-mensaje"></textarea><span class="error" id="err-mensaje"></span></label><label class="check"><input name="demo" aria-label="Entiendo que es una demostración y usaré datos inventados." type="checkbox" required aria-describedby="err-demo">Entiendo que es una demostración y usaré datos inventados.<span class="error" id="err-demo"></span></label><button type="submit">Probar validación ↗</button> <button type="reset">Limpiar</button><div id="form-status" role="status" tabindex="-1" hidden></div></form>`);}
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
      <h2 id="founders-title">Creadoras de Espacio Arquitecta</h2>
      <div class="founders-grid">
        <article>
          <img src="assets/anita.jpeg" alt="Retrato de Ana María Torres" width="1235" height="1600" loading="lazy">
          <h3>Ana María Torres</h3>
          <p>Arquitecta Departamento de Aduanas<br>
            Creadora de ESPACIOaRQUITECTA<br>
            Co-fundadora de ESPACIOaRQUITECTALAB</p>
        </article>
        <article>
          <img src="assets/paula.jpeg" alt="Retrato de Paula Cortés M." width="1122" height="1402" loading="lazy">
          <h3>Paula Cortés M.</h3>
          <p>Arquitecta Walmart Chile Inmobiliaria<br>
            Co-animadora Mentomujeres el Podcast<br>
            Co-fundadora de ESPACIOaRQUITECTALAB</p>
        </article>
      </div>
    </section>`);
}

function editorial() {
  return shell(heading('Editorial / Publicaciones de demostración', 'Ideas que nos encuentran.',
    'Personas, obras y conversaciones que amplían nuestra mirada. Explora por formato, por temática o combina ambos filtros.') + `
    <form class="filters editorial-filters" id="editorial-filters" aria-label="Filtros de publicaciones">
      <label for="format">Formato<select id="format"><option value="">Todos los formatos</option>
        ${D.formats.map(x => `<option>${x}</option>`).join('')}</select></label>
      <label for="theme">Temática<select id="theme"><option value="">Todas las temáticas</option>
        ${D.themes.map(x => `<option>${x}</option>`).join('')}</select></label>
      <button type="reset" class="small">Limpiar filtros</button>
    </form><p id="editorial-count" class="count" role="status"></p>
    <div class="grid" id="publications"></div>`);
}

function publication(id) {
  const p = D.publications.find(p => p.id === id);
  if (!p) return missing();
  const media = p.video ? `<video id="publication-video" controls playsinline preload="none"
    poster="${p.image}" aria-label="${p.title}"></video>
    <p id="video-help" class="micro">Animación conceptual local, sin audio. No es material institucional.</p>` :
    `<img class="wide-image" src="${p.image}" alt="${p.alt}" width="1200" height="700">`;
  return shell(crumb('editorial', 'Editorial') + `<article class="publication-detail">
    ${heading(p.format + ' / Publicación ficticia', p.title, p.text)}
    <p class="publication-topics"><span class="meta-label">Temática:</span> ${p.themes.map(x => `<span class="tag">${x}</span>`).join(' ')}</p>
    ${media}<div class="prose publication-body">${p.body.map(text => `<p>${text}</p>`).join('')}
    ${notice}</div></article>${participation.render(id)}${link('editorial', 'Volver a Editorial →', 'button secondary')}`);
}

// Una sola colección: pertenecer a varias temáticas no duplica la publicación.
function initEditorialFilters() {
  const form = document.querySelector('#editorial-filters');
  function update() {
    const format = form.querySelector('#format').value;
    const theme = form.querySelector('#theme').value;
    const found = D.publications.filter(p => (!format || p.format === format) && (!theme || p.themes.includes(theme)));
    document.querySelector('#editorial-count').textContent = `${found.length} de ${D.publications.length} publicaciones ficticias`;
    document.querySelector('#publications').innerHTML = found.length ? found.map(publicationCard).join('') :
      '<div class="empty"><h2>No encontramos publicaciones.</h2><p>Prueba otro formato o temática, o limpia los filtros.</p></div>';
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
// Listados temáticos: reutilizan los detalles editoriales y sus identificadores.
function collectionItems(page) {
  return D.publications.filter(p => page === 'voces' ? p.format === 'Podcast' : p.themes.includes('Proyectos'));
}
function collectionPage(page) {
  const isPodcast = page === 'voces';
  const title = isPodcast ? 'Sus Voces' : 'Sus Proyectos';
  const description = isPodcast
    ? 'ESPACIOaRQUITECTA: diseñando y creando con la voz de mujeres en la arquitectura'
    : 'Publicaciones sobre proyectos. Explora por arquitecta y tema.';
  const topics = isPodcast ? D.podcastTopics : D.themes;
  const podcastDetails = isPodcast
    ? `<p class="prose">Conversaciones inspiradoras con arquitectas, abogadas, agrónomas e ingenieras que están dando forma al entorno que habitamos. Desde espacios públicos accesibles hasta espacios seguros, del buen construir y otras complejidades del campo, escuchamos cómo se lidera, se crea y se colabora desde una mirada femenina.</p>
      <p><a class="button" href="https://open.spotify.com/show/2gKyb8o620HxBYZ4spyAE0">Escuchar Espacio Arquitecta en Spotify ↗</a></p>
      <p>25 episodios · 25 voces en la temporada 1</p>
      ${link('contacto', '¿Quieres contar tu historia?', 'button secondary')}`
    : '';
  return shell(crumb('inicio', 'Inicio') + heading(isPodcast ? 'Podcast' : 'Contenidos de demostración', title, description) + podcastDetails +
    `<form class="filters editorial-filters" id="collection-filters" aria-label="Filtros de ${title}">
      <label>Arquitecta<select id="architect"><option value="">Todas las arquitectas</option>
        ${D.people.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        <option value="unassigned">Sin arquitecta asignada</option></select></label>
      <label>Tema<select id="topic"><option value="">Todos los temas</option>
        ${topics.map(t => `<option>${t}</option>`).join('')}</select></label>
      <button type="reset" class="small">Limpiar filtros</button>
    </form><p id="collection-count" class="count" role="status"></p><div class="grid" id="collection-results"></div>`);
}
function initCollectionFilters(page) {
  const items = collectionItems(page), form = document.querySelector('#collection-filters');
  const topicField = page === 'voces' ? 'podcastTopics' : 'themes';
  function update() {
    const architect = form.querySelector('#architect').value, topic = form.querySelector('#topic').value;
    const found = items.filter(p => (!architect || (architect === 'unassigned' ? !p.architectIds?.length : p.architectIds?.includes(architect))) && (!topic || p[topicField]?.includes(topic)));
    document.querySelector('#collection-count').textContent = `${found.length} de ${items.length} ${page === 'voces' ? 'podcasts' : 'publicaciones sobre proyectos'}`;
    document.querySelector('#collection-results').innerHTML = found.length ? found.map(p => `<article>${publicationCard(p)}<p class="micro">${(p.architectIds || []).map(id => D.people.find(person => person.id === id)?.name).filter(Boolean).join(', ') || 'Sin arquitecta asignada'}</p></article>`).join('') :
      '<div class="empty"><h2>No encontramos contenidos.</h2><p>Prueba otra arquitecta o tema, o limpia los filtros.</p></div>';
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
function services() {
  const offerings = [
    ['Proyectos en conjunto', 'Convocatorias para formar equipos (concursos, licitaciones, proyectos complejos).'],
    ['Mentorías y coaching', 'Un espacio para emparejar a quien empieza con quien ya tiene recorrido.', 'servicios/mentoria', 'Conoce Mentorías y coaching ↗'],
    ['Encuentros', 'Charlas, talleres, clases, conversaciones abiertas como puerta de entrada.', 'servicios/encuentros', 'Ver artículos de encuentros']
  ];
  return shell(
    heading('Espacio ArquitectaLAB', 'Espacio ArquitectaLAB') +
    '<div class="grid">' + offerings.map(([title, description, path, label]) =>
      `<article class="person"><h2>${title}</h2><p>${description}</p>${path ? link(path, label, 'button secondary') : ''}</article>`
    ).join('') + '</div>'
  );
}

function encounters() {
  return shell(crumb('servicios', 'Espacio ArquitectaLAB') +
    heading('Espacio ArquitectaLAB', 'Encuentros',
      'Artículos elaborados a partir de encuentros realizados por Espacio Arquitecta y sus colaboradores y colaboradoras.') + `
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
  return shell(heading('Espacio Arquitecta', 'Membresías', 'Distintas formas de crecer en comunidad y fortalecer tu trayectoria.') +
    '<div class="grid">' +
    '<article class="person"><h2>Membresía gratuita</h2><p>Perfil básico, acceso a la agenda y al podcast. Para crecer en comunidad.</p></article>' +
    '<article class="person"><h2>Membresía de pago</h2><p>Perfil destacado con obras, acceso al LAB, descuentos en talleres y prioridad en convocatorias.</p></article>' +
    '<article class="person"><h2>Mentoría y coaching</h2><p>Un servicio aparte dentro del LAB: sesiones individuales y programas grupales de pocas semanas, orientados a un resultado concreto.</p>' +
    link('servicios/mentoria', 'Conoce Mentoría y coaching ↗', 'button secondary') + '</article>' +
    '<article class="person"><h2>Publicidad y avisos</h2><p>Auspicios de empresas y colegios, y avisos de empleo o concursos.</p>' +
    link('avisos', 'Ver avisos ↗', 'button secondary') + '</article></div>' +
    '<p class="notice" style="margin-top:32px">Propuesta de membresías y servicios. Precios, fechas y condiciones por definir; todavía no hay contratación ni pagos habilitados.</p>');
}
function mentoring() {
  return shell(crumb('servicios', 'Espacio ArquitectaLAB') +
    heading('Espacio ArquitectaLAB', 'Mentoría y coaching', 'Acompañamiento práctico para avanzar hacia un resultado concreto.') +
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
    case 'proyectos': html = collectionPage(page); break;
    case 'editorial': html = editorial(); break;
    case 'publicacion': html = publication(id); break;
    case 'avisos': html = shell(heading('Comunidad', 'Avisos', 'No hay avisos publicados por el momento.')); break;
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
      html = !id || id === 'publicidad' || D.people.some(p => p.id === id) ? formPage(page, id) : missing(); break;
    case 'inscripcion':
      html = D.events.some(e => e.id === id) ? formPage(page, id) : missing(); break;
    case 'participa': html = formPage(page, id); break;
    default: html = missing();
  }
  main.innerHTML = html;
  nav.querySelector('.join-menu').open = false;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  const activePage = page === 'contacto' && !id ? 'comunidad' : {encuentros:'servicios', proyectos:'editorial', perfil:'directorio', contacto:'directorio', actividad:'agenda', inscripcion:'agenda', publicacion:'editorial'}[page] || page;
  nav.querySelectorAll('a').forEach(a => {
    if (a.hash === '#/' + activePage) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = (main.querySelector('h1')?.textContent || 'Inicio') + ' · Espacio Arquitecta · Demo';
  window.scrollTo(0, 0);
  if (location.hash) main.focus({preventScroll:true});
  if (page === 'inicio') initHeroVideo();
  if (page === 'directorio') initFilters();
  if (page === 'editorial') initEditorialFilters();
  if (page === 'voces' || page === 'proyectos') initCollectionFilters(page);
  if (document.querySelector('#demo-form')) initForm();
  if (document.querySelector('#publication-video')) initVideo();
  if (document.querySelector('#editorial-participation')) participation.mount(id);
}
function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function initFilters(){const f=document.querySelector('#filters');function update(){const q=normalize(f.querySelector('#search').value.trim()),city=f.querySelector('#city').value,field=f.querySelector('#field').value;const found=D.people.filter(p=>(!city||p.city===city)&&(!field||p.field===field)&&normalize(p.name+' '+p.city+' '+p.field).includes(q));document.querySelector('#count').textContent=`${found.length} de ${D.people.length} perfiles`;document.querySelector('#results').innerHTML=found.length?found.map(personCard).join(''):'<div class="empty"><h2>No encontramos coincidencias.</h2><p>Prueba otra búsqueda o limpia los filtros.</p></div>';}
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
function initVideo() {
  const video = document.querySelector('#publication-video');
  video.src = 'assets/espacio-demo.webm';
  video.addEventListener('error', () => {
    document.querySelector('#video-help').textContent = 'Este navegador no pudo reproducir el video WebM. Puedes leer el texto de la publicación.';
  });
}
document.addEventListener('click', e => { const dropdown=nav.querySelector('.join-menu'); if(!dropdown.contains(e.target)) dropdown.open=false; });
// Cerrar también al elegir la sección que ya está abierta en el menú móvil.
nav.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.querySelector('.join-menu').open = false; nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.addEventListener('keydown',e=>{if(e.key==='Escape'){const dropdown=nav.querySelector('.join-menu');if(dropdown.open){dropdown.open=false;dropdown.querySelector('summary').focus();return;}nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});window.addEventListener('hashchange',render);render();
})();
