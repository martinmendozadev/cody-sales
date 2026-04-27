# Sistema de Diseño de Cody Sales

## 1. Introducción: Elección de la Librería

Se eligió **Tailwind CSS** en lugar de alternativas como Shadcn UI, HeroUI, Material o Ant Design por las siguientes razones:

- **Atomicidad y control:** Tailwind permite definir tokens semánticos (brand-primary, success-base) sin abstracciones intermedias que oculten el CSS subyacente.
- **Escalabilidad:** El sistema está pensado para crecer — nuevos colores, tipografías y espaciados se añaden en `tailwind.config.js` sin modificar componentes individuales.
- **Rendimiento:** Tailwind genera CSS purgado, resultando en un bundle de ~13.5 KB gzipped (incluida la compilación PostCSS).
- **Componentes wrapper propios:** En lugar de depender de una librería monolítica, construimos componentes reutilizables (`AppButton`, `Badge`, `ProgressBar`) que aplican las reglas del sistema.
- **Developer experience:** La configuración centralizada en `tailwind.config.js` y `postcss.config.cjs` mantiene las decisiones de diseño en un solo lugar.

---

## 2. Tokens Semánticos

### Colores

Dividimos la paleta en categorías semánticas que comunican propósito, no nombre técnico:

#### Brand (Identidad de Cody)
- **brand-primary**: `#5B6CF0` — Color principal para CTAs, buttons primarios, progreso de objetivo.
- **brand-secondary**: `#3A48B8` — Variante oscura para hover states y énfasis secundario.
- **brand-accent**: `#E5E9FE` — Fondo sutil para destacar areas, backgrounds de tarjetas.

#### Surface (Superficies e Interacción)
- **surface-base**: `#FFFFFF` — Fondo principal, cards de contenido.
- **surface-muted**: `#F8F9FC` — Fondo secundario, áreas inactivas.
- **surface-border**: `#E8EBF5` — Bordes, separadores.

#### Text (Tipografía)
- **text-main**: `#1A1A1A` — Texto principal, cuerpo.
- **text-muted**: `#666666` — Texto secundario, labels, hints.

#### Feedback States
- **success-subtle**: `#ECFDF3` — Fondo para estados exitosos.
- **success-base**: `#027A48` — Texto/bordes en states de éxito (ej. hito 100%).
- **warning-subtle**: `#FFFAEB` — Fondo para estados de advertencia.
- **warning-base**: `#B54708` — Texto/bordes en states de advertencia (ej. falta progreso).

### Tipografía

Escala nombrada que comunica rol semántico:

```
heading-xl:  3.5rem  — Hero/landing (no usado actualmente)
heading-lg:  2.25rem — Títulos de página principales
heading-md:  1.5rem  — Subtítulos, nombres de usuarios
body-lg:     1.125rem — Descriptions, énfasis en cuerpo
body-md:     1rem    — Texto estándar
body-sm:     0.875rem — Labels, badges, hints
```

### Espaciado y Radius

- **Bordes:** `sm` (0.375rem), `md` (0.75rem), `lg` (1.25rem), `full` (9999px para pills).
- **Sombras:**
  - `soft`: Sombra sutil para profundidad (cards, modales).
  - `card`: Sombra brand-colored para destacar elementos principales.

---

## 3. Componentes Wrapper

### AppButton

**Propósito:** Encapsular variantes de botón con reglas de tamaño, color y estado de loading.

**Variantes:**
```tsx
// Primary — CTA principal (registrar venta, enviar)
<AppButton variant="primary">Registrar Venta</AppButton>

// Secondary — Acciones secundarias (cancelar, más info)
<AppButton variant="secondary">Cancelar</AppButton>

// Outline — Acciones terciarias (borrar, reset)
<AppButton variant="outline">Limpiar</AppButton>
```

**Tamaños:**
```tsx
<AppButton size="sm">Small</AppButton>    // Botones en toolbar
<AppButton size="md">Medium</AppButton>  // CTA estándar
<AppButton size="lg">Large</AppButton>   // Hero buttons
```

**Estado Loading:**
```tsx
<AppButton isLoading>Guardando...</AppButton>
```

