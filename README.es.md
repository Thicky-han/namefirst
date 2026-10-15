<p align="center"><img src="assets/brand/namefirst-512.png" width="144" height="144" alt="Icono NF con flecha de NameFirst"></p>
<h1 align="center">NameFirst</h1>
<p align="center"><strong>Busca un nombre. Encuentra primero el sitio oficial.</strong></p>

[简体中文](./README.md) · [English](./README.en.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md) · [Português (Brasil)](./README.pt-BR.md)

NameFirst es una extensión para Chrome y Microsoft Edge de escritorio. Al buscar en Baidu o Bing el nombre de una plataforma incluida en su directorio, muestra una tarjeta claramente identificada con el enlace oficial al principio del área de resultados web. También puedes guardar sitios personales y recuperarlos localmente.

**Esta guía corresponde a 1.1.0: 118 entidades y 173 entradas oficiales, con 68 plataformas y herramientas nuevas de uso habitual entre estudiantes universitarios, incluida Canva 可画.** Consulta [Releases](https://github.com/Thicky-han/namefirst/releases) para saber qué versiones están publicadas y disponibles.

No necesitas una cuenta de NameFirst, una clave de API ni compilar el código. El directorio y los recuerdos personales se procesan localmente; buscar y visitar sitios requiere internet. El proyecto tiene una licencia no comercial con código fuente disponible, resumida más abajo.

**La traducción de la guía no cambia el idioma de la interfaz.** La extensión está principalmente en chino simplificado; incluimos las etiquetas chinas reales para que puedas reconocerlas. Los nombres y alias no se traducen automáticamente: utiliza las consultas de ejemplo tal como aparecen. Todas las guías usan los mismos paquetes y no amplían la compatibilidad con buscadores o regiones. Otros documentos enlazados pueden estar en chino.

## Paso 1: Descarga el paquete de tu navegador

**Para instalarla normalmente, basta con uno de estos ZIP.** Si usas ambos navegadores, descarga e instala cada paquete por separado.

| Navegador | Archivo | Descarga |
| --- | --- | --- |
| Google Chrome | `namefirst-chrome-1.1.0.zip` | [Para Chrome](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-chrome-1.1.0.zip) |
| Microsoft Edge | `namefirst-edge-1.1.0.zip` | [Para Edge](https://github.com/Thicky-han/namefirst/releases/download/v1.1.0/namefirst-edge-1.1.0.zip) |

Para localizar los archivos manualmente:

1. Abre [NameFirst Releases](https://github.com/Thicky-han/namefirst/releases).
2. Abre la versión publicada marcada como **Latest**. Si aún no aparece 1.1.0, utiliza la versión realmente publicada y sus nombres de archivo.
3. Baja hasta **Assets** y despliega la lista con la flecha si está cerrada.
4. Pulsa `namefirst-chrome-VERSIÓN.zip` o `namefirst-edge-VERSIÓN.zip`, según tu navegador, y espera a que termine.

Estos archivos no hacen falta para la instalación normal:

| Archivo | Finalidad |
| --- | --- |
| `namefirst-source-1.1.0.zip` | Código fuente completo y modificable y materiales de compilación para desarrolladores |
| `Source code (zip)` / `Source code (tar.gz)` | Instantáneas de GitHub; no se cargan directamente como extensión ya compilada |
| `release-manifest.json`, `SHA256SUMS.txt` | Comprobación de versión, procedencia e integridad |

El botón verde **Code → Download ZIP** también descarga código fuente. Para instalar, usa el ZIP específico de tu navegador.

## Paso 2: Extrae todo y encuentra la carpeta extension

1. Localiza el ZIP, normalmente en Descargas, desde el administrador de archivos.
2. Haz clic derecho y selecciona **Extraer todo** o la función equivalente de tu sistema. No basta con abrir el ZIP para ver su contenido.
3. Conserva los archivos extraídos en una ubicación permanente: el navegador seguirá leyéndolos. No los borres ni los muevas sin necesidad.
4. Dentro de la carpeta extraída, busca **`extension`**.

Los dos paquetes tienen esta estructura:

```text
namefirst-chrome-1.1.0/
├─ extension/                 ← Selecciona esta carpeta en el paso siguiente
│  ├─ manifest.json
│  ├─ icons/
│  ├─ pages/
│  └─ scripts/
├─ INSTALL.md
├─ PRIVACY.md
└─ ...
```

**Selecciona la carpeta que contiene directamente `manifest.json`.** No selecciones el ZIP, la carpeta exterior, `scripts` ni el archivo manifest en sí.

## Paso 3: Carga NameFirst en el navegador

### Chrome

1. Abre una pestaña nueva en Chrome.
2. Escribe `chrome://extensions` en la **barra de direcciones del navegador** y pulsa Intro, no en el cuadro del buscador.
3. Activa **Modo de desarrollador (Developer mode)**.
4. Pulsa **Cargar descomprimida (Load unpacked)** o el botón equivalente.
5. Selecciona la carpeta **`extension`** extraída y confirma.
6. Comprueba que aparece **NameFirst**, con el icono NF verde oscuro y la flecha verde clara, que indica **1.1.0** y está activada.

### Microsoft Edge

1. Abre una pestaña nueva y escribe `edge://extensions` en la barra de direcciones; pulsa Intro.
2. Activa **Modo de desarrollador (Developer mode)**. Según el diseño, puede estar en el menú lateral.
3. Pulsa **Cargar desempaquetada (Load unpacked)** o su equivalente.
4. Selecciona la carpeta **`extension`** extraída y confirma.
5. Comprueba que **NameFirst 1.1.0** aparece y está activada.

Mantén el modo de desarrollador activado y conserva los archivos. Para actualizar, recarga la tarjeta existente de NameFirst. Esta versión no está en las tiendas de Chrome o Edge. Puedes consultar las instrucciones oficiales de [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) y [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading).

## Paso 4: Prueba una búsqueda

1. Actualiza las pestañas de búsqueda de Baidu/Bing que ya estaban abiertas.
2. Abre [Baidu](https://www.baidu.com/) o [Bing](https://www.bing.com/) y usa la búsqueda **web** normal.
3. Busca exactamente uno de estos ejemplos. Conserva los caracteres chinos: `下载` significa «descarga».

| Consulta | Entrada esperada |
| --- | --- |
| `Steam` | Tienda oficial de Steam |
| `可画` / `Canva可画` | Web oficial de Canva 可画 para China continental |
| `可画下载` | Descarga oficial de Canva 可画 para Windows |
| `Zotero下载` | Descarga oficial de Zotero |
| `腾讯会议下载` | Centro oficial de descargas de Tencent Meeting |
| `RStudio下载` | Descarga oficial de RStudio Desktop de Posit |

4. Encuentra **«NameFirst · 已核实官方入口»** («entrada oficial revisada») al principio del contenedor de resultados web. No se garantiza que esté por encima de anuncios o módulos de IA situados en otras zonas.
5. Pulsa el nombre del sitio o un enlace adicional, como **«官方下载页面»** («página oficial de descarga»).

Se conservan los resultados y anuncios originales. No hay redirección automática ni cambios en la clasificación del servidor del buscador. `Rust` ofrece el lenguaje de programación y el juego como alternativas. Consultas informativas como `Steam 使用教程` suelen conservar la búsqueda normal.

## Paso 5: Fija el icono y gestiona tus sitios

1. Abre el menú **Extensiones** del navegador, normalmente con forma de pieza de puzle.
2. Busca NameFirst y elige fijar o mostrar en la barra de herramientas.
3. Su icono da acceso al interruptor general, los de Baidu/Bing y el de la opción de comentarios.
4. Pulsa **«管理个人记录与备份»** («gestionar registros y copias») para añadir, editar, borrar o buscar registros e importar o exportar JSON.

Para un sitio no incluido, despliega **«选择并记住个人目标»**, revisa el nombre, alias y dirección HTTPS y pulsa **«保存个人目标»**. Al buscar ese nombre o alias, puede aparecer como **«个人记忆»** («recuerdo personal»). Guardarlo no certifica su carácter oficial.

Se admiten hasta 500 destinos y 10 alias por destino. Las copias no están cifradas y su límite es 4.000.000 bytes; guárdalas de forma segura. Chrome y Edge no se sincronizan automáticamente: exporta, importa en el otro navegador y revisa la vista previa. La importación combina por defecto; reemplazar o borrar todo requiere confirmación. Puedes deshacer el último cambio de memoria.

## Actualizar una instalación anterior a 1.1.0

Las extensiones cargadas sin empaquetar no se actualizan automáticamente desde GitHub:

1. En la versión anterior, abre **«管理个人记录与备份»**, exporta una copia, guarda cualquier edición y cierra la página de gestión.
2. Descarga el nuevo ZIP y extráelo completamente en otra carpeta.
3. Localiza la **carpeta `extension` antigua** elegida al instalar; conserva su ubicación.
4. Copia **todo el contenido interior** de la nueva `extension` a la antigua, reemplazando archivos con el mismo nombre. No crees `extension/extension/manifest.json`.
5. En `chrome://extensions` o `edge://extensions`, pulsa **Recargar** o la flecha circular en la tarjeta **existente** de NameFirst.
6. Confirma **1.1.0**, actualiza las búsquedas y comprueba que los registros siguen ahí.

No desinstales antes la versión anterior. El ID estable es `kocncgipjlmfdlhabchnbnjgahlpfjkc`; reemplazar en el mismo sitio y recargar conserva la identidad. Desinstalar, borrar el perfil o cambiar la identidad puede eliminar datos locales. Usa JSON al cambiar de ordenador o perfil.

## Problemas frecuentes

| Problema | Solución |
| --- | --- |
| No encuentro los archivos | Abre el detalle de la versión y despliega Assets; no busques instaladores en la lista del código |
| Falta manifest / no carga | Extrae todo y selecciona la carpeta que contiene `manifest.json`; usa el ZIP del navegador, no el código fuente |
| No veo el icono | Fíjalo desde el menú Extensiones |
| No aparece la tarjeta | Actualiza, revisa los interruptores y prueba `Steam` en resultados web; CAPTCHA, imágenes, noticias, vídeos y páginas de IA independientes no están adaptadas |
| Falta una herramienta | Solo coinciden nombres, alias y subentradas registrados; consulta [CATALOG.md](./CATALOG.md) o guarda un destino personal |
| Falta una descarga | Las páginas de descarga se revisan por separado; incluir un fabricante no incluye todos sus productos ni permite inventar URL de instaladores |
| Sigo en la versión antigua | Reemplaza los archivos en la ubicación original y recarga la tarjeta existente y las búsquedas |
| No puedo activar el modo de desarrollador | Si el navegador está gestionado por tu centro o empresa, consulta al administrador |
| El sitio no abre o pide iniciar sesión | Ser oficial no garantiza disponibilidad regional, acceso sin cuenta ni gratuidad; respeta las condiciones del sitio |

Para ayuda adicional, abre un [Issue](https://github.com/Thicky-han/namefirst/issues) con versiones, buscador y pasos para reproducirlo. No publiques copias personales, credenciales ni páginas sensibles. Descargar y usar no requiere cuenta de GitHub; enviar Issues o PR sí sigue sus requisitos de cuenta.

## Alcance y privacidad

Las 68 incorporaciones abarcan educación, servicios estudiantiles, investigación, escritura, colaboración, análisis de datos, ingeniería, creación, IA, traducción, navegadores y utilidades. Hay **118 entidades y 173 entradas**, diferenciando sitios, tiendas, descargas y documentación. Las fuentes figuran en [CATALOG.md](./CATALOG.md).

«Revisada» significa contrastada con páginas oficiales o enlaces oficiales explícitos al preparar el directorio. **No es una certificación en tiempo real en cada búsqueda ni una auditoría de seguridad del software.** No rastrea sitios en segundo plano, descarga actualizaciones del directorio, entrena en línea, sube comentarios personales ni recopila todo el historial de búsquedas. La validez es de 180 días; después se necesita revisión del mantenedor y una nueva versión. La confirmación personal no renueva las fechas oficiales.

Solo funciona en páginas de búsqueda de escritorio compatibles de Baidu/Bing. Los registros permanecen en el perfil actual. No necesita cuenta del proyecto, servidor del desarrollador, API de pago ni entrenamiento en la nube. Los sitios de destino pueden exigir cuenta, suscripción o licencia universitaria. Véase [PRIVACY.md](./PRIVACY.md).

Se ha comprobado en Chrome/Edge de escritorio en Windows, sin verificar individualmente otros sistemas, todas las versiones históricas o todos los experimentos regionales. Las pruebas controladas y los comentarios manuales reales se distinguen en [VERIFICATION.md](./VERIFICATION.md) y [PRE_RELEASE_CHECK.md](./PRE_RELEASE_CHECK.md).

## Licencia, contribuciones y origen

El trabajo original usa **NameFirst Noncommercial Reciprocal License 1.0**. Permite uso, modificación y distribución gratuitos, incluido uso interno gratuito en empresas. Ventas, servicios de pago, publicidad y otras formas de monetización necesitan autorización aparte. La distribución exige publicar gratuitamente el código correspondiente y los materiales de compilación necesarios; los cambios cubiertos mantienen la misma licencia. Los cambios locales privados no tienen que publicarse.

Es un proyecto **no comercial con código fuente disponible**, no una licencia de código abierto según la OSI. Este texto es un resumen; rige la [LICENSE](./LICENSE) formal. Véase [LICENSE_SCOPE.md](./LICENSE_SCOPE.md). La instalación y el uso normales no requieren firmar un CLA.

Las contribuciones originales siguen [CONTRIBUTING.md](./CONTRIBUTING.md) y un [CLA](./CLA.md) aceptado por separado. Se conserva la titularidad y se pueden conceder derechos de uso comercial, distribución de código cerrado y sublicencia a un receptor identificado en privado. La cuenta pública es `Thicky-han`; las identidades legales y los acuerdos firmados son privados. No se incluyen automáticamente contribuciones sin firmar, código de origen ni trabajos de terceros. Véase [CLA_GUIDE.md](./CLA_GUIDE.md).

Este repositorio es un fork real de [uBlacklist](https://github.com/iorate/ublacklist), fijado a `v10.1.2` / `212384b330002a4c727b034806826e2eb352d7d5`. El código original está en `extension/`; builtin está fijado a `c8bd5b7113dc1d416fa00c45509ac308619751df` e incluido como archivos normales. main conserva la ascendencia real del proyecto original.

Se mantienen MIT, las licencias de terceros y las atribuciones. No se puede describir todo el paquete como MIT. Se incluyen la licencia pública, `UPSTREAM-LICENSE.txt`, procedencia y avisos de dependencias. Véanse [MODIFICATIONS.md](./MODIFICATIONS.md), [NOTICE](./NOTICE) y [UPSTREAM.json](./UPSTREAM.json).

<details>
<summary>Desarrolladores: compilar y verificar el código</summary>

Para uso normal basta con el ZIP del navegador. Para desarrollar necesitas PowerShell 7, Node.js y pnpm. Desde la raíz del proyecto:

```powershell
./scripts/Build.ps1 -InstallDependencies
./scripts/Package.ps1
./scripts/Verify-Package.ps1
./scripts/Audit-Runtime.ps1
node scripts/check-public-content.mjs
node scripts/check-release-content.mjs
```

Genera paquetes formales desde `main` local con los cambios confirmados. En `extension/`:

```powershell
$env:CI = 'true'
$env:LEFTHOOK = '0'
pnpm check
pnpm test
pnpm exec playwright test --config e2e/namefirst/playwright.config.ts
```

devEngines del proyecto original especifica Node 26.10.0; las herramientas locales usan Node 24 del equipo y pnpm 11. El modo independiente `--namefirst` conserva el modo predeterminado del proyecto original. No cambies la clave pública estable ni confundas una compilación predeterminada del proyecto original con NameFirst.

Las pruebas usan perfiles temporales independientes. No se incluyen ni confirman dependencias, cachés, informes generados ni perfiles. El análisis estático no garantiza detectar todos los secretos desconocidos. Mantenimiento y publicación: [PUBLISHING.md](./PUBLISHING.md).

</details>

Más: [Instalación](./INSTALL.md) · [Directorio](./CATALOG.md) · [Novedades](./RELEASE_NOTES.md) · [Verificación](./VERIFICATION.md) · [Especificación](./PROJECT_SPEC.md) · [Plan](./IMPLEMENTATION_PLAN.md). Los informes históricos reflejan su momento; Releases indica el estado de publicación actual.
