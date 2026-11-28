const validId = /^[a-zA-Z0-9_-]+$/;
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Existing templates interpolate these fields directly into HTML.
function safe(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => entities[character]);
}

function publicImage(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return '';
    if (url.hostname === 'drive.google.com') {
      const fileId = url.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1] || url.searchParams.get('id');
      if (fileId && validId.test(fileId)) {
        return safe(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`);
      }
    }
    return safe(url.href);
  } catch {
    return '';
  }
}

export function mergeSheetRows({ people, publications }, rows) {
  const ids = new Set(people.map(person => person.id));
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || !validId.test(row.id) || ids.has(row.id)
      || typeof row.name !== 'string' || !row.name.trim()) continue;

    const career = Array.isArray(row.career)
      ? row.career.filter(section => Array.isArray(section) && Array.isArray(section[1]))
        .map(([title, items]) => [safe(title), items.map(safe)])
      : [];
    people.push({
      id: row.id,
      name: safe(row.name),
      city: safe(row.city),
      field: safe(row.field),
      bio: safe(row.bio),
      initials: safe(row.name.trim().split(/\s+/).slice(0, 2).map(name => name[0]).join('').toUpperCase()),
      color: '#A7E3DD',
      photo: publicImage(row.photo),
      source: 'sheets',
      career,
    });

    for (const rowWork of Array.isArray(row.works) ? row.works : []) {
      if (!rowWork || typeof rowWork.id !== 'string' || !validId.test(rowWork.id) || !rowWork.title) continue;
      const id = 'sheet-work-' + rowWork.id;
      let work = publications.find(publication => publication.id === id);
      if (!work) {
        const title = safe(rowWork.title);
        const description = safe(rowWork.description);
        work = {
          id,
          source: 'sheets',
          title,
          format: 'Artículo escrito',
          themes: ['Proyectos'],
          image: publicImage(rowWork.photo),
          alt: title,
          text: description,
          body: [description],
          city: safe(rowWork.city),
          year: safe(rowWork.year),
          category: safe(rowWork.category),
          architectIds: [],
        };
        publications.push(work);
      }
      if (!work.architectIds.includes(row.id)) work.architectIds.push(row.id);
    }
    ids.add(row.id);
  }
}
