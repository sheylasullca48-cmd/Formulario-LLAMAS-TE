/**
 * Llamas-te Restolounge — receptor de encuestas para Google Sheets.
 * 1) Crea/abre una hoja de cálculo de Google.
 * 2) Extensiones > Apps Script; pega este código.
 * 3) Ejecuta setupSheets() una vez y autoriza los permisos.
 * 4) Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: Yo. Acceso: Cualquier persona (o la política de tu organización).
 * 5) Copia la URL /exec y pégala en APPS_SCRIPT_URL de script.js.
 */
const SHEET_NAMES = {
  Cuantitativo: 'Respuestas cuantitativas',
  Cualitativo: 'Respuestas cualitativas'
};

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.values(SHEET_NAMES).forEach((name) => {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
  });
  Logger.log('Hojas preparadas: ' + Object.values(SHEET_NAMES).join(', '));
}

function doPost(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const type = String(params.tipo_cuestionario || '').toLowerCase();
    let sheetName;
    if (type === 'cuantitativo') sheetName = SHEET_NAMES.Cuantitativo;
    else if (type === 'cualitativo') sheetName = SHEET_NAMES.Cualitativo;
    else return jsonOutput({ ok: false, message: 'Tipo de cuestionario no reconocido.' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    const keys = Object.keys(params);
    if (sheet.getLastRow() === 0) sheet.appendRow(keys);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newHeaders = keys.filter((key) => headers.indexOf(key) === -1);
    if (newHeaders.length) {
      sheet.getRange(1, headers.length + 1, 1, newHeaders.length).setValues([newHeaders]);
    }
    const finalHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = finalHeaders.map((key) => params[key] || '');
    sheet.appendRow(row);
    return jsonOutput({ ok: true, message: 'Respuesta registrada.' });
  } catch (error) {
    return jsonOutput({ ok: false, message: String(error) });
  }
}

function doGet() {
  return jsonOutput({ ok: true, message: 'Receptor de encuestas Llamas-te Restolounge activo.' });
}

function jsonOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
