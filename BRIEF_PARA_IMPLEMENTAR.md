# 📸 BRIEF PARA IMPLEMENTAR EJEMPLOS - SPACELY AI

---

## 🎯 OBJETIVO

Implementar una galería de ejemplos Before/After en el home de Spacely AI para maximizar conversión.

---

## 📦 IMÁGENES INCLUIDAS

### BEFORE (4 imágenes base):

1. **sala-estar-vacia-muebles-puerta_305343-47672.avif**
   - Tipo: Living Room vacía
   - Usar como: Base para transformación living

2. **please-dont-kill-me-painting-revitalizing-old-kitchen-v0-pshezzqc7qjd1.webp**
   - Tipo: Cocina vieja años 80 con gabinetes madera oscura
   - Usar como: Base para transformaciones kitchen

3. **habitacion-vacia-casa-nueva.jpg**
   - Tipo: Dormitorio vacío con closets
   - Usar como: Base para transformaciones bedroom

4. **what-in-the-world-to-do-with-this-50s-pink-burgundy-tile-v0-3ni6qfjcclka1.webp**
   - Tipo: Baño rosa/burgundy años 50
   - Usar como: Base para transformaciones bathroom

### AFTER (10 transformaciones):

**LIVING ROOM:**
- replicate-prediction-1sgrm7zxr9rmr0cvmqcstqdv04.jpeg → Modern Minimalist

**KITCHEN:**
- replicate-prediction-cfcty851k5rmr0cvmqe9q2sffr.jpeg → Scandinavian Wood
- (falta navy blue - usar una similar o regenerar)
- (falta white modern - usar una similar o regenerar)

**BEDROOM:**
- replicate-prediction-kqnpa9f7tdrmy0cvmqj8bq1bd0.jpeg → Dark Moody
- replicate-prediction-6e96t53md9rmw0cvmqj88z0var.jpeg → Hotel Suite
- replicate-prediction-8twv0dtcvxrmr0cvmqjbffqjpr.jpeg → Classic Luxury

**BATHROOM:**
- replicate-prediction-zckthr70vhrmt0cvmqm87jhyec.jpeg → Scandinavian Brass
- replicate-prediction-r7aescnddhrmw0cvmqmb698qmw.jpeg → Industrial Black
- replicate-prediction-rpjfwrgc71rmr0cvmqmbgkv0b8.jpeg → Spa Luxury

---

## 📝 INSTRUCCIONES PARA LA IA

### Paso 1: Subir a Supabase

```
1. Sube todas las imágenes a Supabase Storage
2. Organiza en carpetas:
   - /examples/before/
   - /examples/after/
3. Haz públicas todas las URLs
4. Anota las URLs en un archivo para usarlas después
```

### Paso 2: Crear la estructura

**Crear tabla en Supabase:**
- Campos: id, room_type, style_name, before_url, after_url, title, description
- Insertar los 10 ejemplos con sus URLs

---

## 🎨 DISEÑO DE LA WEB

### Hero Section (arriba del todo):

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  HEADLINE: "2M+ Habitaciones Rediseñadas   │
│             Tu Próximo Diseño en 1 Segundo" │
│                                             │
│  SUBTITLE: "Sube una foto y mira la magia  │
│            en tiempo real"                  │
│                                             │
│  [✓ Gratis  ✓ Sin registro  ✓ 1 segundo]  │
│                                             │
│  [Botón: Transforma Tu Espacio Ahora →]    │
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                             │
│  [Before/After Carousel con 1 ejemplo]      │
│   - Mostrar Kitchen Navy o Bathroom Black   │
│   - Con slider para comparar                │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Galería de Transformaciones:

**Layout:**
```
HEADLINE: "Transformaciones que Inspiran"
SUBTITLE: "Tu habitación podría ser la próxima"

[Filtros: Todos | Cocinas | Dormitorios | Baños | Salas]

Grid 3 columnas:
┌────────┐ ┌────────┐ ┌────────┐
│ Card 1 │ │ Card 2 │ │ Card 3 │
│ Before │ │ Before │ │ Before │
│  on     │ │  on    │ │  on    │
│ hover:  │ │ hover: │ │ hover: │
│ After  │ │ After  │ │ After  │
└────────┘ └────────┘ └────────┘

Cada card:
- Imagen (hover cambia before → after)
- Badge: "MÁS POPULAR" o "WOW FACTOR"
- Título: "De Anticuada a Elegancia Navy"
- Descripción breve
- CTA: "Probar Este Estilo →"
```

---

### Sección: "Múltiples Estilos"

**Layout:**
```
HEADLINE: "No te Limites a Un Solo Estilo"

Grid horizontal 4 columnas:
[ANTES] → [DESPUÉS 1] → [DESPUÉS 2] → [DESPUÉS 3]
Kitchen     Navy          Scandi        White

Texto: "Misma cocina. 3 estilos diferentes."
[CTA: Probar Con Mi Foto →]
```

---

## ✍️ COPYS PARA CADA EJEMPLO

