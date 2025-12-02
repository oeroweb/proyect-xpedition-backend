# 🚀 Xpedition Learn 2025: Backend Básico de Suscripciones

## 1. Objetivo del Proyecto
Diseño e implementación de una API REST para gestionar suscripciones de planes (Usuarios, Planes, Suscripciones y Pagos), aplicando Clean Code, SOLID y persistencia en PostgreSQL.

## 2. Configuración y Ejecución (Setup)

### Requisitos
* Node.js (LTS)
* Docker y Docker Compose (para PostgreSQL)

### Pasos
1.  **Clonar Repositorio:** `git clone ......`
2.  **Instalar Dependencias:** `npm install`
3.  **Configurar DB (Docker Compose):**
    ```bash
    docker-compose up -d
    ```
4.  **Ejecutar Migraciones:** `npx prisma migrate dev --name migratesubscription`
5.  **Poblar Base de Datos (Seed):**
    ```bash
    npm run seed
    ```
6.  **Iniciar Servidor:** `npm start`

## 3. Scripts Principales
| Script | Descripción | Requisito del Caso |
| :--- | :--- | :--- |
| `npm start` | Inicia el servidor de Express. | |
| `npm test` | Ejecuta tests unitarios y de integración (Jest/Supertest). 
| `npm run seed` | Llena la base de datos con datos de prueba (Planes, Usuarios).
| `npm run coverage` | Genera el reporte de cobertura en `/coverage`.

## 4. 🔀 Diagrama Entidad-Relación (ER)
[Aquí deberías incluir una imagen o un diagrama simple de tus modelos: User, Plan, Subscription, Payment.] 

[Image of simple Entity-Relationship Diagram for subscriptions]


## 5. 💡 Decisiones de Diseño y Arquitectura

### 5.1. Arquitectura de Capas y SOLID
Implementamos la arquitectura (`Controller` → `Service` → `Repository` → `Domain`).
* **Controller:** Responsabilidad Única (SRP) en el manejo de HTTP y validación de entrada (usando Joi).
* **Service:** Responsabilidad Única (SRP) en la lógica de negocio, encapsulando las reglas (p. ej., la regla de no duplicidad de suscripciones activas).
* **Repository:** Interface Segregation (ISP) en la interacción con el ORM (Prisma).

### 5.2. Persistencia y Migraciones
* Decisión:** Se eligió **Prisma** como ORM por su tipado estricto y su CLI robusto para manejar migraciones y el *seeding*.

### 5.3. Manejo de Errores
Se implementó un *middleware* centralizado para capturar errores lanzados por el `Service` (ej: `ConflictError` 409) y traducirlos a respuestas HTTP correctas.

---

### 2. 🗄️ Colección REST (Postman/Insomnia/Thunder)

Debes exportar una colección de peticiones que permita al evaluador probar todos los casos de uso principales.

La colección debe incluir las siguientes carpetas/peticiones:

| Carpeta | Petición | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Planes** | `POST` | `/plans` | Crear Plan (CRUD)
| | `GET` | `/plans` | Listar Planes (CRUD) |
| **Usuarios** | `POST` | `/users` | Crear Usuario (Necesario para Subscription) |
| **Suscripciones** | `POST` | `/subscriptions` | **Crear Subscription:** Incluye `userId` y `planId`. Prueba que inicie en `trial` y verifica la regla de no duplicidad. |
| **Pagos** | `POST` | `/payments` | **Registrar Payment:** Simula un pago para una `Subscription` en estado `trial` y verifica que el estado cambie a `active`. |
| **Listados** | `GET` | `/subscriptions?status=active&page=1` | **Listados Paginados + Filtro** por estado. |

---

### 3. 🗺️ Mapa de Pruebas Unitarias

Este entregable es **obligatorio**. Debe ser un documento (`.md` o `.xlsx`) que demuestre la cobertura de las reglas de negocio clave.

| Módulo | Caso | Tipo de Test | Datos de Prueba | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SubscriptionService** | **Regla de Duplicidad** | Unitario | Usuario con suscripción `active` al Plan A. Intenta suscribirse de nuevo al Plan A. | Lanza `ConflictError` (409). | Alta |
| **SubscriptionService** | **Periodo Trial** | Unitario | Usuario sin suscripción activa. Crea suscripción. | La suscripción se crea con `status='trial'` y `endDate` es 7 días después de `startDate`. | Alta |
| **PaymentService** | **Trial $\rightarrow$ Active** | Unitario | Registrar pago para una suscripción con `status='trial'`. | La suscripción cambia su `status` a `active`. | Alta |
| **PlanController** | **Validación (Joi)** | Integración | Petición `POST /plans` sin el campo `cost`. | Retorna `400 Bad Request` (gracias al *middleware* de errores). | Media |

---

### 4. 🎤 Preparación para la Presentación

La presentación tiene una duración de 10-15 minutos.

| Tópico | Enfoque (Nivel Junior) |
| :--- | :--- |
| **Arquitectura** | Explica las 4 capas y cómo aplicaste el principio SRP (Single Responsibility Principle) en cada una. |
| **Decisiones** | Justifica el uso de Prisma y cómo el *middleware* de errores centralizado mejora la DX (Developer Experience). |
| **Demo Rápida** | Muestra el `docker-compose up` y el `npm run seed`. Luego, usa tu Colección REST para mostrar la **creación exitosa de un Plan** y la **prueba de la Regla de Duplicidad** para una `Subscription`. |
| **Aprendizajes** | Menciona cómo la aplicación de SOLID te ayudó a separar la lógica de negocio (Service) de la persistencia (Repository). |

¡Con esto, has cubierto todos los pasos técnicos y de entregables del proyecto! 