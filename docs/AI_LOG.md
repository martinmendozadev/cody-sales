# Log de Uso de IA

## Resumen Ejecutivo

Durante el desarrollo de este proyecto, se utilizó Claude  como herramienta auxiliar para acelerar tareas repetitivas y boilerplate. Las decisiones arquitectónicas y correcciones críticas fueron tomadas manualmente y complmentadas con el agente para retroalimentación.

---

## 1. Qué se Generó con IA

### Backend Inicial
- **Scaffold de Express:** Estructura base de `index.ts` con CORS, JSON parser y rutas.
- **Controladores template:** `sales.controller.ts` y `user.controller.ts` con handlers básicos y tipo HTTPContext.
- **Middlewares:** `errorHandler.ts` con lógica genérica de try-catch.
- **Seed básico:** Template de `seed.ts` usando Faker para generar usuarios y sales.
- **Rutas:** Definición de endpoints y mapeo a controladores.

### Frontend Inicial
- **Componentes scaffold:** `Dashboard.tsx`, `SalesForm.tsx` con estructura base, estados de loading/error.
- **API client:** `src/services/api.ts` con axios setup y endpoints declarados.
- **Componentes UI:** `AppButton.tsx`, `Badge.tsx`, `ProgressBar.tsx` con variantes base.
- **App router:** Estructura de `App.tsx` con navegación entre selección de usuario y dashboard.

### Configuración
- **Tailwind config:** Tokens iniciales (colors, fontSize, borderRadius).
- **PostCSS setup:** Hints sobre la necesidad de `postcss.config.cjs`.
- **Vite config:** Recomendación de usar `@vitejs/plugin-react`.
- **Prisma schema:** Modelo inicial de User, MonthlyGoal, Sale, Milestone con relaciones.

---

## 2. Qué se Escribió Directamente

### Backend (Lógica de Negocio)
- **`services/sales.service.ts`:** Lógica core de cálculo de progreso, disparo automático de milestones, y queries de Prisma. IA proporcionó template; nosotros implementamos la lógica de % de meta y la creación de milestones en 50%, 80%, 100%.
- **`prisma.config.ts` y `schema.prisma`:** Migración a Prisma 7, movimiento de `DATABASE_URL` de schema.prisma a prisma.config.ts. IA no capturó esta breaking change.
- **`.nvmrc` y nvm setup:** Decisión manual de usar Node 24 para compatibilidad con Prisma 7.8.0.
- **Relaciones en schema:** Unique constraints en `MonthlyGoal` (userId_month_year) y `Milestone` (userId_type) — decisiones de diseño de BD manual.

### Frontend (Lógica de Integración)
- **`services/api.ts` — interfaces:** Las interfaces `User`, `Milestone`, `ProgressData` se refinaron manualmente para match exacto con backend.
- **`components/Dashboard.tsx`:** La maquetación específica, la conexión entre progreso y nombre del usuario, visualización de hitos, y flujo de refresco tras registrar venta — todo manual.
- **`components/SalesForm.tsx`:** Manejo del estado de formulario, validación, y callback de éxito — manual.
- **`App.tsx`:** Selección de usuario con list-card visual pattern — decisión manual de UX.

### Diseño y Tailwind
- **Token alignment:** Revisión y corrección de nombres en `tailwind.config.js` para que coincidan con lo que realmente se usa en componentes (brand-primary, surface-muted, text-main, etc.) — manual.
- **Color workflow:** Decisión de separar en categorías semánticas (brand, surface, text, success, warning) — manual.
- **Component styling:** Aplicación de estilos específicos en cada componente, ajuste de responsividad — manual.

### Documentación
- **ARRANQUE.md:** Redacción manual documentando entidades de dominio, justificación del stack, y scope decisions.
- **DESIGN_SYSTEM.md:** Documentación de tokens, componentes wrapper, y guías de uso — manual.
- **AI_LOG.md (este archivo):** Manual.
- **ARQUITECTURA.md:** Manual.

---

## 3. Qué Tuvimos que Corregir del Output de IA

### Problema 1: Prisma 7 Breaking Changes
**IA sugirió:** Mantener `DATABASE_URL` en `schema.prisma` bajo datasource.
**Realidad:** Prisma 7 requiere mover la URL a `prisma.config.ts`.
**Acción:** Investigué el error "url is not allowed in datasource", documenté en ARRANQUE.md, y apliqué la corrección.

### Problema 2: PostCSS Configuration Missing
**IA sugirió:** "Tailwind debería funcionar automáticamente en Vite".
**Realidad:** Sin `postcss.config.cjs`, las directivas `@tailwind` no se procesan.
**Acción:** Creé `postcss.config.cjs` con tailwindcss y autoprefixer plugins. Esto fue crítico para que Tailwind funcionara.

### Problema 3: Tailwind Token Mismatch
**IA sugirió:** Tokens genéricos como `blue-500`, `gray-600` en AppButton.
**Realidad:** Necesitábamos nombres semánticos (brand-primary, surface-muted) para gobernar el sistema.
**Acción:** Reescribí tailwind.config.js y audité todos los componentes para aplicar tokens correctos.

### Problema 4: Node Version Incompatibility
**IA sugirió:** "Debería funcionar con Node 20".
**Realidad:** Prisma 7.8.0 requiere Node >=24.
**Acción:** Usé nvm para setear Node 24.15.0 y creé `.nvmrc` para que otros desarrolladores no gastaran tiempo debuggeando esto.

### Problema 5: Tipo de ProgressData incompleto
**IA sugirió:** Interface sin campo `name`.
**Realidad:** El backend devuelve el nombre del usuario en getProgress.
**Acción:** Agregué `name: string` a ProgressData en api.ts y en el servicio de backend.

