# 🚀 GUÍA PASO A PASO: CÓMO SUBIR AQUASPHERE™ A TU TIENDA SHOPIFY

Esta guía te explica de forma clara, sencilla y directa cómo pasar todo lo que hemos diseñado a tu tienda de **Shopify** en menos de **5 minutos**.

---

## 📁 ARCHIVOS PREPARADOS EN TU ORDENADOR

Todos los archivos listos para Shopify están en tu carpeta:
👉 **`D:\Dropshiping`**

- **`aquasphere-section.liquid`**: El código completo de la landing page listo para copiar y pegar en Shopify como sección.
- **`css\style.css`**: Todos los estilos visuales y animaciones.
- **`js\main.js`**: Funcionalidad interactiva (selector de colores, galería, modal de términos, contador, etc.).
- **`js\reviews-data.js`**: Base de datos de las 248 reseñas verificadas con fotos reales.
- **`images\`**: Todas las imágenes organizadas (fotos de producto azul/rosa, logo, iconos y avatares).

---

## 🛠️ PASO 1: Subir las fotos y archivos a tu Shopify (2 minutos)

1. Entra a tu panel de administración de Shopify:  
   👉 **`https://admin.shopify.com`**
2. En el menú de la izquierda, ve a **Tienda online (Online Store)** > **Temas (Themes)**.
3. En tu tema activo (por ejemplo: *Dawn*, *Debutify*, *Prestige*, *Impulse*, etc.), haz clic en el botón de los **tres puntos (`...`)** al lado de "Personalizar" (Customize) y selecciona:  
   👉 **Editar código (Edit code)**.
4. En la barra lateral izquierda, baja hasta la carpeta **Assets (Recursos / Archivos)**.
5. Haz clic en **Add a new asset (Agregar un nuevo archivo / recurso)** y sube:
   - El archivo **`style.css`** (de `D:\Dropshiping\css\style.css`)
   - El archivo **`main.js`** (de `D:\Dropshiping\js\main.js`)
   - El archivo **`reviews-data.js`** (de `D:\Dropshiping\js\reviews-data.js`)
6. Ahora sube también a esa misma carpeta **Assets** las imágenes principales de `D:\Dropshiping\images`:
   - `blue-closed.jpg`
   - `blue-in-use.jpg`
   - `pink-closed.jpg`
   - `pink-in-use.jpg`
   - `logo.png`
   - `shield-water.png`, `leaf-bowl.png`, `icon-pillar3.png`
   - Los 248 avatares 100% únicos de las reseñas (`avatar-1.jpg` a `avatar-248.jpg`), ubicados en `images\avatars\` y también copiados en `images\` para que no se repita ninguna imagen. (Consejo: puedes seleccionar todas con `Ctrl + A` y arrastrarlas directamente a la carpeta Assets de Shopify).

---

## 🛠️ PASO 2: Pegar el código de la Landing Page en Shopify (1 minuto)

1. En la misma pantalla de **Editar código (Edit code)** de Shopify, busca la carpeta llamada **Sections (Secciones)**.
2. Haz clic en **Add a new section (Agregar una nueva sección)**.
3. Elige nombre: **`aquasphere-landing`** (Shopify creará `sections/aquasphere-landing.liquid`).
4. **Borra todo** lo que venga por defecto dentro de ese archivo.
5. Abre en tu ordenador el archivo:  
   👉 **`D:\Dropshiping\aquasphere-section.liquid`**  
   (Puedes abrirlo con el Bloc de notas o VS Code, seleccionas todo con `Ctrl + A` y copias con `Ctrl + C`).
6. **Pega todo** el código en el archivo de Shopify y haz clic en el botón verde superior **Guardar (Save)**.

---

## 🛠️ PASO 3: Publicar la Landing Page en tu Tienda (2 minutos)

Tienes 2 formas muy fáciles según cómo quieras mostrarla:

### OPCIÓN A (Como Página de Inicio o Landing de Producto - RECOMENDADA):
1. En tu panel de Shopify ve a **Tienda online (Online Store)** > **Temas (Themes)**.
2. Haz clic en el botón verde **Personalizar (Customize)**.
3. En la barra lateral izquierda del editor visual, haz clic en **Agregar sección (Add section)**.
4. Escribe en el buscador: **AquaSphere Landing Page**.
5. Selecciónala y colócala arriba del todo.
6. Haz clic en **Guardar (Save)** arriba a la derecha. ¡Ya está publicada en vivo!

---

### OPCIÓN B (Como una Página propia con su URL, ej: `tutienda.com/pages/aquasphere`):
1. En **Editar código (Edit code)**, ve a la carpeta **Templates (Plantillas)** y haz clic en **Add a new template**.
2. Selecciona:
   - **Template for**: `page`
   - **Type**: `liquid`
   - **File name**: `aquasphere`
3. En el archivo que se crea (`templates/page.aquasphere.liquid`), escribe:
   ```liquid
   {% section 'aquasphere-landing' %}
   ```
4. Haz clic en **Guardar (Save)**.
5. Luego ve a **Tienda online (Online Store)** > **Páginas (Pages)** > **Agregar página (Add page)**:
   - **Título**: `AquaSphere™ Portable Pet Flask`
   - En la columna derecha, en **Theme template (Plantilla de tema)**, selecciona **`aquasphere`**.
   - Haz clic en **Guardar**.
6. Ya tienes tu landing funcionando en su enlace propio: `tutienda.com/pages/aquasphere`.

---

## 💳 PASO 4: Conectar el botón "ADD TO CART" con tu Producto en Shopify

Para que cuando los clientes hagan clic en **ADD TO CART**, el producto se agregue al carrito real de Shopify y vayan al checkout de pago:

1. Ve a **Productos (Products)** > **Agregar producto (Add product)** en tu Shopify.
2. Ponle de título: `AquaSphere™ Portable Pet Flask`.
3. Ponle de precio: `$24.95` (Precio de comparación: `$49.99`).
4. En **Variantes**, añade la opción de Color:
   - `Pastel Blue`
   - `Blush Pink`
5. Guarda el producto.
6. Shopify ya gestiona automáticamente la ruta `/cart/add` y redirige a `/checkout`, por lo que el botón que hemos programado enviará directamente al cliente a tu pasarela de cobro activa (Shopify Payments, Stripe, PayPal, etc.).

¡Todo listo para vender!
