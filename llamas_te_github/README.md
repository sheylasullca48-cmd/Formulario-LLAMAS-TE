# Llamas-te Restolounge — Encuestas

Sitio web estático con dos formularios independientes:

- **Cuantitativo:** registro de observación, percepción del tiempo, satisfacción, emociones, ambiente y datos generales.
- **Cualitativo:** contexto de visita y cinco preguntas abiertas sobre distracción, información, justicia, etapas de espera e intención de retorno.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `encuestas-llamas-te`.
2. Sube `index.html`, `style.css`, `script.js`, `Code.gs` y `README.md` a la raíz del repositorio.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**; elige `main` y la carpeta `/ (root)` y guarda.
5. Espera a que GitHub Pages publique el sitio y abre la URL que aparece en esa sección.

## Guardar respuestas en Google Sheets (opcional, recomendado)

Por defecto, el formulario descarga un CSV al dispositivo que lo responde. Para centralizar respuestas automáticamente:

1. Crea una hoja de cálculo en Google Sheets.
2. Abre **Extensiones → Apps Script** y pega el contenido de `Code.gs`.
3. Guarda el proyecto y ejecuta `setupSheets()` una vez. Autoriza los permisos solicitados. Se preparan dos pestañas: `Respuestas cuantitativas` y `Respuestas cualitativas`.
4. Pulsa **Implementar → Nueva implementación → Aplicación web**.
5. Configura **Ejecutar como: Yo**. En acceso, elige la opción permitida por tu organización; si el sitio será público, revisa cuidadosamente las implicaciones de permitir acceso a cualquier persona.
6. Implementa y copia la URL que termina en `/exec`.
7. En `script.js`, pega esa URL entre las comillas de `APPS_SCRIPT_URL`:

   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/ID_DE_IMPLEMENTACION/exec';
   ```

8. Guarda y vuelve a subir `script.js` a GitHub.
9. Envía una respuesta de prueba en cada formulario y comprueba que cada una aparezca en su pestaña correspondiente.

**Importante:** con `fetch` en modo `no-cors`, el navegador no puede leer la confirmación que devuelve Apps Script. Por eso el mensaje de la página indica que revises la hoja para confirmar que la respuesta se registró. No publiques datos personales sensibles en la hoja y limita su acceso a personas autorizadas.

## Archivos

- `index.html`: estructura de la página y los dos formularios.
- `style.css`: estilos adaptables a móviles y escritorio.
- `script.js`: cambio entre formularios, validación, envío y descarga CSV local.
- `Code.gs`: receptor opcional para guardar respuestas en Google Sheets.

## Nota metodológica

Las preguntas se organizaron a partir de los instrumentos compartidos para el proyecto. La pregunta cualitativa sobre contexto de visita es cerrada y las cinco restantes son abiertas. El indicador de disconfirmación descrito en el instrumento cuantitativo es **P4 − P3** (máximo tolerable menos demora estimada); puede calcularse después al analizar los datos.