### Problema 6: TypeScript Verbatim Module Syntax
**IA sugirió:** Usar imports type-only con verbatimModuleSyntax activado.
**Realidad:** commonjs/ts-node tiene conflictos con esto.
**Acción:** Usé `ts-node --transpile-only` para seed scripts.

---

## 4. Momentos donde Divergimos de la Sugerencia de IA

### Decisión 1: No usar NestJS
**IA sugirió:** "Para un proyecto profesional, NestJS aporta estructura".
**Nuestro criterio:** Para 3 endpoints, NestJS es overkill. Express + carpetas (routes, controllers, services) da la misma claridad sin boilerplate.
**Resultado:** Código más ágil, setup 50% más rápido.

### Decisión 2: SQLite en lugar de PostgreSQL
**IA sugirió:** "PostgreSQL es más profesional y escalable".
**Nuestro criterio:** La prueba técnica especifica "en memoria o SQLite". Mejor minimizar dependencias del evaluador (no instalar Postgres). Prisma ORM garantiza que cambiar a Postgres luego es trivial.
**Resultado:** Zero setup, dev local limpio.

### Decisión 3: Tailwind directo sin Shadcn
**IA sugirió:** "Shadcn UI te da componentes pulidos listos".
**Nuestro criterio:** Shadcn es useful para apps grandes. Aquí necesitábamos control total sobre tokens y reglas. Tailwind puro + wrappers propios es más educativo y escalable.
**Resultado:** Sistema de diseño completamente nuestro, fácil de auditar y evolucionar.

### Decisión 4: No usar React Query / TanStack Query
**IA sugirió:** "React Query maneja caché y refetching".
**Nuestro criterio:** Para 3 endpoints y 8 usuarios, React hook estándar (useState + useEffect) es suficiente. React Query sería overhead de aprendizaje.
**Resultado:** Menos dependencias, código legible.

### Decisión 5: Milestone auto-trigger en backend, no en frontend
**IA sugirió:** "Calcula hitos en el cliente después de obtener el progreso".
**Nuestro criterio:** Si se registra una venta y se crea un milestone, esto es un evento de negocio que debe persistir. El backend garantiza que es consistente incluso si el cliente crashea.
**Resultado:** Lógica confiable, auditoria clara de eventos.

### Decisión 6: User selection screen en lugar de Authentication
**IA sugirió:** "Implementa login con JWT".
**Nuestro criterio:** La prueba no pide autenticación, agregarla consume tiempo sin aportar a la evaluación. Selection simple de usuario es suficiente para probar la lógica.
**Resultado:** Setup rápido, funcionalidad clara.

---

## 5. Workflows de IA que Aceleró el Proyecto

### Rápido Setup de Boilerplate
IA fue útil para:
- Generar scaffold de Express (routes, controllers structure).
- Crear template de componentes React con TypeScript.
- Boilerplate de configuración (Vite, Tailwind, PostCSS hints).

**Ganancia de tiempo:** ~1.5 horas.

### Iteración Rápida en UI
IA fue útil para:
- Sugerencias rápidas de className combinations.
- Ideas de variantes de componentes (primary, secondary, outline).
- Templates de formularios y manejo de estados.

**Ganancia de tiempo:** ~1 hora.

### Debugging de Errores
IA fue útil para:
- Interpretar mensajes de error (Prisma, Tailwind, TypeScript).
- Sugerir archivos de configuración faltantes (postcss.config.cjs).
- Proponer soluciones de versión (Node 24 vs 20).

**Ganancia de tiempo:** ~1.5 horas.

---

## 6. Lesiones Aprendidas

1. **Las breaking changes de librerías (Prisma 7, TypeScript, Node versions) no las captura IA perfectamente.** Siempre verifica docs oficiales.
2. **IA es excelente para boilerplate, pero lógica de negocio (milestone triggering, schema design) debe ser manual.**
3. **Tokens semánticos requieren decisión consciente.** IA generará tokens genéricos; nosotros tenemos que pensarlos en contexto del producto.
4. **Configuración de build (PostCSS, Vite, TypeScript) es crítica y IA no siempre la completa.** Chequea que compile clean antes de avanzar.
5. **Divergir de sugerencias de IA es OK** si tu criterio es sólido. Menos dependencias = menos problemas futuros.

---

## 7. Timeboxing: Cuánto Tiempo Cada Cosa

| Tarea | Tiempo Con IA | Tiempo Sin IA (est.) | Ahorro |
|-------|---------------|----------------------|--------|
| Scaffold backend | 30 min | 1.5 h | 1 h |
| Scaffold frontend | 30 min | 1.5 h | 1 h |
| Lógica de negocio | 1 h | 1.5 h | 0.5 h |
| Configuración build (fix) | 1.5 h | 2.5 h | 1 h |
| UI componentes | 1 h | 2 h | 1 h |
| Documentación | 1 h | 1 h | 0 h |
| **Total** | **5.5 h** | **10 h** | **4.5 h** |

IA aceleró boilerplate y debugging, pero no reemplazó decisiones arquitectónicas ni lógica core.

---

## Conclusión

**IA como herramienta, no como remplazo:**
- ✅ Genera boilerplate rápido.
- ✅ Ayuda a iterar UI.
- ✅ Acelera debugging de configuración.
- ❌ No toma decisiones de arquitectura.
- ❌ No escribe lógica de negocio confiable.
- ❌ No captura breaking changes de dependencias.

**Criterio aplicado:**
Usamos IA para lo mecánico (scaffolding), pero reviewamos y ajustamos lógica crítica (business logic, schema, configuración). Esto balanceó velocidad con calidad, respetando el time budget (~8 horas) sin comprometer entrega.
