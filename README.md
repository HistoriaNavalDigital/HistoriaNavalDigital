# Historia Naval Digital

Archivo estático de historia naval en español. HTML, CSS y JavaScript, con contenido organizado en JSON. Versión 0.4.

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

## Diseño del catálogo
La selección de tipo se concentra en un único desplegable dentro del panel de filtros. Se elimina la barra lateral duplicada. Las tarjetas muestran clase, años de servicio y velocidad; las fichas conservan las especificaciones completas y las notas documentales. Naciones usa imágenes y contexto desplegable; tecnología presenta explicaciones compactas y ejemplos con nombres de buques.

## Archivo editorial 0.3
Portada con relato protagonista, tres colecciones temáticas, búsqueda general por tipo de contenido, páginas de clases y glosario de 24 términos. Las fichas incorporan función, importancia y relato por apartados con referencias; los acontecimientos incluyen objetivos, fases y consecuencias. La tecnología contiene ocho temas y el archivo multimedia 82 piezas, incluidas ilustraciones conceptuales identificadas como tales.

El catálogo mantiene un único filtro por criterio, admite vista de lista y reconoce periodos secundarios (Fletcher aparece en acero y Guerra Fría). Se guardan buques, acontecimientos, imágenes y colecciones en favoritos locales. El mapa filtra escenarios por categoría y año, sin inventar rutas históricas.

### Edición y generación
Los contenidos se mantienen en `assets/data`. Ejecutar `python scripts/generate-pages.py` después de modificar buques: genera las 80 rutas permanentes `buques/<id>.html` con metadatos y contenido inicial legible sin JavaScript, y el sitemap. La ficha parametrizada anterior sigue disponible. Ejecutar `python scripts/validate.py` y `npm test` antes de subir cambios.

### Alcance de la documentación
Las clases muestran las unidades disponibles, no un inventario completo. Los datos técnicos heredados mantienen revisión parcial y deben comprobarse por configuración; una actualización editorial no equivale a verificación total. No hay modelos 3D, planos históricos nuevos ni reconstrucciones tácticas animadas. Las imágenes conceptuales no son planos a escala.

Verificación: pruebas funcionales de DOM y comprobaciones de archivos y relaciones. La revisión visual en navegador no está disponible en este entorno. GitHub Pages requiere estar habilitado para servir el sitio.

## Redacción técnica y estilo formal
La sección de tecnología desarrolla ocho capítulos con 32 apartados y 64 párrafos de exposición continua. Los encabezados describen conceptos, arquitectura, funciones y limitaciones; se eliminan las formulaciones interrogativas del texto informativo. Las referencias se reúnen en Fuentes y bibliografía, con enlaces desde los capítulos. La búsqueda general indexa también el contenido de estos apartados.

## Ampliación a ocho armadas

80 buques: diez de Alemania, Japón, Estados Unidos, Reino Unido, Francia, Italia, Unión Soviética y España. Se conservan las seis fichas anteriores y se añaden 74 con referencia enciclopédica individual, cronología, función, trayectoria y características técnicas. Nueve fichas incorporan además referencias institucionales. La ampliación añade 55 fotografías y un documento de vistas y silueta con créditos centrales. Dieciocho fichas mantienen un marcador explícito de fotografía pendiente.

El catálogo pagina doce registros y mantiene filtros, ordenación, favoritos y vista de lista. Las pruebas recorren las 80 fichas y rutas permanentes, las ocho selecciones nacionales y todas las páginas del catálogo. Los cambios de nombre conservan un único registro por casco; las fechas iniciales de los acorazados soviéticos incluyen su etapa imperial y las fichas españolas distinguen afiliaciones durante la Guerra Civil. Las cifras mantienen unidades de la referencia y pueden corresponder a configuraciones diferentes señaladas por fecha; esta ampliación no equivale a un contraste especializado de cada dato.
