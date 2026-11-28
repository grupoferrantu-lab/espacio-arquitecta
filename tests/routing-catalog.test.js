import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mergeSheetRows } from '../js/catalog.js';
import { activeSection, needsCatalog, parseRoute } from '../js/core/router.js';
import { fetchArchitectRows } from '../js/integrations/sheets.js';

test('interpreta rutas hash, enlaces directos y acceso al contenido', () => {
  assert.deepEqual(parseRoute(''), { page: 'inicio', id: undefined });
  assert.deepEqual(parseRoute('#main'), { skipToContent: true });
  assert.deepEqual(parseRoute('#/perfil/ana'), { page: 'perfil', id: 'ana' });
  assert.deepEqual(parseRoute('#perfil/ana'), parseRoute('#/perfil/ana'));
  assert.equal(activeSection(parseRoute('#/participa/membresia')), 'membresias');
  assert.equal(activeSection(parseRoute('#/contacto/membresia')), 'contacto');
  assert.equal(activeSection(parseRoute('#/contacto')), 'comunidad');
  assert.equal(activeSection(parseRoute('#/publicacion/uno'), 'voces'), 'voces');
  assert.equal(activeSection(parseRoute('#/publicacion/dos'), 'proyectos'), 'directorio');
  assert.equal(activeSection(parseRoute('#/encuentros/articulo')), 'servicios');
});

test('clasifica los recorridos que requieren el catálogo', () => {
  for (const hash of ['#/directorio', '#perfil/ana', '#/proyectos', '#/proyectos/ana',
    '#/contacto/ana', '#/publicacion/sheet-work-uno', '#/voces']) {
    assert.equal(needsCatalog(parseRoute(hash)), true, hash);
  }
  for (const hash of ['', '#/inicio', '#/agenda', '#/contacto', '#/contacto/publicidad',
    '#/contacto/membresia', '#main']) {
    assert.equal(needsCatalog(parseRoute(hash)), false, hash);
  }
});

test('une obras compartidas y conserva IDs, contenido local y URLs válidas', () => {
  const local = { id: 'local' };
  const catalog = { people: [], publications: [local] };
  const work = { id: 'uno', title: 'Patio & jardín', photo: 'https://drive.google.com/open?id=foto' };

  mergeSheetRows(catalog, [
    null,
    { id: 'inválido', name: 'Perfil inválido' },
    { id: 'sin-nombre', name: ' ' },
    { id: 'ana', name: 'Ana', photo: 'https://drive.google.com/file/d/retrato/view', works: [work, work] },
    { id: 'ana', name: 'Duplicado' },
    { id: 'luz', name: 'Luz', photo: 'http://example.test/no-https', works: [work] },
  ]);

  assert.deepEqual(catalog.people.map(person => person.name), ['Ana', 'Luz']);
  assert.equal(catalog.people[0].photo, 'https://drive.google.com/thumbnail?id=retrato&amp;sz=w1000');
  assert.equal(catalog.people[1].photo, '');
  assert.equal(catalog.publications.length, 2);
  assert.equal(catalog.publications[0], local);
  const publication = catalog.publications[1];
  assert.equal(publication.id, 'sheet-work-uno');
  assert.equal(publication.title, 'Patio &amp; jardín');
  assert.equal(publication.image, 'https://drive.google.com/thumbnail?id=foto&amp;sz=w1000');
  assert.deepEqual(publication.architectIds, ['ana', 'luz']);
});

test('el adaptador acepta listas vacías y distingue errores de HTTP y de formato', async context => {
  const fetch = context.mock.method(globalThis, 'fetch', async () => new Response('[]'));
  assert.deepEqual(await fetchArchitectRows(), []);
  assert.equal(fetch.mock.calls[0].arguments[1].credentials, 'omit');
  fetch.mock.mockImplementation(async () => new Response('{}'));
  await assert.rejects(fetchArchitectRows(), /Formato inesperado/);
  fetch.mock.mockImplementation(async () => new Response(null, { status: 503 }));
  await assert.rejects(fetchArchitectRows(), /HTTP 503/);
});
