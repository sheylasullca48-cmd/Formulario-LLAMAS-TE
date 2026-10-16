# Formulario de espera y satisfacción — Llamas-te Restolounge

Página estática para publicar el cuestionario en GitHub Pages. El contenido sigue los módulos y preguntas del PDF proporcionado.

## Archivos
- `index.html`: estructura del formulario y preguntas 1–19.
- `style.css`: diseño adaptable a celulares y computadoras.
- `script.js`: validaciones, indicador de disconfirmación y descarga CSV.

## Publicar en GitHub Pages
1. Entra a https://github.com e inicia sesión.
2. Crea un repositorio nuevo, por ejemplo `encuesta-espera-llamas-te`.
3. Sube los tres archivos (`index.html`, `style.css`, `script.js`) a la raíz del repositorio. Puedes arrastrarlos a **Add file → Upload files**.
4. Abre **Settings → Pages**.
5. En **Build and deployment**, elige **Deploy from a branch**.
6. Selecciona la rama `main` y la carpeta `/ (root)`, luego pulsa **Save**.
7. Espera unos minutos y abre la URL que GitHub Pages mostrará en esa sección.

## ¿Cómo se guardan las respuestas?
Por defecto, al pulsar **Enviar respuestas** se descarga un archivo CSV en el dispositivo de la persona. GitHub Pages no guarda respuestas ni funciona como base de datos.

### Para centralizar respuestas en Google Sheets (opcional)
1. Crea una hoja de cálculo de Google.
2. En **Extensiones → Apps Script**, pega un script que reciba el JSON y lo agregue como fila.
3. Implementa el proyecto como **Aplicación web** y configura el acceso de acuerdo con las políticas de tu institución y los requisitos de privacidad.
4. Copia la URL de implementación terminada en `/exec`.
5. Abre `script.js` y reemplaza `const APPS_SCRIPT_URL = "";` por `const APPS_SCRIPT_URL = "TU_URL/exec";`.
6. Sube el `script.js` actualizado al repositorio.

**Importante:** `mode: "no-cors"` no permite que el navegador confirme el resultado del envío. Verifica en la hoja que las filas se estén registrando. No publiques claves privadas ni credenciales en GitHub.

## Nota metodológica
- El indicador se calcula como **P4 − P3** (tiempo aceptable menos demora percibida), según el instrumento suministrado.
- La sección de registro observacional puede completarla el evaluador; el participante puede dejar esos campos en blanco.
- El formulario incluye una casilla de participación voluntaria. Antes de usarlo con participantes reales, revisa el consentimiento informado y los procedimientos de confidencialidad que correspondan a tu investigación.
- Este proyecto es un formulario web, no una validación psicométrica del instrumento.
