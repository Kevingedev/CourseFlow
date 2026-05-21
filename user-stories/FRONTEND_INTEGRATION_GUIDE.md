# 🧩 Frontend Integration Guide — CourseFlow Backend

> **Propósito**: Documentar todos los endpoints de la API REST de CourseFlow para que el equipo de frontend pueda consumirlos de manera óptima y profesional.
>
> **Backend Base URL**: `http://localhost:8001`  
> **API v1 Prefix**: `/api/v1`  
> **Admin Prefix**: `/api/admin`  
> **Swagger UI**: `http://localhost:8001/docs`  
> **ReDoc**: `http://localhost:8001/redoc`

---

## 📡 Autenticación

El sistema usa **JWT almacenado en cookie HttpOnly** con nombre `access_token`.

### Flujo de Autenticación

```
Registro → Login (setea cookie HttpOnly) → 
  → Peticiones autenticadas (cookie enviada automáticamente) → 
  → Logout (elimina cookie + blacklist del token)
```

### Configuración de la Cookie JWT

| Propiedad     | Valor            |
|---------------|------------------|
| Nombre        | `access_token`   |
| HttpOnly      | `true`           |
| Secure        | `false` (dev) → `true` (prod con HTTPS) |
| SameSite      | `lax`            |
| MaxAge        | `3600` segundos (1 hora) |

### Payload del JWT

```json
{
  "user_id": 1,
  "role": "user",
  "exp": 1716000000
}
```

### ⚠️ Regla Crítica para el Frontend

Como el token se almacena en una **cookie HttpOnly**, el frontend **no puede acceder a él desde JavaScript** (`document.cookie` no lo contiene).  
Sin embargo, el navegador lo **envía automáticamente** en cada petición al mismo dominio.

**Esto implica:**
- No necesitas manejar headers `Authorization: Bearer ...`
- Las peticiones `fetch` / `axios` deben incluir `credentials: "include"` (o `withCredentials: true` en axios)
- No puedes leer el token para inspeccionar su payload — si necesitas saber el rol, usa `GET /api/v1/users/me`

---

## 🌐 CORS (Cross-Origin Resource Sharing)

Orígenes permitidos por defecto (configurable en `.env`):

```python
BACKEND_CORS_ORIGINS = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:3000",   # Next.js / React dev server
]
```

**En desarrollo**: Si tu frontend corre en un puerto diferente, agrega la URL a `BACKEND_CORS_ORIGINS`.

---

## 🔐 Jerarquía de Roles y Acceso

| Rol          | Nivel | Descripción                              |
|--------------|-------|------------------------------------------|
| `user`       | 1     | Usuario estándar (alumno)                |
| `admin`      | 2     | Administrador de cursos y solicitudes    |
| `superadmin` | 3     | Superadministrador (gestión de admins)   |

- La jerarquía es acumulativa: un `superadmin` (nivel 3) puede acceder a rutas de `admin` (nivel 2).
- Los endpoints protegidos retornan:
  - `401 Unauthorized` — si no hay cookie de autenticación o el token es inválido/expirado/revocado.
  - `403 Forbidden` — si el rol no tiene permisos suficientes.

---

## 📋 Catálogo Completo de Endpoints

---

### 1️⃣ Autenticación — `prefix: /api/v1/auth`

---

#### `POST /api/v1/auth/register`

Registra un nuevo usuario en el sistema.

**Acceso**: 🔓 Público

**Request Body** (`UserCreate`):
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "MiPasswordSegura123",
  "dni_nie": "12345678Z",
  "birth_date": "2000-01-15",
  "role": "user"
}
```

| Campo        | Tipo     | Obligatorio | Default | Descripción                            |
|-------------|----------|-------------|---------|----------------------------------------|
| `name`      | string   | ✅ Sí       | —       | Nombre completo del usuario            |
| `email`     | string   | ✅ Sí       | —       | Email único (validado con `EmailStr`)  |
| `password`  | string   | ✅ Sí       | —       | Contraseña en texto plano              |
| `dni_nie`   | string   | ❌ No       | `null`  | DNI (8 dígitos + letra) o NIE (X/Y/Z + 7 dígitos + letra). Se convierte a mayúsculas automáticamente |
| `birth_date`| string (date) | ❌ No   | `null`  | Fecha de nacimiento (`YYYY-MM-DD`). Debe ser ≥ 18 años |
| `role`      | string   | ❌ No       | `"user"`| Rol del usuario (solo `"user"` permitido para registro público) |

**Response** `201 Created` (`UserRead`):
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "dni_nie": "12345678Z",
  "birth_date": "2000-01-15",
  "role": "user"
}
```

