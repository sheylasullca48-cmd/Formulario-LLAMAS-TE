/*
 * Llamas-te Restolounge — formularios cuantitativo y cualitativo.
 * Para guardar respuestas en Google Sheets, pega la URL de implementación
 * de tu Apps Script en APPS_SCRIPT_URL. Si queda vacía, la respuesta se
 * descarga como archivo CSV en el dispositivo del usuario.
 */
const APPS_SCRIPT_URL = ''; // Ejemplo: https://script.google.com/macros/s/ID_DE_IMPLEMENTACION/exec

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      const active = panel.id === tab.dataset.panel;
      panel.classList.toggle('is-visible', active);
      panel.hidden = !active;
    });
  });
});

function csvEscape(value) {
  const text = String(value ?? '');
  return '"' + text.replace(/"/g, '""') + '"';
}

function downloadCsv(data, type) {
  const headers = Object.keys(data);
  const csv = '\uFEFF' + [headers.map(csvEscape).join(','), headers.map((key) => csvEscape(data[key])).join(',')].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `llamas_te_${type.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  data.tipo_cuestionario = form.dataset.formType;
  data.fecha_envio = new Date().toISOString();
  status.classList.remove('error');
  submit.disabled = true;
  submit.textContent = 'Enviando…';

  try {
    if (APPS_SCRIPT_URL.trim()) {
      // Apps Script recibe un POST de tipo formulario; no se requiere CORS de lectura.
      const body = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => body.append(key, value ?? ''));
      await fetch(APPS_SCRIPT_URL.trim(), { method: 'POST', mode: 'no-cors', body });
      status.textContent = 'Solicitud enviada. Si configuraste correctamente Apps Script, revisa la hoja de respuestas para confirmar el registro.';
    } else {
      downloadCsv(data, form.dataset.formType);
      status.textContent = '¡Gracias! Se descargó un CSV con tu respuesta. Para centralizar respuestas automáticamente, configura Google Sheets siguiendo el README.';
    }
    form.reset();
  } catch (error) {
    status.textContent = 'No se pudo enviar la respuesta. Comprueba tu conexión o descarga localmente configurando APPS_SCRIPT_URL vacío.';
    status.classList.add('error');
  } finally {
    submit.disabled = false;
    submit.innerHTML = `Enviar cuestionario ${form.dataset.formType.toLowerCase()} <span aria-hidden="true">→</span>`;
  }
}

document.querySelectorAll('form[data-form-type]').forEach((form) => form.addEventListener('submit', handleSubmit));
