/*
  Formulario estático para GitHub Pages.
  Por defecto, las respuestas se descargan en el dispositivo como CSV.
  Para enviarlas automáticamente a Google Sheets, pega la URL de tu implementación
  de Google Apps Script en APPS_SCRIPT_URL (ver README.md).
*/
const APPS_SCRIPT_URL = ""; // Ejemplo: "https://script.google.com/macros/s/TU_ID/exec"

const form = document.getElementById("surveyForm");
const statusBox = document.getElementById("status");
const p3 = form.elements.namedItem("p3_demora_percibida");
const p4 = form.elements.namedItem("p4_tiempo_aceptable");
const disconfirmation = document.getElementById("disconfirmation");

function updateIndicator() {
  if (p3.value !== "" && p4.value !== "" && Number(p3.value) >= 0 && Number(p4.value) >= 0) {
    const value = Number(p4.value) - Number(p3.value);
    disconfirmation.textContent = `${value > 0 ? "+" : ""}${value} minutos`;
    disconfirmation.style.color = value < 0 ? "#c2413a" : "#3155d9";
  } else {
    disconfirmation.textContent = "Pendiente";
    disconfirmation.style.color = "#3155d9";
  }
}
p3.addEventListener("input", updateIndicator);
p4.addEventListener("input", updateIndicator);

function getData() {
  const data = {};
  new FormData(form).forEach((value, key) => data[key] = value);
  data.indicador_disconfirmacion = (p3.value !== "" && p4.value !== "")
    ? String(Number(p4.value) - Number(p3.value)) : "";
  data.fecha_envio = new Date().toISOString();
  return data;
}
function csvEscape(value) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}
function downloadCSV(data) {
  const headers = Object.keys(data);
  const csv = "\uFEFF" + headers.map(csvEscape).join(",") + "\r\n" + headers.map(k => csvEscape(data[k])).join(",");
  const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `respuestas_llamas_te_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
document.getElementById("downloadCsv").addEventListener("click", () => {
  if (!form.reportValidity()) return;
  downloadCSV(getData());
  statusBox.textContent = "Se descargó un archivo CSV con esta respuesta. Guárdalo en un lugar seguro.";
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = getData();
  if (!APPS_SCRIPT_URL) {
    downloadCSV(data);
    statusBox.textContent = "Formulario completado. Se descargó la respuesta en CSV en este dispositivo. Para centralizar respuestas, configura Google Sheets siguiendo el README.";
    return;
  }
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Enviando…";
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(data)
    });
    statusBox.textContent = "La solicitud se envió. Como el navegador no permite confirmar la respuesta del servicio en este modo, verifica que el registro aparezca en Google Sheets.";
    form.reset();
    updateIndicator();
  } catch (error) {
    statusBox.textContent = "No se pudo enviar. Descarga la respuesta como CSV e inténtalo más tarde.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Enviar respuestas";
  }
});