**Errores**:
| Código | Motivo                          |
|--------|---------------------------------|
| 409    | El email ya está registrado     |
| 422    | Validación de campos fallida    |

---

#### `POST /api/v1/auth/login`

Inicia sesión y establece la cookie HttpOnly `access_token`.

**Acceso**: 🔓 Público

**Request Body** (`LoginRequest`):
```json
{
  "email": "juan@example.com",
  "password": "MiPasswordSegura123"
}
```

**Response** `200 OK` — Sin modelo fijo:
```json
{
  "message": "Logged in successfully"
}
```

> La cookie `access_token` se setea automáticamente en la respuesta HTTP.

**Errores**:
| Código | Motivo                           |
|--------|----------------------------------|
| 401    | Credenciales inválidas           |

---

#### `POST /api/v1/auth/logout`

Cierra la sesión: invalida el token actual (blacklist) y elimina la cookie.

**Acceso**: 🔒 Requiere autenticación (cooki)

**Request**: No requiere body. El token se extrae automáticamente de la cookie.

**Response** `200 OK`:
```json
{
  "message": "Logged out successfully"
}
```

---

### 2️⃣ Perfil de Usuario — `prefix: /api/v1/users`

---

#### `GET /api/v1/users/me`

Obtiene el perfil del usuario autenticado.

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Response** `200 OK` (`UserRead`):
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "dni_nie": "12345678Z",
  "birth_date": "2000-01-15",
  "role": "user"
}
```

**Errores**:
| Código | Motivo                        |
|--------|-------------------------------|
| 404    | Usuario no encontrado         |

---

#### `PATCH /api/v1/users/me`

Actualiza el perfil del usuario autenticado.

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Request Body** (`UserUpdate` — todos los campos opcionales):
```json
{
  "name": "Juan Pérez Modificado",
  "email": "nuevoemail@example.com",
  "dni_nie": "87654321X",
  "birth_date": "1999-05-20"
}
```

| Campo        | Tipo     | Obligatorio | Descripción                                     |
|-------------|----------|-------------|-------------------------------------------------|
| `name`      | string   | ❌ No       | Nuevo nombre                                    |
| `email`     | string   | ❌ No       | Nuevo email (valida unicidad)                   |
| `dni_nie`   | string   | ❌ No       | Nuevo DNI/NIE (valida formato)                  |
| `birth_date`| string   | ❌ No       | Nueva fecha de nacimiento (debe ser ≥ 18 años)  |

**Response** `200 OK` (`UserRead`):
```json
{
  "id": 1,
  "name": "Juan Pérez Modificado",
  "email": "nuevoemail@example.com",
  "dni_nie": "87654321X",
  "birth_date": "1999-05-20",
  "role": "user"
}
```

**Errores**:
| Código | Motivo                                 |
|--------|----------------------------------------|
| 400    | Email ya registrado / DNI inválido / menor de edad |
| 404    | Usuario no encontrado                  |

---

### 3️⃣ Cursos — `prefix: /api/v1/courses`

---

#### `POST /api/v1/courses/`

Crea un nuevo curso.

**Acceso**: 🔒 `admin`, `superadmin`

**Request Body** (`CourseCreate`):
```json
{
  "name": "Curso de Docker y Kubernetes",
  "description": "Aprende contenedores desde cero hasta orquestación en producción.",
  "start_date": "2026-06-01",
  "end_date": "2026-07-15",
  "capacity": 25,
  "is_active": true
}
```

| Campo         | Tipo           | Obligatorio | Default | Descripción                                    |
|---------------|----------------|-------------|---------|------------------------------------------------|
| `name`        | string         | ✅ Sí       | —       | Nombre del curso                               |
| `description` | string         | ❌ No       | `null`  | Descripción / temario                          |
| `start_date`  | string (date)  | ✅ Sí       | —       | Fecha de inicio (`YYYY-MM-DD`)                 |
| `end_date`    | string (date)  | ✅ Sí       | —       | Fecha de fin. Debe ser **estrictamente posterior** a `start_date` |
| `capacity`    | integer        | ❌ No       | `null`  | Cupo máximo de alumnos. `0` o `null` = sin límite |
| `is_active`   | boolean        | ❌ No       | `true`  | Visibilidad del curso                          |

**Response** `201 Created` (`CourseRead`):
```json
{
  "id": 1,
  "name": "Curso de Docker y Kubernetes",
  "description": "Aprende contenedores desde cero hasta orquestación en producción.",
  "start_date": "2026-06-01",
  "end_date": "2026-07-15",
  "capacity": 25,
  "is_active": true
}
```

**Errores**:
| Código | Motivo                                    |
|--------|-------------------------------------------|
| 422    | `end_date` debe ser posterior a `start_date` |

---

#### `GET /api/v1/courses/`

Lista los cursos. Los **admins** ven todos (activos e inactivos). Los **usuarios estándar** ven solo los activos.

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Response** `200 OK` — Array de `CourseRead`:
```json
[
  {
    "id": 1,
    "name": "Curso de Docker y Kubernetes",
    "description": "Aprende contenedores desde cero.",
    "start_date": "2026-06-01",
    "end_date": "2026-07-15",
    "capacity": 25,
    "is_active": true
  }
]
```

---

#### `GET /api/v1/courses/{course_id}`

Obtiene el detalle de un curso específico.

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Path Parameter**:

| Parámetro   | Tipo    | Descripción               |
|-------------|---------|---------------------------|
| `course_id` | integer | ID del curso a consultar  |

**Response** `200 OK` (`CourseRead`):
```json
{
  "id": 1,
  "name": "Curso de Docker y Kubernetes",
  "description": "Aprende contenedores desde cero.",
  "start_date": "2026-06-01",
  "end_date": "2026-07-15",
  "capacity": 25,
  "is_active": true
}
```

**Errores**:
| Código | Motivo                                                   |
|--------|----------------------------------------------------------|
| 404    | Curso no encontrado / Curso inactivo para usuario normal |

---

#### `GET /api/v1/courses/{course_id}/applications`

Obtiene todas las solicitudes de inscripción de un curso, con datos del alumno.

**Acceso**: 🔒 `admin`, `superadmin`

**Path Parameter**:

| Parámetro   | Tipo    | Descripción                         |
|-------------|---------|-------------------------------------|
| `course_id` | integer | ID del curso a consultar solicitudes|

**Response** `200 OK` — Array de `ApplicationDetailRead`:
```json
[
  {
    "id": 1,
    "user_id": 2,
    "course_id": 1,
    "has_darde": true,
    "previous_education": "Educación Secundaria Obligatoria",
    "status": "pending",
    "user": {
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
]
```

**Errores**:
| Código | Motivo                        |
|--------|-------------------------------|
| 404    | Curso no encontrado           |

---

#### `PUT /api/v1/courses/{course_id}`

Actualiza los datos de un curso. Parcial: solo se actualizan los campos enviados.

**Acceso**: 🔒 `admin`, `superadmin`

**Path Parameter**:

| Parámetro   | Tipo    | Descripción                  |
|-------------|---------|------------------------------|
| `course_id` | integer | ID del curso a actualizar    |

**Request Body** (`CourseUpdate` — todos opcionales):
```json
{
  "name": "Curso de Docker y Kubernetes Avanzado",
  "description": null,
  "start_date": "2026-07-01",
  "end_date": "2026-08-15",
  "capacity": 30,
  "is_active": true
}
```

**Response** `200 OK` (`CourseRead`):
```json
{
  "id": 1,
  "name": "Curso de Docker y Kubernetes Avanzado",
  "description": null,
  "start_date": "2026-07-01",
  "end_date": "2026-08-15",
  "capacity": 30,
  "is_active": true
}
```

**Errores**:
| Código | Motivo                                    |
|--------|-------------------------------------------|
| 404    | Curso no encontrado                       |
| 422    | `end_date` debe ser posterior a `start_date` |

---

#### `DELETE /api/v1/courses/{course_id}`

Realiza una **baja lógica** del curso (marca `is_active = False`). No lo elimina físicamente.

**Acceso**: 🔒 `admin`, `superadmin`

**Path Parameter**:

| Parámetro   | Tipo    | Descripción               |
|-------------|---------|---------------------------|
| `course_id` | integer | ID del curso a desactivar |

**Response** `204 No Content` — sin cuerpo.

**Errores**:
| Código | Motivo                        |
|--------|-------------------------------|
| 404    | Curso no encontrado           |

---

### 4️⃣ Solicitudes de Inscripción — `prefix: /api/v1/applications`

---

#### `POST /api/v1/applications/`

Crea una solicitud de inscripción a un curso.

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Request Body** (`ApplicationCreate`):
```json
{
  "course_id": 1,
  "has_darde": true,
  "previous_education": "Educación Secundaria Obligatoria"
}
```

| Campo                | Tipo    | Obligatorio | Descripción                                         |
|----------------------|---------|-------------|-----------------------------------------------------|
| `course_id`          | integer | ✅ Sí       | ID del curso al que se postula                      |
| `has_darde`          | boolean | ✅ Sí       | Indica si posee documento DARDE (desempleo)         |
| `previous_education` | string  | ❌ No       | Resumen de estudios previos (máx. 250 caracteres)   |

**Validaciones automáticas que realiza el backend**:
1. El usuario debe tener `dni_nie` registrado y con formato válido
2. El usuario debe ser mayor de 18 años (`birth_date` registrado)
3. El curso debe existir y estar activo
4. El período de inscripción debe estar abierto (`hoy < start_date` del curso)
5. No debe existir una solicitud duplicada del mismo usuario al mismo curso
6. El curso no debe haber alcanzado su capacidad máxima

**Response** `201 Created` (`ApplicationRead`):
```json
{
  "id": 1,
  "user_id": 1,
  "course_id": 1,
  "has_darde": true,
  "previous_education": "Educación Secundaria Obligatoria",
  "status": "pending"
}
```

**Errores**:
| Código | Motivo                                                    |
|--------|-----------------------------------------------------------|
| 400    | Usuario sin DNI/NIE / DNI inválido / sin fecha nacimiento / menor de edad / curso no disponible / período cerrado / curso lleno |
| 404    | Usuario no encontrado                                     |
| 409    | Ya existe una solicitud para este curso                   |

---

#### `GET /api/v1/applications/me`

Lista las solicitudes de inscripción del usuario autenticado.

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Response** `200 OK` — Array de `ApplicationRead`:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "course_id": 1,
    "has_darde": true,
    "previous_education": "Educación Secundaria Obligatoria",
    "status": "pending"
  }
]
```

---

#### `PATCH /api/v1/applications/{app_id}/status`

Actualiza el estado de una solicitud. Acepta o rechaza una postulación.

**Acceso**: 🔒 `admin`, `superadmin`

**Path Parameter**:

| Parámetro | Tipo    | Descripción                    |
|-----------|---------|--------------------------------|
| `app_id`  | integer | ID de la solicitud a modificar |

**Request Body** (`ApplicationStatusUpdate`):
```json
{
  "status": "accepted"
}
```

| Campo    | Tipo   | Obligatorio | Valores permitidos                                           |
|----------|--------|-------------|--------------------------------------------------------------|
| `status` | string | ✅ Sí       | `"pending"`, `"accepted"`, `"rejected"`, `"cancelled"`       |

**Response** `200 OK` (`ApplicationRead`):
```json
{
  "id": 1,
  "user_id": 1,
  "course_id": 1,
  "has_darde": true,
  "previous_education": "Educación Secundaria Obligatoria",
  "status": "accepted"
}
```

**Errores**:
| Código | Motivo                             |
|--------|------------------------------------|
| 404    | Solicitud no encontrada            |

---

#### `DELETE /api/v1/applications/{app_id}`

Comportamiento dual según el rol:

| Rol del usuario                    | Acción                                              | HTTP Status |
|------------------------------------|-----------------------------------------------------|-------------|
| `admin` / `superadmin`             | **Eliminación física** del registro en BD           | `204`       |
| `user` (propietario de la solicitud) | **Cancelación lógica** (`status = "cancelled"`)   | `200`       |
| `user` (no propietario)            | Error de permisos                                   | `403`       |

**Acceso**: 🔒 `user`, `admin`, `superadmin`

**Path Parameter**:

| Parámetro | Tipo    | Descripción                        |
|-----------|---------|------------------------------------|
| `app_id`  | integer | ID de la solicitud a eliminar/cancelar |

**Response**:
- Admin: `204 No Content`
- Usuario propietario: `200 OK` (`ApplicationRead` con `status: "cancelled"`)
  ```json
  {
    "id": 1,
    "user_id": 1,
    "course_id": 1,
    "has_darde": true,
    "previous_education": "Educación Secundaria Obligatoria",
    "status": "cancelled"
  }
  ```

**Errores**:
| Código | Motivo                               |
|--------|--------------------------------------|
| 403    | No eres el propietario ni admin      |
| 404    | Solicitud no encontrada              |

---

### 5️⃣ Administración de Admins — `prefix: /api/admin/users`

> **IMPORTANTE**: Estas rutas usan el prefijo `/api/admin`, **no** `/api/v1`.

---

#### `POST /api/admin/users`

Crea un nuevo usuario con rol `admin`.

**Acceso**: 🔒 `superadmin` (único)

**Request Body** (`AdminCreate`):
```json
{
  "name": "Admin Nuevo",
  "email": "admin@example.com",
  "password": "ContraseñaSegura"
}
```

**Response** `201 Created` (`UserRead`):
```json
{
  "id": 2,
  "name": "Admin Nuevo",
  "email": "admin@example.com",
  "dni_nie": null,
  "birth_date": null,
  "role": "admin"
}
```

**Errores**:
| Código | Motivo                           |
|--------|----------------------------------|
| 400    | Email ya registrado              |

---

#### `GET /api/admin/users`

Lista todos los administradores registrados (excluye superadmins y usuarios normales).

**Acceso**: 🔒 `superadmin`

**Response** `200 OK` — Array de `UserRead`:
```json
[
  {
    "id": 2,
    "name": "Admin Nuevo",
    "email": "admin@example.com",
    "dni_nie": null,
    "birth_date": null,
    "role": "admin"
  }
]
```

---

#### `PATCH /api/admin/users/{user_id}`

Modifica los datos de un administrador.

**Acceso**: 🔒 `superadmin`

**Path Parameter**:

| Parámetro | Tipo    | Descripción                       |
|-----------|---------|-----------------------------------|
| `user_id` | integer | ID del administrador a modificar  |

**Request Body** (`AdminUpdate`):
```json
{
  "name": "Admin Modificado",
  "email": "nuevoemail@example.com"
}
```

**Response** `200 OK` (`UserRead`):
```json
{
  "id": 2,
  "name": "Admin Modificado",
  "email": "nuevoemail@example.com",
  "dni_nie": null,
  "birth_date": null,
  "role": "admin"
}
```

**Errores**:
| Código | Motivo                                |
|--------|---------------------------------------|
| 400    | Email ya registrado por otro usuario  |
| 404    | Admin no encontrado                   |

---

#### `DELETE /api/admin/users/{user_id}`

Elimina físicamente a un administrador del sistema.

**Acceso**: 🔒 `superadmin`

**Path Parameter**:

| Parámetro | Tipo    | Descripción                          |
|-----------|---------|--------------------------------------|
| `user_id` | integer | ID del administrador a eliminar      |

**Response** `204 No Content` — sin cuerpo.

**Errores**:
| Código | Motivo                                              |
|--------|-----------------------------------------------------|
| 400    | El superadmin no puede eliminarse a sí mismo        |
| 404    | Admin no encontrado                                 |

---

### 6️⃣ Lista de Espera — `prefix: /api/v1/waiting-list`

---

#### `POST /api/v1/waiting-list/`

Añade un usuario a la lista de espera de un curso. La posición se calcula automáticamente (último lugar).

**Acceso**: ⚠️ Sin autenticación en la implementación actual (requiere `user_id` como query param)

**Query Parameters**:

| Parámetro  | Tipo    | Obligatorio | Descripción                        |
|------------|---------|-------------|------------------------------------|
| `user_id`  | integer | ✅ Sí       | ID del usuario a añadir a la espera |
| `course_id`| integer | ✅ Sí       | ID del curso                       |

**Request URL Example**: `/api/v1/waiting-list/?user_id=1&course_id=1`

**Response** `201 Created` — Objeto `WaitingList`:
```json
{
  "id": 1,
  "user_id": 1,
  "course_id": 1,
  "position": 1,
  "created_at": "2026-05-20T10:30:00+00:00"
}
```

> **⚠️ Nota para frontend**: Este endpoint actualmente recibe `user_id` como query parameter y no tiene protección de autenticación. En una versión futura, debería extraer el `user_id` del token JWT autenticado como el resto de endpoints.

---

#### `GET /api/v1/waiting-list/{course_id}`

Obtiene la lista de espera de un curso específico, ordenada por posición ascendente.

**Acceso**: ⚠️ Sin autenticación en la implementación actual

**Path Parameter**:

| Parámetro   | Tipo    | Descripción                                  |
|-------------|---------|----------------------------------------------|
| `course_id` | integer | ID del curso del que consultar la lista de espera |

**Response** `200 OK` — Array de `WaitingList`:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "course_id": 1,
    "position": 1,
    "created_at": "2026-05-20T10:30:00+00:00"
  },
  {
    "id": 2,
    "user_id": 3,
    "course_id": 1,
    "position": 2,
    "created_at": "2026-05-20T11:00:00+00:00"
  }
]
```

> **⚠️ Nota para frontend**: Ídem al anterior — no hay protección de autenticación. Considerar agregar `require_auth` si se necesita restringir el acceso.

---

## 🧠 Mapa de Estados de Solicitud

```
                         ┌──────────┐
                         │ PENDING  │
                         └────┬─────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ ACCEPTED │   │ REJECTED │   │CANCELLED │
        └──────────┘   └──────────┘   └──────────┘
