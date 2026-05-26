# CourseFlow Frontend

Frontend administrativo y público de `CourseFlow`, construido con Vue 3, Vite, TypeScript, Pinia y Vue Router. La aplicación consume una API REST con autenticación basada en cookie HttpOnly y organiza la experiencia en dos zonas claras:

- Sitio público: inicio, catálogo, detalle de curso, contacto, login y registro.
- Panel administrativo: dashboard, gestión de cursos, solicitudes y administradores.

## Stack

- Vue 3 con Composition API y `<script setup lang="ts">`
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios
- Chart.js
- Lucide Vue

## Estructura principal

- `src/views/`: vistas de página.
- `src/components/`: componentes reutilizables y específicos de cada módulo.
- `src/composables/`: lógica de estado y efectos por dominio.
- `src/services/`: cliente de acceso a API y servicios por recurso.
- `src/stores/`: estado global compartido.
- `src/types/`: contratos de datos del frontend.

## Cómo se integra con el backend

La integración se centraliza en `src/services/api.ts`.

- Usa `axios.create(...)` con `withCredentials: true`.
- Envía `Accept: application/json`.
- Trata la sesión por cookie HttpOnly, no por `Authorization: Bearer`.
- Intercepta `401 Unauthorized`, limpia la sesión y emite el evento `auth:expired`.

El resto de servicios usa ese cliente base:

- `src/services/authService.ts`
- `src/services/coursesService.ts`
- `src/services/adminUsersService.ts`
- `src/services/applicationsService.ts`
- `src/services/dashboardService.ts`

El guard de rutas en `src/router/index.ts` protege las rutas administrativas y valida roles:

- `user`
- `admin`
- `suadmin`

## Endpoints consumidos

### Autenticación

| Método | Endpoint | Uso |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Registro público de usuario. |
| `POST` | `/api/v1/auth/login` | Inicio de sesión y emisión de cookie HttpOnly. |
| `POST` | `/api/v1/auth/logout` | Cierre de sesión. |
| `GET` | `/api/v1/users/me` | Perfil del usuario autenticado. |

### Cursos

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/api/v1/courses/` | Listado público y administrativo de cursos. |
| `GET` | `/api/v1/courses/{id}` | Detalle de un curso. |
| `POST` | `/api/v1/courses/` | Creación de curso desde admin. |
| `PUT` | `/api/v1/courses/{id}` | Edición de curso desde admin. |
| `DELETE` | `/api/v1/courses/{id}` | Baja/desactivación de curso desde admin. |

### Administradores

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/api/admin/users` | Listado de administradores. |
| `POST` | `/api/admin/users` | Alta de administrador. |
| `PATCH` | `/api/admin/users/{userId}` | Actualización de datos o estado. |
| `DELETE` | `/api/admin/users/{userId}` | Eliminación de administrador. |

### Solicitudes

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/api/v1/applications/` | Obtención de solicitudes administrativas para el panel. |
| `PATCH` | `/api/v1/applications/{app_id}/status` | Cambio de estado de una solicitud. |
| `DELETE` | `/api/v1/applications/{app_id}` | Eliminación de una solicitud. |

### Dashboard

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/api/v1/courses/` | Base del dashboard para métricas de cursos. |
| `GET` | `/api/v1/courses/{courseId}/applications` | Métricas de solicitudes por curso. |
| `GET` | `/api/v1/waiting-list/{courseId}` | Métricas de lista de espera. |
| `GET` | `/api/admin/users` | Métrica de administradores. |

