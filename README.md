# Cody Sales · Módulo de Seguimiento de Objetivos de Ventas

Plataforma gamificada para potenciar el rendimiento de promotores de venta. Registra ventas del día, visualiza progreso hacia la meta mensual y desbloquea reconocimientos en hitos clave (50%, 80%, 100%).

## 🚀 Quick Start

Después de clonar el repositorio, ejecuta estos 2 comandos:

### Backend
```bash
cd backend
npm install
npm run seed    # Genera 8 usuarios de prueba con datos ficticios
npm run dev     # Inicia servidor en http://localhost:3001
```

### Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev     # Inicia Vite en http://localhost:5173
```

**Listo.** Abre http://localhost:5173 y selecciona un usuario para empezar.

---

## 📋 Qué Encontrarás

### Documentación
- **[ARRANQUE.md](docs/ARRANQUE.md)** — Entidades de dominio, justificación del stack, decisiones de scope.
- **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** — Tokens semánticos, componentes wrapper, guía de uso.
- **[AI_LOG.md](docs/AI_LOG.md)** — Qué fue generado con IA, qué se corrigió, dónde divergimos.
- **[ARQUITECTURA.md](docs/ARQUITECTURA.md)** — Escalado a 10K usuarios, roadmap de 12 semanas.

### Backend (`/backend`)
```
config/db.ts              — Prisma client con adaptador SQLite
controllers/              — Handlers HTTP (sales, users)
services/sales.service.ts — Lógica de negocio: progreso, hitos, ventas
routes/                   — Definición de endpoints
prisma/schema.prisma      — Modelos ORM y relaciones
seed.ts                   — Generador de datos de prueba
index.ts                  — App Express
```

**Stack:** Node.js 24 + Express 5 + Prisma 7 + TypeScript 6 + SQLite

### Frontend (`/frontend`)
```
src/components/
  ├── Dashboard.tsx       — Pantalla principal: progreso, hitos, form
  ├── SalesForm.tsx       — Registro de venta
  ├── App.tsx             — Router y selección de usuario
  └── ui/
      ├── AppButton.tsx   — Componente botón (primary/secondary/outline)
      ├── Badge.tsx       — Badges para hitos y estados
      └── ProgressBar.tsx — Visualizador de % progreso
src/services/api.ts       — Cliente Axios con tipos TypeScript
tailwind.config.js        — Tokens semánticos (colores, tipografía)
postcss.config.cjs        — Pipeline CSS (Tailwind + Autoprefixer)
```

**Stack:** React 19 + Vite 8 + Tailwind CSS 3 + TypeScript 6 + Axios

---

## 🏗️ Arquitectura

### Modelos de Datos

```
User
├── MonthlyGoal (target de ventas en mes/año específico)
├── Sale (cada venta registrada)
└── Milestone (hitos desbloqueados: 50%, 80%, 100%)
```

### API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/usuarios` | Listar todos los usuarios |
| **POST** | `/api/ventas` | Registrar una venta |
| **GET** | `/api/progreso/:userId` | Obtener progreso actual + hitos |
| **GET** | `/api/ventas/:userId` | Historial de ventas del usuario |

### Flujo de Interacción

1. **Usuario selecciona promotor** → GET /api/usuarios
2. **Dashboard carga progreso** → GET /api/progreso/:userId
3. **Registra venta** → POST /api/ventas
4. **Sistema calcula milestones automáticamente**
5. **Dashboard se actualiza con nuevo progreso + badges**

---

## 🎨 Sistema de Diseño

Este proyecto define un sistema de diseño completo con:

- **Tokens semánticos:** Colores nombrados por propósito (brand-primary, success-base, warning-base) no por valor (blue-500).
- **Componentes wrapper:** AppButton, Badge, ProgressBar encapsulan reglas de diseño.
- **Escala de tipografía:** heading-lg, body-md, body-sm con valores predefinidos.
- **Espaciado y sombras:** Escalas consistentes basadas en rem.

Ver detalles en [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

---

## 🧪 Testing Local

### Verificar base de datos
```bash
cd backend
npm run seed
# Output: "✅ Seeded 8 users with sales and milestones"
```

### Verificar API
```bash
# Terminal 1: backend corriendo
# Terminal 2:
curl http://localhost:3001/api/usuarios
# Respuesta: Array de 8 usuarios

curl http://localhost:3001/api/progreso/[userId]
# Respuesta: { target, current, percentage, milestones }
```

### Verificar frontend
```bash
# Terminal 1: backend + frontend corriendo
# Abre http://localhost:5173
# Selecciona un usuario
# Dashboard debe mostrar progreso, hitos, form
```

---

## 💾 Base de Datos

**Ubicación:** `/backend/dev.db` (SQLite, versionado en .gitignore)

Ejecutar migraciones:
```bash
cd backend
npx prisma migrate dev --name init
```

Ver datos en Prisma Studio:
```bash
npx prisma studio
```

---

## 🔄 Workflows Comunes

### Agregar un nuevo usuario
```bash
cd backend
# Edita seed.ts y agrega un nuevo faker.person.fullName()
npm run seed
```

### Agregar una nueva meta de ventas
```bash
# La meta se crea automáticamente para cada usuario en seed.ts
# Vía Prisma, o manualmente en Studio
```

### Cambiar colores del sistema
```bash
# Edita frontend/tailwind.config.js en la sección 'colors'
# Los componentes usarán automáticamente los nuevos valores
```

### Agregar un nuevo endpoint
```bash
# 1. Crear ruta en backend/routes/
# 2. Crear controlador en backend/controllers/
# 3. Crear servicio en backend/services/
# 4. Exportar en backend/index.ts
# 5. Consumir desde frontend/src/services/api.ts
```

---

## 📊 Stack Choices

### Por qué Node.js + Express vs NestJS
Express es ágil para MVPs; NestJS sería boilerplate innecesario para 3 endpoints.

### Por qué SQLite vs PostgreSQL
Minimiza setup del evaluador. Prisma ORM permite cambiar a Postgres en producción con 2 líneas.

### Por qué Tailwind vs Shadcn/Material
Tailwind da control total sobre tokens. Shadcn sería overhead para un MVP.

Ver justificaciones completas en [ARRANQUE.md](docs/ARRANQUE.md).

---

## 🚢 Deployment (Próximas Fases)

- **Backend:** Railway, Render o Fly.io (Node.js support, PostgreSQL)
- **Frontend:** Vercel o Netlify (Vite build artifact)
- **Configurar .env** con URL de API en producción

Ver roadmap en [ARQUITECTURA.md](docs/ARQUITECTURA.md).

---

## 📝 Uso de IA

Este proyecto fue desarrollado con Claude como herramienta auxiliar para boilerplate y debugging. Se aplicó criterio en todas las decisiones arquitectónicas, lógica de negocio y configuración.

Detalles: [AI_LOG.md](docs/AI_LOG.md)

---

## 📧 Contacto

Preguntas o feedback: [Crear issue o PR](https://github.com/yourusername/cody-sales)

---

## 📄 Licencia

Véase [LICENSE](LICENSE)
