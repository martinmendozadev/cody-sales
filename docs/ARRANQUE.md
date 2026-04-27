# Documento de Arranque

## 1. Entidades de Dominio Identificadas

Para resolver el problema del seguimiento de objetivos y gamificación, he identificado las siguientes entidades core:

*   **User (Promotor):** Entidad central. Representa al empleado. Sus atributos mínimos son:
    - ID
    - Name
*   **MonthlyGoal (Meta Mensual):** Representa el objetivo de ventas asignado a un usuario en un periodo específico (mes). Separar la meta del usuario permite manejar históricos en el futuro sin modificar la entidad del usuario.
*   **Sale (Venta):** Representa cada transacción individual registrada por el promotor (monto, fecha, userId). Es la única fuente de verdad  para calcular el progreso.
*   **Milestone (Hito/Logro):** Representa un reconocimiento desbloqueado (ej. 50%, 80%, 100%). En lugar de calcularlos exclusivamente al vuelo en el frontend, se persistirán en la base de datos una vez alcanzados. Esto evita disparar eventos repetidos.

## 2. Elección del Stack Tecnológico

Para mantener un balance entre velocidad de desarrollo, tipado estricto y cumplimiento de la estructura solicitada (front y back separados), elegí el siguiente stack:

*   **Backend:** Node.js con Express y TypeScript.
    *   *Por qué:* Es ligero, rápido de configurar y permite una separación clara de paths, controladores y servicios sin el boilerplate excesivo de un framework como NestJS.
    *   *Otras opciones consideradas:* NestJS (descartado por ser demasiado pesado para 3 endpoints) y Next.js Route Handlers (descartado para respetar la arquitectura del proyecto solicitada).
*   **Base de Datos:** SQLite gestionado con Prisma ORM.
    *   *Por qué:* Cumple el requisito de ser una base de datos local/en memoria, no requiere que el evaluador instale Docker o un motor de BD externo, y garantiza que el proyecto corra con un par de comandos. Prisma aporta seguridad de tipos desde la BD hasta el cliente.
*   **Frontend:** React (Vite) con TypeScript.
    *   *Por qué:* Vite ofrece un entorno de desarrollo ultrarrápido y respeta la arquitectura de SPA separada del backend.
*   **Sistema de Diseño:** Tailwind CSS + Shadcn UI.
    *   *Por qué:* Shadcn UI porque inyecta el código en el proyecto. Esto me da control absoluto para modificar las variantes, aplicar mis propios *tokens* semánticos (colores, tipografías) y crear componentes *wrapper* de forma nativa y escalable.

## 3. Fuera del Alcance (Out of Scope)

Para asegurar la entrega en el tiempo estimado (8-10 horas) sin comprometer la calidad de los requerimientos esenciales, he decidido dejar fuera:

1.  **Autenticación y Autorización reales:** Configurar flujos de login consumiría tiempo valioso. Asumiré un `userId` en el estado global del frontend o pasado a través de headers para simular la sesión del promotor.
2.  **Filtros de fechas e históricos complejos:** El dashboard se centrará exclusivamente en el progreso del *mes actual*. Consultar meses anteriores queda fuera de esta primera iteración.
3.  **Actualizaciones en tiempo real (WebSockets):** Aunque los WebSockets son ideales para gamificación, el progreso y los logros se actualizarán mediante *refetching* (usando React Query) inmediatamente después de registrar una venta exitosa, manteniendo la complejidad baja pero la experiencia de usuario fluida.
