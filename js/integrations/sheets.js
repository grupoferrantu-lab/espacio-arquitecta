export async function fetchArchitectRows() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbw7sUy_4oc40s5NzPli_f2dyfIX9G8wkIs-j4iFYUew0mcaOeGu7YIOyOn6OF3d2CGM4A/exec', {signal: controller.signal, cache: 'no-store', credentials: 'omit'});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Formato inesperado');
    return rows;
  } finally {
    clearTimeout(timeout);
  }
}
