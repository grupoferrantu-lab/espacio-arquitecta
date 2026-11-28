import { encounterArticle } from '../../data/encuentro-mujeres-arquitectas.js';
import { offerings } from '../../data/lab.js';
import * as participation from '../participation.js';
import { crumb, heading, link, missing, notice, shell } from '../ui/templates.js';

const eventRow=e=>`<article class="event"><div class="date"><strong>${e.day}</strong>${e.month}</div><div><h3>${link('actividad/'+e.id,e.title)}</h3><p>${e.type} · Actividad ficticia</p></div>${link('actividad/'+e.id,'Ver actividad ↗','button secondary small')}</article>`;

export function services() {
  return shell(
    heading('ESPACIOaRQUITECTA LAB', 'ESPACIOaRQUITECTA LAB') +
    '<div class="grid">' + offerings.map(([title, description, path, label]) =>
      `<article class="person"><h2>${title}</h2><p>${description}</p>${path ? link(path, label, 'button secondary') : ''}</article>`
    ).join('') + '</div>'
  );
}

export function encounters() {
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

export function encounterPublication(id) {
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

export function mentoring() {
  return shell(crumb('servicios', 'ESPACIOaRQUITECTA LAB') +
    heading('ESPACIOaRQUITECTA LAB', 'Mentoría y coaching', 'Acompañamiento práctico para avanzar hacia un resultado concreto.') +
    '<p class="lead">Servicio aparte de las membresías, con sesiones individuales y programas grupales de pocas semanas.</p>' +
    '<div class="grid"><article class="person"><h2>De egresada a primer proyecto</h2><p>Define los pasos para convertir tus conocimientos en un primer proyecto.</p></article>' +
    '<article class="person"><h2>De profesional a liderazgo</h2><p>Trabaja un objetivo de liderazgo con pasos concretos para tu práctica profesional.</p></article></div>' +
    '<p class="notice" style="margin-top:32px">Programas propuestos. Fechas, duración específica, precios y condiciones por definir.</p>' +
    link('servicios', 'Volver al LAB →', 'button secondary'));
}

export function agenda(events) {
  return shell(heading('Agenda / Actividades ficticias', 'Encontrarnos abre caminos.',
    'Fechas ilustrativas, sin convocatoria vigente ni inscripciones reales. Año de referencia: 2026.') + notice + events.map(eventRow).join(''));
}

export function activity(id, events) {
  const e = events.find(event => event.id === id);
  return e ? shell(crumb('agenda', 'Agenda') + heading(e.type, e.title, e.text) + notice +
    `<p>${e.day} de ${e.month.toLowerCase()} · 2026 · Fecha ilustrativa, no confirmada</p>` +
    link('inscripcion/' + e.id, 'Probar inscripción demostrativa ↗', 'button') +
    '<h2 style="margin-top:55px">Sigue conectando</h2>' + link('directorio', 'Explorar profesionales →')) : missing();
}
