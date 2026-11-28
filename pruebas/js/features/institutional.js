import { membershipCards } from '../../data/memberships.js';
import { heading, link, shell } from '../ui/templates.js';

export function home(){return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Arquitectura · Comunidad · Conexiones</p><h1>Un espacio para<br><em>construir juntas.</em></h1><p class="lead">Conectamos miradas, compartimos experiencias y damos lugar a nuevas posibilidades en la arquitectura.</p><div class="actions">${link('voces','Sus Voces','button secondary')}${link('proyectos','Sus Obras','button secondary')}</div><p class="micro">Una comunidad por imaginar. Una maqueta para explorar.</p></div><div class="hero-art"><img src="assets/patio.svg" alt="Ilustración arquitectónica de un patio con arcos, vegetación y luz cálida" width="800" height="800"><video class="hero-video" src="assets/video_inicio.mp4" poster="assets/patio.svg" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video><div class="art-caption">${link('comunidad','DESCUBRE EL ESPACIO')}<span>Ilustración conceptual · Demo</span></div></div></section><div class="strip"><span>Miradas diversas</span><span>Conocimiento compartido</span><span>Conexiones que crecen</span></div>`;}

export function community() {
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
      <h2 id="founders-title">Equipo de ESPACIOaRQUITECTA</h2>
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

export function memberships() {
  return shell(heading('ESPACIOaRQUITECTA', 'Membresías',
    'Elige cómo quieres ser parte. Todas las membresías sostienen una comunidad que busca que más arquitectas lideren.') + `
    <div class="grid">
      ${membershipCards.map(({ title, description, links }) => `<article class="person">
        <h2>${title}</h2>
        <p>${description}</p>
        ${links ? `<p>${links.map(({ path, label }) => link(path, label)).join(' y ')}</p>` : ''}
      </article>`).join('')}
      <div class="membership-contact">${link('contacto/membresia', 'Consultar por una membresía', 'button')}</div>
    </div>`);
}

export function initHeroVideo(root) {
  const video = root.querySelector('.hero-video');
  const fallback = () => video.classList.remove('is-playing');
  video.muted = true;
  video.addEventListener('playing', () => video.classList.add('is-playing'));
  video.addEventListener('error', fallback);
  video.play().catch(fallback);
}