### Integración pública heredada

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/courses/{id}` | Carga del detalle público del curso en `CourseDetail.vue`. |
| `GET` | `/applications?user_id={id}&course_id={id}` | Verificación de inscripción previa del usuario. |
| `GET` | `/applications?course_id={id}&status=aceptado` | Cálculo de plazas aceptadas en el detalle público. |
| `GET` | `/applications?course_id={id}` | Cálculo del total de solicitudes en el detalle público. |
| `POST` | `/applications` | Registro público de una nueva solicitud. |

## Cómo se gestiona cada módulo

### Público

- `HomeView`, `AboutView`, `CoursesView`, `CourseDetail.vue`, `ContactView`, `LoginView` y `RegisterView` componen el recorrido público.
- El navbar público vive en `src/components/AppNavbar.vue`.
- Las páginas públicas consumen el API para mostrar contenido, listar cursos, registrar usuarios y permitir login.

### Autenticación

- `LoginForm.vue` valida correo y contraseña obligatorios.
- `RegisterForm.vue` valida:
  - nombre completo obligatorio
  - correo con formato válido
  - contraseña mínima de 8 caracteres
  - confirmación de contraseña
  - DNI/NIE válido cuando existe
  - mayoría de edad mínima de 18 años
- Después del login, el frontend consulta `GET /api/v1/users/me` para obtener el perfil real.

### Catálogo y cursos

- `CoursesView.vue` carga el listado de cursos desde `GET /api/v1/courses/`.
- `CourseDetail.vue` muestra el detalle del curso y el formulario de inscripción.
- El panel administrativo de cursos usa:
  - `useCourses()`
  - `CoursesManager.vue`
  - `CoursesTable.vue`
  - `CourseFormCard.vue`
  - `CourseFormModal.vue`

### Solicitudes

- `ApplicationsManager.vue` orquesta la gestión administrativa.
- `ApplicationsTable.vue` lista solicitudes, muestra el estado en formato etiqueta y permite:
  - cambiar estado
  - eliminar solicitud
- La tabla muestra logs técnicos de las operaciones de solicitudes en consola a través del servicio.
- El panel no incluye creación ni edición manual de campos de solicitud, porque el backend expone solo cambio de estado y borrado para administración.

### Administradores

- `AdminUsersManager.vue` coordina alta, edición, activación/desactivación y eliminación.
- La lógica de formularios y listado vive separada para mantener el panel modular.

### Dashboard

- El dashboard usa Pinia (`src/stores/dashboard.ts`) para consolidar métricas.
- Se calculan series para gráficos y conteos de solicitudes, cursos y lista de espera.

## Validaciones implementadas

### Registro

- `fullName` obligatorio.
- `email` con formato válido.
- `password` mínimo de 8 caracteres.
- `confirmPassword` debe coincidir con `password`.
- `dniNie` opcional, pero si existe debe respetar el patrón de DNI/NIE.
- `birthDate` opcional, pero si existe debe garantizar 18 años o más.

### Login

- `email` obligatorio.
- `password` obligatorio.

### Inscripción a curso

En `CourseDetail.vue` el formulario público valida:

- aceptación de términos
- formato de DNI/NIE
- edad mínima de 18 años
- selección explícita de DARDE
- límite de 250 caracteres para la formación previa

### Cursos admin

- nombre, fecha de inicio y fecha de fin obligatorios
- la fecha fin debe ser posterior a la de inicio
- la capacidad acepta `null` o `0` como sin límite

### Solicitudes admin

- el único campo editable administrativamente es `status`
- la gestión se limita a cambio de estado y eliminación
- no se expone creación/edición completa desde el panel porque no existe ese contrato en el backend

## Cambio de idioma en páginas públicas

El sitio público está organizado por vistas y componentes de presentación, así que el copy visible está concentrado en:

- `src/components/AppNavbar.vue`
- `src/components/home/HomeHero.vue`
- `src/views/HomeView.vue`
- `src/views/AboutView.vue`
- `src/views/CoursesView.vue`
- `src/views/ContactView.vue`
- `src/views/LoginView.vue`
- `src/views/RegisterView.vue`

Esta separación hace que el cambio de idioma sea local al frontend público y no afecte servicios, autenticación ni panel administrativo. En esta versión no hay una librería formal como `vue-i18n`; la estrategia actual es mantener el contenido visible aislado por vistas para poder traducirlo o sustituirlo sin tocar la lógica de negocio. Si se quiere llevar a una solución de i18n completa, el punto de entrada natural es el navbar público y las vistas públicas, dejando el área `/admin` fuera de esa capa.

## Tutorial de uso

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar el backend

Define la URL del backend con `VITE_API_URL` si no quieres usar la configuración por defecto del proyecto.

Ejemplo:

```bash
VITE_API_URL=http://localhost:8002
```

### 3. Levantar backend y frontend

1. Inicia el backend REST.
2. Levanta el frontend:

```bash
pnpm dev
```

### 4. Flujos de uso

#### Usuario público

1. Entra en la home.
2. Revisa el catálogo de cursos.
3. Abre un curso.
4. Completa el formulario de inscripción.
5. Inicia sesión o regístrate si todavía no estás autenticado.

#### Usuario administrativo

1. Inicia sesión con un rol `admin` o `suadmin`.
2. Entra en `/admin`.
3. Revisa el dashboard.
4. Gestiona cursos, solicitudes o administradores según el rol.

#### Solicitudes

1. Abre `Gestión de Solicitudes`.
2. Filtra por texto o estado.
3. Cambia el estado con la acción correspondiente.
4. Elimina la solicitud si procede.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test:unit
pnpm test:e2e:dev
```

## Notas técnicas

- El frontend usa cookie HttpOnly para la sesión, por eso no necesita leer ni guardar el token en `localStorage`.
- El panel administrativo está dividido en composables, servicios y componentes para mantener la lógica del CRUD aislada.
- Las tablas y formularios usan validaciones locales antes de enviar datos al backend.
- Si el backend responde `401`, el cliente limpia la sesión y el usuario vuelve al flujo de login.
- Hay una integración pública heredada en `CourseDetail.vue` que sigue llamando a `/courses` y `/applications` de forma directa; el resto del frontend ya trabaja bajo `/api/v1` y servicios centralizados.
