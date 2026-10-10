# Historia Naval Digital

Archivo estático de historia naval en español. HTML, CSS y JavaScript, con contenido organizado en JSON. Versión 0.2.

## Abrir en tu computadora

Abre la carpeta en Visual Studio Code y utiliza **Open with Live Server** en `index.html`. También puedes ejecutar `python -m http.server 8000` desde la raíz y visitar `http://localhost:8000`. Abrir los HTML directamente con `file://` no permite cargar los JSON correctamente.

## Actualizar desde GitHub

Guarda o confirma tus cambios locales antes de ejecutar `git pull origin main`. Para subir cambios: `git add .`, `git commit -m "Descripción"`, `git push origin main`.

## Funciones

- Catálogo con filtros visibles de nación, tipo, estado y era; búsqueda sin tildes, ordenación y filtros compartibles en la URL.
- Fichas con historial, referencias, clase, conflictos e índice de secciones.
- Fotografías con procedencia, visor con zoom y navegación mediante flechas.
- Comparación de dos o tres buques y favoritos locales sin cuenta.
- Páginas de batallas y mapa de escenarios, pecios y buques museo con marcadores aproximados mediante OpenStreetMap.
- Efemérides del día o del mes; avisos de carga, errores y reintentos.
- Modo oscuro, controles por teclado y diseño adaptable.

## Agregar un buque

Edita `assets/data/ships.json`. Usa un `id` único y las mismas propiedades de los registros existentes. Las fechas admiten `AAAA-MM-DD`, `AAAA-MM`, `AAAA` e intervalos `AAAA-AAAA`. El buque debe referenciar una nación, era y conflictos existentes. Los tipos y estados se definen en `assets/js/config.js`.

Incluye `sources` con título, autor, URL y tipo; documenta fecha y configuración de las especificaciones en `specsNote`. Añade la fotografía en `assets/images/ships/` y registra autor, licencia y enlace de procedencia en `imageCredit`. No atribuyas una fotografía a otro buque.

Los recursos de galería se registran en `assets/data/multimedia.json`, con un `shipId` existente o `null`, tipo, ruta, descripción y `credit`. Las ilustraciones propias deben identificarse expresamente. Las batallas se registran en `battles.json` y sus coordenadas de mapa son aproximadas, no puntos de navegación.

## Comprobaciones

Ejecuta `python scripts/validate.py` para validar datos, imágenes y enlaces internos, y `npm ci && npm test` para las pruebas funcionales de DOM y fechas. GitHub Actions ejecuta ambas comprobaciones en cada cambio de `main` o pull request.

## Publicar en GitHub Pages

En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, selecciona `main` y `/ (root)`. La URL habitual para este repositorio es `https://historianavaldigital.github.io/HistoriaNavalDigital/`. La configuración debe habilitarse en GitHub; subir código por sí solo no garantiza que Pages esté activo.

El sitio usa rutas relativas. Si se sirve dentro de otra carpeta, conserva juntos los HTML y `assets/`. Las vistas previas de redes de las fichas comparten la imagen general del archivo: para imágenes únicas por buque se necesitaría generar HTML individuales o renderizado previo.

## Fuentes y límites editoriales

Las referencias enlazadas provienen de NHHC, HMS Hood Association y documentación naval especializada. Las fotografías incorporadas incluyen metadatos de Wikimedia Commons. Se conservan los archivos originales de Bismarck y de las eras: su procedencia y licencia aún deben documentarse. La revisión histórica es parcial; las configuraciones técnicas cambian según la fecha. No todos los campos anteriores están contrastados. Las eras sin registros y los conflictos sin acontecimientos muestran su estado pendiente.

## Privacidad y servicios externos

Favoritos y preferencias se guardan en el navegador mediante `localStorage`. Si el almacenamiento no está disponible, el sitio continúa funcionando e informa al intentar guardar favoritos. El mapa solicita cartografía a OpenStreetMap y necesita conexión. No hay cuentas ni sincronización de favoritos.
