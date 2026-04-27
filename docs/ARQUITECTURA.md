# Nota de Arquitectura: Escalado a 10K Usuarios

## Resumen Ejecutivo

Este documento responde dos preguntas clave: (1) qué cambiarías para producción con 10K usuarios activos, y (2) qué dejaste fuera por tiempo y en qué orden lo priorizarías.

---

## 1. Cambios para Producción (10K Usuarios Activos)

### 1.1 Caching y CDN
En producción, cada GET /progreso/:userId consulta la suma de sales de ese mes. Con 10K usuarios haciendo esto constantemente, la BD sufre. **Solución:** Introducir Redis para cachear progreso por 5 minutos, invalidando solo cuando se registra una venta de ese usuario. CDN para assets estáticos (frontend dist).

### 1.2 Índices de Base de Datos
El schema actual tiene claves primarias y foreigns, pero le faltan índices en columnas de búsqueda frecuente. **Solución:** Agregar índices en `(userId, month, year)` para MonthlyGoal, `(userId)` para Sale y Milestone. Esto reduce latencia de queries de O(n) a O(log n).

### 1.3 Rate Limiting y Autenticación Real
Hoy cualquiera puede registrar ventas si adivina un userId. **Solución:** Implementar JWT o sesiones, rate limiting por usuario (max 10 sales/min), y validación de permisos en cada endpoint. Herramientas: express-rate-limit, jsonwebtoken, o middleware como Helmet.

### 1.4 Notificaciones y Eventos Asincronos
Cuando alguien desbloquea un hito, hoy solo se guarda en BD. Con 10K usuarios, queremos notificaciones push, email, Slack. **Solución:** Desacoplar con una job queue (Bull/Redis queue o AWS SQS). Al crear un milestone, enviar evento a la cola; worker asincronico maneja notificaciones sin bloquear la respuesta HTTP.

### 1.5 Observabilidad (Logging y Metrics)
Sin logs centralizados, debugging en producción es imposible. **Solución:** Winston o Bunyan para logging estructurado, Prometheus + Grafana para métricas (latencia, tasa de errores, sales/min), alertas en PagerDuty si la BD lentifica.

### 1.6 Escalado Horizontal
Express single-thread + SQLite file-based no escalan. **Solución:** Cambiar a PostgreSQL con replicación, desplegar backend en múltiples instancias detrás de un load balancer (Nginx, AWS ALB). Frontend seguiría siendo static en CDN.

### 1.7 Migraciones y Versionado de BD
Cambios de schema hoy requieren downtime manual. **Solución:** Prisma Migrate para aplicar cambios sin perder datos; versionado de API (/api/v1, /api/v2) para compatibilidad backward.

---

## 2. Fuera de Scope por Tiempo: Priorización

Se dejó fuera de esta iteración (8 horas) para mantener entrega clara:

### Prioritario (1-3)
1. **Autenticación y autorización real (1-2 horas):** Sin esto, no hay separación de datos. Un usuario no debe ver progreso de otro. Necesario para ANY MVP serio.
2. **Email/SMS en hitos desbloqueados (1 hora):** Gamificación no funciona sin feedback inmediato. Integrar SendGrid o Twilio (async job).
3. **Histórico de meses anteriores y filtros (1.5 horas):** Dashboard "solo mes actual" es limitante. Agregar selector de mes, tabla de históricos.

### Medio Plazo (4-6)
4. **Analytics y dashboards admin (2 horas):** Cuántas ventas por día, top performers, trends.
5. **Búsqueda y exportación (1 hora):** Descargar sales en CSV para auditoria o análisis.
6. **Multimedia en hitos (1 hora):** Imágenes, animaciones, sonido al desbloquear logros (engagement).

### Backlog Largo Plazo (7+)
7. **Integraciones con CRM (Salesforce, HubSpot):** Sincronizar datos de ventas desde el CRM existente de la empresa.
8. **Mobile app nativa:** React Native para iOS/Android; sincronización offline-first con backend.
9. **Multi-moneda y multi-idioma:** Soporte para equipos globales.
10. **AI coaching:** Recomendaciones personalizadas basadas en historial de ventas (por qué ese mes fue bajo).

---

## 3. Roadmap de 12 Semanas

| Semana | Feature | Effort | Owner |
|--------|---------|--------|-------|
| 1-2 | Autenticación JWT + refresh tokens | 2d | Backend |
| 1-2 | Notificaciones email en hitos | 1d | Backend |
| 3 | Histórico de meses, selectors | 2d | Frontend |
| 3 | Índices de BD, query optimization | 1d | Backend |
| 4 | Admin dashboard (top sellers, trends) | 2d | Frontend |
| 5 | Redis caching y rate limiting | 1d | Backend |
| 5 | CSV export de sales | 1d | Frontend |
| 6 | Pruebas e2e (Cypress) + unit tests | 2d | QA |
| 7-8 | Deployment a producción (AWS/Railway) | 2d | DevOps |
| 8-12 | Mobile app (React Native) | 4w | Mobile |
| 12+ | AI coaching y integraciones CRM | Ongoing | Product |

---

## 4. Decisiones que Aguantan el Escalado

Aunque la versión actual es "MVP", hicimos elecciones que no van a frenar growth:

✅ **Prisma ORM:** Cambiar de SQLite a PostgreSQL es trivial (2 líneas de config).
✅ **API REST clara:** Fácil documentar, fácil versionear.
✅ **Componentes wrapper:** Agregar Dark Mode, nuevas paletas sin tocar lógica.
✅ **Error handling explícito:** Ya tenemos estructura para logs y métricas.
✅ **Schema relacional:** MonthlyGoal, Sale, Milestone están pensados para crecimiento (indices, constraints).

---

## Conclusión

Para 10K usuarios, los cambios críticos son: autenticación real, caching, notificaciones async, índices de BD, y observabilidad. El arquitectura actual permite estos cambios incrementales sin refactoring masivo. La priorización del backlog respeta "features de más impacto primero" (auth, engagement), con infraestructura (Redis, monitoring) entrando en la semana 5 una vez que el MVP está validado.
