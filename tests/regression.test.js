import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname } from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const exec = promisify(execFile);
const root = new URL('../', import.meta.url);
const referenceCommit = '7f381312a6efc0ce683928108f5837dcba7bec17';
const referenceFiles = new Map();
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
};
const sheetRows = [{
  id: 'perfil-prueba',
  name: 'Ángela Prueba',
  city: 'Santiago',
  field: 'Vivienda',
  bio: 'Perfil sintético para la prueba',
  career: [['Trayectoria', ['Proyecto de prueba']]],
  works: [{ id: 'patio-prueba', title: 'Patio de prueba', year: 2026 }],
}];

const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  const [, reference, relative] = path.match(/^\/(referencia\/)?(?:pruebas\/)?(.*)$/);
  const file = relative || 'index.html';
  if (!/^(?:index\.html|(?:js|css|data|assets)\/(?:[\w-]+\/)*[\w.-]+)$/.test(file)) {
    response.writeHead(404).end();
    return;
  }
  try {
    let body;
    if (reference) {
      if (!referenceFiles.has(file)) {
        const result = await exec('git', ['show', `${referenceCommit}:${file}`], {
          cwd: fileURLToPath(root), encoding: 'buffer', maxBuffer: 16 * 1024 * 1024,
        });
        referenceFiles.set(file, result.stdout);
      }
      body = referenceFiles.get(file);
    } else {
      body = await readFile(new URL(file, root));
    }
    response.writeHead(200, { 'Content-Type': contentTypes[extname(file)] }).end(body);
  } catch {
    response.writeHead(404).end();
  }
});

let baseUrl;
let browser;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  });
});
after(async () => {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
});

async function withPage(viewport, check, sheetsResponse = { json: sheetRows }) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  page.setDefaultTimeout(7000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(baseUrl) && !response.ok()) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  try {
    await page.route('https://script.google.com/**', route => route.fulfill(sheetsResponse));
    await page.route('**/*.mp4', route => route.abort());
    await check(page);
    assert.deepEqual(errors, []);
  } finally {
    await page.close();
  }
}

for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
  test(`paridad visual en ${viewport.width}px`, async () => {
    await withPage(viewport, async page => {
      for (const route of ['inicio', 'directorio', 'perfil/perfil-prueba', 'contacto', 'comunidad', 'membresias', 'servicios']) {
        const capture = async prefix => {
          await page.goto(`${baseUrl}${prefix}#/${route}`);
          await page.locator('main h1').waitFor();
          if (route.startsWith('perfil/') || route === 'directorio') {
            await page.getByText('Ángela Prueba', { exact: true }).waitFor();
          }
          await page.evaluate(async () => {
            document.activeElement?.blur();
            for (const image of document.images) image.loading = 'eager';
            await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
            await document.fonts.ready;
            window.scrollTo(0, 0);
          });
          const screenshot = await page.screenshot({
            fullPage: true, animations: 'disabled', style: 'video { visibility: hidden }',
          });
          return createHash('sha256').update(screenshot).digest('hex');
        };
        assert.equal(await capture('pruebas/'), await capture('referencia/pruebas/'), route);
      }
    });
  });
}

for (const prefix of ['', 'pruebas/']) {
  test(`directorio, obras y formulario en /${prefix}`, async () => {
    await withPage({ width: 390, height: 844 }, async page => {
      await page.goto(`${baseUrl}${prefix}`);
      await page.getByRole('button', { name: 'Menú' }).click();
      await page.getByRole('link', { name: 'Arquitectas|Oficios y Obras' }).click();
      await page.getByText('Ángela Prueba', { exact: true }).waitFor();
      const search = page.getByRole('searchbox');
      await search.fill('angela');
      await search.press('Tab');
      assert.equal(await page.locator('#results .person').count(), 1);
      await page.locator('#results a[href="#/perfil/perfil-prueba"]').click();
      await page.waitForURL('**/#/perfil/perfil-prueba');
      assert.equal(await page.locator('nav a[aria-current=page]').getAttribute('href'), '#/directorio');
      await page.getByRole('link', { name: 'Ver sus obras' }).click();
      await page.getByRole('link', { name: /Patio de prueba/ }).click();
      await page.getByRole('heading', { name: 'Patio de prueba' }).waitFor();
      assert.equal(await page.locator('#editorial-participation').count(), 0);
      await page.goBack();
      await page.getByRole('heading', { name: 'Obras de Ángela Prueba' }).waitFor();
      await page.goto(`${baseUrl}${prefix}#/contacto`);
      await page.getByRole('button', { name: /Probar validación/ }).click();
      assert.equal(await page.locator('[aria-invalid=true]').count(), 5);
      assert.equal(await page.locator(':focus').getAttribute('name'), 'nombre');
    });
  });
}

