/* Navegación por hash compatible con file:// y alojamiento estático. Sin backend ni persistencia. */
(() => {
'use strict';
const D=window.DEMO, participation=window.EditorialParticipation, main=document.querySelector('main'), nav=document.querySelector('nav'), menu=document.querySelector('.menu');
const link=(path,text,cls='')=>`<a class="${cls}" href="#/${path}">${text}</a>`;
const notice='<p class="notice">Demostración: personas, publicaciones y actividades ficticias. No representan servicios ni convocatorias reales.</p>';
const publicationCard = p => `<a class="card" href="#/publicacion/${p.id}">
  <img src="${p.image}" alt="${p.alt}" loading="lazy" width="600" height="450">
  <p class="meta">${p.format} · ${p.themes.join(' / ')}</p>
  <h3>${p.title}</h3><p>${p.text}</p><span class="card-participation">${participation.summary(p.id)}</span><span class="arrow">Ver publicación ↗</span></a>`;
const personCard=p=>`<a class="card person" href="#/perfil/${p.id}"><div class="avatar" style="background:${p.color}" aria-hidden="true">${p.initials}</div><span class="tag">${p.field}</span><h3>${p.name}</h3><p>${p.city} · Perfil ficticio</p><span class="arrow">Conocer su mirada ↗</span></a>`;
const eventRow=e=>`<article class="event"><div class="date"><strong>${e.day}</strong>${e.month}</div><div><h3>${link('actividad/'+e.id,e.title)}</h3><p>${e.type} · Actividad ficticia</p></div>${link('actividad/'+e.id,'Ver actividad ↗','button secondary small')}</article>`;
const heading=(k,title,desc='')=>`<div class="intro"><p class="eyebrow">${k}</p><h1>${title}</h1>${desc?`<p class="lead">${desc}</p>`:''}</div>`;
const shell=html=>`<section class="wrap">${html}</section>`;
const crumb=(path,label)=>`<div class="breadcrumb">${link('inicio','Inicio')} / ${link(path,label)}</div>`;
function home(){return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Arquitectura · Comunidad · Conexiones</p><h1>Un espacio para<br><em>construir juntas.</em></h1><p class="lead">Conectamos miradas, compartimos experiencias y damos lugar a nuevas posibilidades en la arquitectura.</p><div class="actions">${link('directorio','Conoce a las arquitectas ↗','button')}${link('voces','Sus Voces','button secondary')}${link('proyectos','Sus Proyectos','button secondary')}</div><p class="micro">Una comunidad por imaginar. Una maqueta para explorar.</p></div><div class="hero-art"><img src="assets/patio.svg" alt="Ilustración arquitectónica de un patio con arcos, vegetación y luz cálida" width="800" height="800"><video class="hero-video" src="assets/video_inicio.mp4" poster="assets/patio.svg" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video><div class="art-caption">${link('comunidad','01 / HABITAR EL ENCUENTRO ↗')}<span>Ilustración conceptual · Demo</span></div></div></section><div class="strip"><span>Miradas diversas</span><span>Conocimiento compartido</span><span>Conexiones que crecen</span></div><section class="wrap"><div class="section-heading"><div><p class="eyebrow">El valor de encontrarnos</p><h2>Distintas trayectorias.<br>Un horizonte compartido.</h2></div><p class="lead">Un lugar para visibilizar el trabajo de arquitectas y explorar nuevas formas de colaboración.</p></div><div class="grid">${D.people.slice(0,3).map(personCard).join('')}</div><div class="actions">${link('directorio','Explorar el directorio completo →','button secondary')}</div></section><section class="band"><div class="wrap split"><div><p class="eyebrow">Somos espacio</p><h2>La arquitectura crece<br>cuando se comparte.</h2><p>Imaginamos una red que abra conversaciones entre generaciones, territorios y formas de ejercer.</p>${link('participa','Explora cómo participar ↗','button')}</div><div>${[['01','Hacer visible','Dar espacio a diversas prácticas y trayectorias profesionales.'],['02','Compartir saberes','Imaginar encuentros, mentorías y aprendizajes colectivos.'],['03','Tejer conexiones','Acercar personas, ideas y oportunidades de colaboración.']].map(x=>`<div class="feature"><span class="number">${x[0]}</span><div><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join('')}</div></div></section><section class="wrap"><div class="section-heading"><div><p class="eyebrow">Editorial / Publicaciones de demostración</p><h2>Ideas que nos encuentran.</h2></div>${link('editorial','Explorar Editorial ↗')}</div><div class="grid">${D.publications.slice(0,3).map(publicationCard).join('')}</div></section><section class="wrap"><div class="section-heading"><div><p class="eyebrow">Agenda imaginada</p><h2>Próximos encuentros.</h2></div>${link('agenda','Explorar agenda ↗')}</div>${eventRow(D.events[0])}</section>`;}
function directory(){return shell(heading('Directorio / Perfiles ficticios','Talento que conecta.','Explora distintas miradas de la arquitectura. Busca por nombre, ciudad o especialidad.')+`<form class="filters" id="filters" role="search"><label>Buscar arquitecta<input id="search" type="search" placeholder="Nombre, ciudad o especialidad" autocomplete="off"></label><label>Ciudad<select id="city"><option value="">Todas las ciudades</option>${[...new Set(D.people.map(p=>p.city))].map(x=>`<option>${x}</option>`).join('')}</select></label><label>Especialidad<select id="field"><option value="">Todas las especialidades</option>${[...new Set(D.people.map(p=>p.field))].map(x=>`<option>${x}</option>`).join('')}</select></label><button type="reset" class="small">Limpiar</button></form><p id="count" class="count" role="status"></p><div class="grid" id="results"></div>`);}
function profile(id) {
  const p = D.people.find(p => p.id === id);
  if (!p) return missing();
  return shell(crumb('directorio', 'Directorio') + `
    <div class="profile-head"><div><p class="eyebrow">Arquitecta / Perfil ficticio</p>
      <h1>${p.name}</h1><span class="tag">${p.field} · ${p.city}</span>
      <p class="lead">${p.bio}</p>
      ${link('contacto/' + p.id, 'Probar contacto demostrativo ↗', 'button')}
    </div><div class="profile-visual"><div class="avatar" style="background:${p.color}"
      aria-label="Monograma de ${p.name}">${p.initials}</div></div></div>${notice}`);
}
function formPage(kind,id){let target=D.people.find(x=>x.id===id),event=D.events.find(x=>x.id===id);const title=kind==='participa'?'Hay lugar para tu mirada.':kind==='inscripcion'?'Imaginemos el próximo encuentro.':'Conversemos.';return shell(crumb('comunidad','Comunidad')+heading('Formulario de demostración',title,'Prueba el recorrido con datos inventados. Esta maqueta no envía ni almacena información.')+`<p class="notice">${target?'Contacto de prueba con '+target.name+'. ':kind==='contacto'?'Contacto de prueba con Espacio Arquitecta. ':event?'Actividad ficticia: '+event.title+'. ':''}No se crea una cuenta, inscripción ni solicitud real. No introduzcas datos personales reales.</p><form id="demo-form" novalidate><div class="form-grid"><label>Nombre ficticio<input name="nombre" aria-label="Nombre ficticio" required minlength="2" maxlength="80" autocomplete="off" placeholder="Ej.: Andrea Demo" aria-describedby="err-nombre"><span class="error" id="err-nombre"></span></label><label>Correo ficticio<input name="correo" aria-label="Correo ficticio" type="email" required maxlength="150" autocomplete="off" placeholder="andrea@example.com" aria-describedby="err-correo"><span class="error" id="err-correo"></span></label></div><label>Interés<select name="interes" aria-label="Interés" required aria-describedby="err-interes"><option value="">Selecciona una opción</option><option>Conocer la comunidad</option><option>Explorar colaboración</option><option>Mentorías (posibilidad futura)</option><option>Actividad demostrativa</option></select><span class="error" id="err-interes"></span></label><label>Mensaje ficticio<textarea name="mensaje" aria-label="Mensaje ficticio" required minlength="10" maxlength="1000" placeholder="Escribe al menos 10 caracteres de prueba." aria-describedby="err-mensaje"></textarea><span class="error" id="err-mensaje"></span></label><label class="check"><input name="demo" aria-label="Entiendo que es una demostración y usaré datos inventados." type="checkbox" required aria-describedby="err-demo">Entiendo que es una demostración y usaré datos inventados.<span class="error" id="err-demo"></span></label><button type="submit">Probar validación ↗</button> <button type="reset">Limpiar</button><div id="form-status" role="status" tabindex="-1" hidden></div></form>`);}
function community() {
  return shell(heading('Comunidad', 'Más miradas.<br>Más posibilidades.',
    'Espacio Arquitecta se presenta en esta maqueta como una comunidad profesional para encontrarse, visibilizar experiencias y compartir conocimiento.') + notice + `
    <div class="split"><img class="wide-image" src="assets/taller.svg"
      alt="Ilustración de un espacio de trabajo compartido" width="600" height="450">
      <div><h2>Un espacio en construcción colectiva.</h2>
        <p>La propuesta reúne un directorio de profesionales, una agenda de encuentros y un espacio editorial. Su propósito en esta etapa es conversar sobre qué aporta valor a la comunidad.</p>
        <p>La identidad, los criterios de participación y los servicios definitivos requieren validación con la clienta.</p>
        ${link('contacto', 'Contáctanos', 'button')}</div></div>
    <h2 style="margin-top:55px">Conoce las posibilidades</h2><div class="grid">
    ${[['directorio','Conectar','Explora perfiles profesionales ficticios.'],
      ['agenda','Aprender','Descubre propuestas ilustrativas de encuentros.'],
      ['editorial','Compartir','Explora publicaciones en distintos formatos y temáticas.']]
      .map(x => `<a class="person card" href="#/${x[0]}"><h3>${x[1]} ↗</h3><p>${x[2]}</p></a>`).join('')}</div>`);
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
  const title = page === 'voces' ? 'Sus Voces' : 'Sus Proyectos';
  const description = page === 'voces' ? 'Todos los podcasts de la comunidad. Explora por arquitecta y tema.' : 'Publicaciones sobre proyectos. Explora por arquitecta y tema.';
  return shell(crumb('inicio', 'Inicio') + heading('Contenidos de demostración', title, description) +
    `<form class="filters editorial-filters" id="collection-filters" aria-label="Filtros de ${title}">
      <label>Arquitecta<select id="architect"><option value="">Todas las arquitectas</option>
        ${D.people.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        <option value="unassigned">Sin arquitecta asignada</option></select></label>
      <label>Tema<select id="topic"><option value="">Todos los temas</option>
        ${D.themes.map(t => `<option>${t}</option>`).join('')}</select></label>
      <button type="reset" class="small">Limpiar filtros</button>
    </form><p id="collection-count" class="count" role="status"></p><div class="grid" id="collection-results"></div>`);
}
function initCollectionFilters(page) {
  const items = collectionItems(page), form = document.querySelector('#collection-filters');
  function update() {
    const architect = form.querySelector('#architect').value, topic = form.querySelector('#topic').value;
    const found = items.filter(p => (!architect || (architect === 'unassigned' ? !p.architectIds?.length : p.architectIds?.includes(architect))) && (!topic || p.themes.includes(topic)));
    document.querySelector('#collection-count').textContent = `${found.length} de ${items.length} ${page === 'voces' ? 'podcasts' : 'publicaciones sobre proyectos'}`;
    document.querySelector('#collection-results').innerHTML = found.length ? found.map(p => `<article>${publicationCard(p)}<p class="micro">${(p.architectIds || []).map(id => D.people.find(person => person.id === id)?.name).filter(Boolean).join(', ') || 'Sin arquitecta asignada'}</p></article>`).join('') :
      '<div class="empty"><h2>No encontramos contenidos.</h2><p>Prueba otra arquitecta o tema, o limpia los filtros.</p></div>';
  }
  form.addEventListener('change', update);
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
function missing(){return shell(heading('Contenido no encontrado','Volvamos a encontrarnos.')+link('inicio','Volver al inicio','button'));}
function render() {
  if (location.hash === '#main') { main.focus(); return; }
  const [page, id] = (location.hash.replace(/^#\/?/, '') || 'inicio').split('/');
  let html;
  switch (page) {
    case 'inicio': html = home(); break;
    case 'comunidad': html = community(); break;
    case 'directorio': html = directory(); break;
    case 'perfil': html = profile(id); break;
    case 'voces':
    case 'proyectos': html = collectionPage(page); break;
    case 'editorial': html = editorial(); break;
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
      html = !id || D.people.some(p => p.id === id) ? formPage(page, id) : missing(); break;
    case 'inscripcion':
      html = D.events.some(e => e.id === id) ? formPage(page, id) : missing(); break;
    case 'participa': html = formPage(page); break;
    default: html = missing();
  }
  main.innerHTML = html;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  const activePage = page === 'contacto' && !id ? 'comunidad' : {voces:'editorial', proyectos:'editorial', perfil:'directorio', contacto:'directorio', actividad:'agenda', inscripcion:'agenda', publicacion:'editorial'}[page] || page;
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
function initFilters(){const f=document.querySelector('#filters');function update(){const q=normalize(f.querySelector('#search').value.trim()),city=f.querySelector('#city').value,field=f.querySelector('#field').value;const found=D.people.filter(p=>(!city||p.city===city)&&(!field||p.field===field)&&normalize(p.name+' '+p.city+' '+p.field).includes(q));document.querySelector('#count').textContent=`${found.length} de ${D.people.length} perfiles ficticios`;document.querySelector('#results').innerHTML=found.length?found.map(personCard).join(''):'<div class="empty"><h2>No encontramos coincidencias.</h2><p>Prueba otra búsqueda o limpia los filtros.</p></div>';}
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
// Cerrar también al elegir la sección que ya está abierta en el menú móvil.
nav.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});window.addEventListener('hashchange',render);render();
})();
