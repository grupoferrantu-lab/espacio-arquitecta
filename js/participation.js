/* Participación editorial exclusivamente demostrativa.
 * El estado vive en esta pestaña, en memoria: sin red, cookies ni almacenamiento.
 * Los comentarios escritos se insertan como texto, nunca como HTML.
 */
(() => {
  'use strict';
  const states = new Map();
  const escapeText = value => String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[char]));

  function stateFor(id) {
    if (!states.has(id)) {
      const seed = window.DEMO.editorialParticipation[id];
      states.set(id, {
        liked: false,
        reactions: seed.reactions,
        comments: seed.comments.map(comment => ({...comment}))
      });
    }
    return states.get(id);
  }

  function summary(id) {
    const state = stateFor(id);
    const reactions = state.reactions + Number(state.liked);
    const comments = state.comments.length;
    return `${reactions} ${reactions === 1 ? 'reacción' : 'reacciones'} · ${comments} ${comments === 1 ? 'comentario' : 'comentarios'}`;
  }

  function render(id) {
    const state = stateFor(id);
    return `<section class="participation" id="editorial-participation" aria-labelledby="participation-title">
      <h2 id="participation-title">Una conversación compartida.</h2>
      <p id="participation-help" class="participation-help">Interacciones de demostración: no se envían a un servidor y se reinician al recargar. Usa texto ficticio.</p>
      <div class="participation-toolbar">
        <button class="like-button" type="button" id="like-button" aria-label="Me gusta"
          aria-pressed="${state.liked}" aria-describedby="participation-summary">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>
          <span>Me gusta</span><span id="like-count" aria-hidden="true">${state.reactions + Number(state.liked)}</span>
        </button>
        <p id="participation-summary" class="participation-summary" role="status">${summary(id)}</p>
      </div>
      <h3 id="comments-title">Comentarios</h3>
      <ol id="comment-list" class="comment-list" aria-labelledby="comments-title">
        ${state.comments.map(comment => `<li class="comment"><article>
          <p class="comment-author">${escapeText(comment.name)}</p>
          <p class="comment-text">${escapeText(comment.text)}</p>
        </article></li>`).join('')}
      </ol>
      <form id="comment-form" class="comment-form" novalidate>
        <label for="comment-text">Escribe un comentario de prueba</label>
        <textarea id="comment-text" name="comentario" required maxlength="1000" rows="3"
          placeholder="Comparte una reflexión ficticia…" autocomplete="off"
          aria-describedby="comment-help comment-error"></textarea>
        <p id="comment-help" class="participation-help">Aparecerá como «Visitante de demostración». Máximo 1.000 caracteres.</p>
        <p id="comment-error" class="error" role="alert"></p>
        <button type="submit">Publicar comentario</button>
        <p id="comment-status" class="participation-help" role="status"></p>
      </form>
    </section>`;
  }

  function mount(id) {
    const state = stateFor(id);
    const section = document.querySelector('#editorial-participation');
    const button = section.querySelector('#like-button');
    const count = section.querySelector('#like-count');
    const totals = section.querySelector('#participation-summary');
    const form = section.querySelector('#comment-form');
    const input = section.querySelector('#comment-text');
    const error = section.querySelector('#comment-error');
    const status = section.querySelector('#comment-status');

    button.addEventListener('click', () => {
      state.liked = !state.liked;
      button.setAttribute('aria-pressed', String(state.liked));
      count.textContent = state.reactions + Number(state.liked);
      totals.textContent = summary(id);
    });

    input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      error.textContent = '';
      status.textContent = '';
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const text = input.value.trim();
      status.textContent = '';
      error.textContent = '';
      input.removeAttribute('aria-invalid');
      if (!text || text.length > 1000) {
        error.textContent = !text ? 'Escribe un comentario antes de publicarlo.' : 'El comentario debe tener como máximo 1.000 caracteres.';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }

      const comment = {name:'Visitante de demostración', text};
      state.comments.push(comment);
      const item = document.createElement('li');
      item.className = 'comment';
      const article = document.createElement('article');
      const author = document.createElement('p');
      author.className = 'comment-author';
      author.textContent = comment.name;
      const content = document.createElement('p');
      content.className = 'comment-text';
      content.textContent = comment.text;
      article.append(author, content);
      item.append(article);
      section.querySelector('#comment-list').append(item);
      totals.textContent = summary(id);
      form.reset();
      status.textContent = 'Comentario añadido solo a esta demostración. No se envió a ningún servidor.';
      input.focus();
    });
  }

  window.EditorialParticipation = Object.freeze({summary, render, mount});
})();