```

| Estado      | Descripción                        | Quién lo puede asignar |
|-------------|-----------------------------------|------------------------|
| `pending`   | Pendiente de revisión (por defecto)| Sistema (al crear)     |
| `accepted`  | Aceptada                          | Admin / Superadmin     |
| `rejected`  | Rechazada                         | Admin / Superadmin     |
| `cancelled` | Cancelada por el usuario          | Usuario (DELETE)       |

---

## 🧪 Configuración de `fetch` / `axios`

### fetch — with credentials

```javascript
const API_BASE = "http://localhost:8001/api/v1";

// Login
const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",      // ← Envía y recibe cookies
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// Petición autenticada
const getProfile = async () => {
  const res = await fetch(`${API_BASE}/users/me`, {
    credentials: "include",      // ← Cookie enviada automáticamente
  });
  return res.json();
};
```

### axios — withCredentials

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api/v1",
  withCredentials: true,          // ← Habilita cookies cross-origin
  headers: { "Content-Type": "application/json" },
});

// Login
const login = (email, password) =>
  api.post("/auth/login", { email, password });

// Perfil
const getProfile = () => api.get("/users/me");

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido/expirado → redirigir a login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## 📐 Diagrama de Rutas y Responsabilidades

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND APP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔓 Público            🔒 user             🔒 admin           │
│  ┌──────────┐    ┌─────────────────┐    ┌──────────────────┐   │
│  │ Register │    │ GET  /users/me  │    │ POST /courses    │   │
│  │ Login    │    │ PATCH /users/me │    │ PUT  /courses:id │   │
│  └──────────┘    │ POST /applic.   │    │ DEL  /courses:id │   │
│                  │ GET  /applic/me │    │ GET  /courses:id │   │
│                  │ GET  /courses   │    │   /applications  │   │
│                  │ GET  /courses:id│    │ PATCH /applic:id │   │
│                  └─────────────────┘    │   /status        │   │
│                                         │ DEL  /applic:id  │   │
│                        🔒 superadmin   └──────────────────┘   │
│                        ┌──────────────────────────┐            │
│                        │ CRUD /api/admin/users    │            │
│                        └──────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Integración Frontend

- [ ] Configurar `credentials: "include"` / `withCredentials: true` en todas las peticiones
- [ ] Manejar `401 Unauthorized` → redirigir a login
- [ ] Manejar `403 Forbidden` → ocultar funcionalidades según rol
- [ ] Almacenar el rol del usuario tras login (vía `GET /users/me`) para UI condicional
- [ ] Refrescar token: el backend no implementa refresh token —redirigir a login al expirar
- [ ] Validar formate de DNI/NIE en frontend (8 dígitos + letra, o X/Y/Z + 7 dígitos + letra)
- [ ] Validar mayoría de edad (≥ 18 años) en formularios de registro
- [ ] No permitir fechas inválidas en cursos (`end_date > start_date`)
- [ ] Mostrar estado de las solicitudes con colores semánticos (pending=⚠️, accepted=✅, rejected=❌, cancelled=🗑️)
- [ ] Diferenciar UI para roles: `user` / `admin` / `superadmin`

---

## 🔧 Variables de Entorno para el Frontend

```env
# .env del frontend
VITE_API_URL=http://localhost:8001/api/v1
VITE_ADMIN_API_URL=http://localhost:8001/api/admin
```

---

## 📚 Referencia Rápida de Status Codes Utilizados

| Código | Significado                      | Uso común                                |
|--------|----------------------------------|------------------------------------------|
| 200    | OK                               | Respuestas exitosas GET, PATCH, PUT      |
| 201    | Created                          | Creación exitosa POST                    |
| 204    | No Content                       | DELETE exitoso (sin body)                |
| 400    | Bad Request                      | Validación de negocio fallida            |
| 401    | Unauthorized                     | Token faltante, inválido o expirado      |
| 403    | Forbidden                        | Rol sin permisos suficientes             |
| 404    | Not Found                        | Recurso no encontrado                    |
| 409    | Conflict                         | Duplicado (email, aplicación)            |
| 422    | Unprocessable Entity             | Validación de datos de entrada           |

---

## 🏁 Resumen de Endpoints

| Método | Ruta                                            | Rol Mínimo     | Descripción                              |
|--------|-------------------------------------------------|----------------|------------------------------------------|
| POST   | `/api/v1/auth/register`                         | 🔓 Público     | Registro de usuario                      |
| POST   | `/api/v1/auth/login`                            | 🔓 Público     | Login (setea cookie HttpOnly)            |
| POST   | `/api/v1/auth/logout`                           | 🔒 user        | Logout (blacklist + delete cookie)       |
| GET    | `/api/v1/users/me`                              | 🔒 user        | Perfil del usuario autenticado           |
| PATCH  | `/api/v1/users/me`                              | 🔒 user        | Actualizar perfil propio                 |
| POST   | `/api/v1/courses/`                              | 🔒 admin       | Crear curso                              |
| GET    | `/api/v1/courses/`                              | 🔒 user        | Listar cursos                            |
| GET    | `/api/v1/courses/{course_id}`                   | 🔒 user        | Detalle de curso                         |
| GET    | `/api/v1/courses/{course_id}/applications`      | 🔒 admin       | Solicitudes de un curso (con alumno)     |
| PUT    | `/api/v1/courses/{course_id}`                   | 🔒 admin       | Actualizar curso                         |
| DELETE | `/api/v1/courses/{course_id}`                   | 🔒 admin       | Baja lógica de curso                     |
| POST   | `/api/v1/applications/`                         | 🔒 user        | Crear solicitud de inscripción           |
| GET    | `/api/v1/applications/me`                       | 🔒 user        | Mis solicitudes                          |
| PATCH  | `/api/v1/applications/{app_id}/status`          | 🔒 admin       | Aceptar/rechazar solicitud               |
| DELETE | `/api/v1/applications/{app_id}`                 | 🔒 dual        | Cancelar (user) o eliminar (admin)       |
| POST   | `/api/admin/users`                              | 🔒 superadmin  | Crear administrador                      |
| GET    | `/api/admin/users`                              | 🔒 superadmin  | Listar administradores                   |
| PATCH  | `/api/admin/users/{user_id}`                    | 🔒 superadmin  | Modificar administrador                  |
| DELETE | `/api/admin/users/{user_id}`                    | 🔒 superadmin  | Eliminar administrador                   |
| POST   | `/api/v1/waiting-list/`                         | ⚠️ Sin auth    | Añadir a lista de espera                 |
| GET    | `/api/v1/waiting-list/{course_id}`              | ⚠️ Sin auth    | Ver lista de espera de un curso          |