**Decisión:** Se abstractó el estado de `disabled`, `loading spinner`, y `className` merge (via `cn()` utility) para que los desarrolladores no tengan que repetir lógica.

### Badge

**Propósito:** Representar tags y estados en forma de píldora (hitos, labels).

**Variantes:**
```tsx
// Success — Logro desbloqueado
<Badge variant="success">50% 🎯</Badge>

// Warning — Casi sin tiempo
<Badge variant="warning">Falta poco</Badge>

// Default — Información neutra
<Badge variant="default">Enero 2026</Badge>
```

**Decisión:** Cada variante aplica colores semánticos (success-subtle + success-base) para feedback claro. El borde se aplica automáticamente en variantes de estado.

### ProgressBar

**Propósito:** Visualizar porcentaje de progreso hacia meta.

**Comportamiento:**
- Acepta un `percentage` (0-100) que se clampea automáticamente.
- Cambia de color `brand-primary` a `success-base` cuando se alcanza 100%.
- Transición suave con `duration-500` para feedback visual.

```tsx
<ProgressBar percentage={75} />  // 75% → brand-primary
<ProgressBar percentage={100} /> // 100% → success-base
```

**Decisión:** La lógica de cambio de color vive en el componente, no en el padre. Esto garantiza consistencia.

---

## 4. Qué se Abstractó vs. Qué se Dejó en Tailwind Base

### Abstracto (Wrapper Components)
- **Botones:** Todas las variantes y tamaños en un componente.
- **Badges:** Estados de feedback con semántica clara.
- **Barras de progreso:** Cálculo de color dinámico según porcentaje.
- **Focus states, disabled states, spinner:** Lógica compartida centralizada.

### Dejado en Tailwind Base
- **Espaciado (p-, m-, gap-):** Se usa Tailwind directo en componentes para flexibilidad rápida.
- **Utilidades de layout (flex, grid, w-, h-):** Demasiado genéricas para encapsular, mejor dejarlas en la vista.
- **Tipografía (text-body-md, text-heading-lg):** Se aplica directamente en texto y no requiere wrapper.
- **Colores base:** Los tokens están definidos pero se usan via Tailwind classes (bg-brand-primary, text-success-base).

**Justificación:** Mantener balance entre reutilización y flexibilidad. Wrapper components para patrones que se repiten (botones, badges); utilities para lo específico de cada vista.

---

## 5. Guía de Uso en Desarrollos Futuros

### 1. Agregar un nuevo color semántico
Edita `frontend/tailwind.config.js` en la sección `extend.colors`:
```js
error: {
  subtle: '#FEECEB',
  base: '#C42E0C',
}
```
Luego usa: `bg-error-subtle`, `text-error-base`.

### 2. Crear un nuevo wrapper component
Si identificas un patrón que se repite (ej. un Card), crea el componente en `src/components/ui/`:
```tsx
export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="bg-surface-base rounded-lg shadow-soft p-6">
    {children}
  </div>
);
```
Aplica tokens semánticos, no values arbitrarios.

### 3. Mantener consistencia de espaciado
Usa la escala de Tailwind estándar (4 unidades = 1 rem). Evita valores arbitrarios como `w-[347px]`.

### 4. Testing de diseño
Todos los componentes UI viven en `src/components/ui/` y tienen proptype-like interfaces. Mantén `variant`, `size` y `className` como props para máxima reutilización.

---

## 6. Archivo de Configuración

Toda la configuración vive en dos archivos:

- **`tailwind.config.js`:** Tokens, escales, extensiones del tema.
- **`postcss.config.cjs`:** Pipeline de CSS (Tailwind + Autoprefixer).

Cambios a estos archivos se reflejan automáticamente en el dev server (HMR activado en Vite).

---

## Resumen

Este sistema de diseño prioriza:
✅ **Semántica:** Nombres que comunican propósito, no implementación.
✅ **Escalabilidad:** Crecer sin modificar componentes existentes.
✅ **Mantenibilidad:** Reglas centralizadas, fáciles de auditar y cambiar.
✅ **Flexibilidad:** Wrapper para patrones; utilities para lo específico.