### Living Room - Modern Minimalist
```
Título: "De Vacío a Minimalista Moderno"
Descripción: "Una sala vacía transformada en un espacio elegante con líneas limpias y luz natural."
CTA: "Probar Estilo Minimalista →"
```

### Kitchen - Navy Luxury
```
Título: "De Anticuada a Elegancia Navy"
Descripción: "Gabinetes de los 80s convertidos en cocina de lujo con isla de mármol y acabados navy."
Badge: "MÁS POPULAR"
CTA: "Transformar Mi Cocina →"
```

### Kitchen - Scandinavian Wood
```
Título: "Calidez Escandinava Renovada"
Descripción: "Moderniza la madera con diseño luminoso, open shelving y subway tiles."
CTA: "Ver Estilo Escandinavo →"
```

### Kitchen - Modern White
```
Título: "Blanco Brillante Contemporáneo"
Descripción: "El clásico atemporal: gabinetes blancos con mármol que nunca pasa de moda."
Badge: "FAVORITO"
CTA: "Probar Estilo Blanco →"
```

### Bedroom - Dark Moody
```
Título: "Habitación Moody Dramática"
Descripción: "Pared negra mate con cama flotante LED y arte geométrico para un estilo masculino sofisticado."
Badge: "IMPRESIONANTE"
CTA: "Crear Ambiente Moody →"
```

### Bedroom - Hotel Suite
```
Título: "Suite de Hotel Boutique"
Descripción: "Dormitorio de 5 estrellas con headboard LED, lámparas colgantes y textiles de lujo."
CTA: "Diseñar Mi Suite →"
```

### Bedroom - Classic Luxury
```
Título: "Lujo Clásico Atemporal"
Descripción: "Elegancia tradicional con araña de cristal, molduras y pared de mármol."
CTA: "Ver Estilo Clásico →"
```

### Bathroom - Industrial Black
```
Título: "De Rosa Retro a Industrial Negro"
Descripción: "El contraste más dramático: azulejos rosa años 50 convertidos en baño industrial completamente negro."
Badge: "WOW FACTOR"
CTA: "Transformar Mi Baño →"
```

### Bathroom - Spa Luxury
```
Título: "Spa de Lujo en Casa"
Descripción: "Tina freestanding, mármol y grifería dorada transforman un baño vintage en spa de hotel."
Badge: "TRENDING"
CTA: "Crear Mi Spa →"
```

### Bathroom - Scandinavian Brass
```
Título: "Escandinavo Cálido con Brass"
Descripción: "Madera oak, brass fixtures y hexagon tiles para un baño luminoso y acogedor."
CTA: "Probar Este Estilo →"
```

---

## 🎨 GUÍA DE ESTILO VISUAL

### Colores:
```
Primary: Púrpura (#9333ea) y Rosa (#db2777)
Background: Blanco (#ffffff) y Gris muy claro (#f9fafb)
Texto: Gris oscuro (#111827)
Acentos: Verde para badges (#22c55e)
```

### Tipografía:
```
Fuente: Inter (Google Fonts)
Headlines: Bold, tamaño grande (48-64px)
Body: Regular, tamaño normal (16-18px)
```

### Espaciado:
```
Secciones: 80-100px de padding vertical
Entre elementos: 16-24px
Container max-width: 1280px
```

### Botones:
```
Primario: Gradiente púrpura-rosa, texto blanco
Secundario: Borde gris, texto gris oscuro
Hover: Sombra suave, lift ligero
Border radius: 12px
```

---

## 📊 PRIORIDAD DE EJEMPLOS

**Orden de importancia (para destacar):**

1. **Bathroom Industrial Black** - Máximo contraste (10/10 WOW)
2. **Kitchen Navy Luxury** - ROI más alto (9.5/10)
3. **Bedroom Dark Moody** - Muy dramático (10/10)
4. **Bathroom Spa Luxury** - Aspiracional (9/10)
5. Los demás en orden aleatorio

**Featured (destacar en hero):**
- Bathroom Black o Kitchen Navy

---

## ✅ CHECKLIST

```
[ ] Todas las imágenes subidas a Supabase
[ ] URLs públicas obtenidas
[ ] Tabla creada en base de datos
[ ] 10 registros insertados con copys
[ ] Hero Section implementado
[ ] Galería con filtros funcionando
[ ] Cards con hover before/after
[ ] Sección "Múltiples Estilos"
[ ] Badges visibles ("MÁS POPULAR", etc)
[ ] CTAs funcionando
[ ] Responsive mobile
```

---

## 🚀 RESULTADO ESPERADO

Una landing page con:
- Hero impactante arriba
- Galería filtrable de 10 ejemplos
- Hover interactivo (before → after)
- Badges llamativos
- CTAs claros
- Diseño limpio y moderno

**Objetivo:** Que el usuario vea el potencial y haga click en "Transformar Ahora"

---

**Nota:** Si faltan algunas imágenes kitchen (navy/white), puedes regenerarlas o usar placeholders temporales.