test('participación de Encuentros conserva el estado en la pestaña', async () => {
  await withPage({ width: 1366, height: 900 }, async page => {
    const article = `${baseUrl}pruebas/#/encuentros/mujeres-arquitectas`;
    await page.goto(article);
    const like = page.getByRole('button', { name: 'Me gusta' });
    await like.click();
    assert.equal(await like.getAttribute('aria-pressed'), 'true');
    const message = 'Comentario de prueba';
    await page.locator('#comment-text').fill(message);
    await page.getByRole('button', { name: 'Publicar comentario' }).click();
    await page.locator('#comment-list').getByText(message).waitFor();
    await page.getByRole('link', { name: /Volver a Encuentros/ }).click();
    await page.goBack();
    await page.locator('#comment-list').getByText(message).waitFor();
    assert.equal(await like.getAttribute('aria-pressed'), 'true');
    await page.reload();
    assert.equal(await like.getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('#comment-list').getByText(message).count(), 0);
  });
});
test('el directorio distingue una lista vacía de un fallo de Sheets', async () => {
  const viewport = { width: 1366, height: 900 };
  const directory = `${baseUrl}pruebas/#/directorio`;
  await withPage(viewport, async page => {
    await page.goto(directory);
    await page.getByRole('heading', { name: 'No encontramos coincidencias.' }).waitFor();
    await page.locator('.skip').focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => location.hash === '#main' && document.activeElement?.id === 'main');
  }, { json: [] });
  await withPage(viewport, async page => {
    await page.goto(directory);
    await page.getByRole('alert').filter({ hasText: 'No fue posible cargar el directorio' }).waitFor();
  }, { status: 503 });
});
test('las vistas extraídas conservan enlaces de LAB, agenda y membresías', async () => {
  await withPage({ width: 1366, height: 900 }, async page => {
    await page.goto(`${baseUrl}pruebas/#/servicios`);
    await page.getByRole('link', { name: 'Ver Agenda' }).click();
    await page.getByRole('link', { name: 'Miradas que construyen comunidad' }).click();
    await page.getByRole('link', { name: /Probar inscripción demostrativa/ }).click();
    await page.getByRole('heading', { name: 'Imaginemos el próximo encuentro.' }).waitFor();
    await page.goto(`${baseUrl}pruebas/#/membresias`);
    await page.getByRole('link', { name: 'Publicidad' }).click();
    assert.equal(await page.locator('select[name=interes]').inputValue(), 'Ser Partner (patrocinio, publicidad u otro)');
  });
});

test('Obras y Podcast excluyen las publicaciones de maqueta', async () => {
  await withPage({ width: 1366, height: 900 }, async page => {
    await page.goto(`${baseUrl}pruebas/#/proyectos`);
    const works = page.locator('#collection-results a');
    await works.getByRole('heading', { name: 'Patio de prueba' }).waitFor();
    assert.equal(await works.count(), 1);
    assert.deepEqual(await page.locator('#topic option').allTextContents(), ['Todos los temas', 'Proyectos']);

    await page.goto(`${baseUrl}pruebas/#/voces`);
    const episodes = page.locator('#collection-results a');
    await episodes.getByRole('heading', { name: 'Luz y Arquitectura' }).waitFor();
    assert.equal(await episodes.count(), 1);
    assert.match(await episodes.getAttribute('href'), /^https:\/\/open\.spotify\.com\/episode\//);

    await page.goto(`${baseUrl}pruebas/#/publicacion/escuchar-territorio`);
    await page.getByRole('heading', { name: 'Volvamos a encontrarnos.' }).waitFor();
  });
});

test('carga el catálogo bajo demanda y comparte la consulta durante la navegación', async () => {
  await withPage({ width: 1366, height: 900 }, async page => {
    const site = `${baseUrl}pruebas/`;
    let requests = 0;
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    await page.route('https://script.google.com/**', async route => {
      requests++;
      await pending;
      await route.fulfill({ json: sheetRows });
    });

    try {
      await page.goto(site);
      await page.getByRole('heading', { name: /Un espacio para/ }).waitFor();
      await page.goto(`${site}#/contacto`);
      await page.locator('#demo-form').waitFor();
      assert.equal(requests, 0);

      await page.goto(`${site}#/perfil/perfil-prueba`);
      await page.getByRole('heading', { name: 'Cargando catálogo…' }).waitFor();
      await page.goto(`${site}#/publicacion/sheet-work-patio-prueba`);
      await page.getByRole('heading', { name: 'Cargando catálogo…' }).waitFor();
      await page.locator('.skip').focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/#main');
      release();
      await page.getByRole('heading', { name: 'Patio de prueba' }).waitFor();
      assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
      await page.goto(`${site}#/directorio`);
      await page.getByRole('heading', { name: 'Ángela Prueba' }).waitFor();
      assert.equal(requests, 1);
    } finally {
      release();
    }
  });
});
