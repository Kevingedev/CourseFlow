# Configuración del Proyecto: Course Flow

Este documento resume la configuración realizada hasta el momento y los pasos necesarios para ejecutar el proyecto correctamente.

## 🚀 Requisitos para la Ejecución

Para poner en marcha el entorno de desarrollo, sigue estos pasos:

1.  **Instalación de dependencias:**
    ```bash
    pnpm install
    ```

2.  **Ejecución del entorno de desarrollo:**
    ```bash
    pnpm run dev
    ```
    *Este comando inicia simultáneamente el servidor de desarrollo de Vite y el servidor de Mock API.*

## 🛠 Configuración Realizada

### 1. Servidor de API (Mock Server)
Se ha configurado **JSON Server** para simular el backend del proyecto.
- **Archivo de base de datos:** `api/db.json`
- **Puerto:** `3000`
- **Recursos disponibles:**
  - `http://localhost:3000/users`
  - `http://localhost:3000/courses`
  - `http://localhost:3000/applications`
  - `http://localhost:3000/waiting_list`

### 2. Automatización con Concurrently
Se ha instalado y configurado la librería `concurrently` para facilitar el flujo de trabajo.
- Se han añadido los siguientes scripts en `package.json`:
  - `"vite"`: Ejecuta el servidor frontend.
  - `"server"`: Ejecuta el servidor JSON Server.
  - `"dev"`: Ejecuta ambos comandos al mismo tiempo.

### 3. Documentación de Historias de Usuario
Se han organizado y formateado las historias de usuario en la carpeta `user-stories/`:
- `us-01.md`: Registro de usuarios.
- `us-02.md`: Visualización de cursos.
- `us-03.md`: Solicitud de participación.
- `us-04.md`: Implementación de páginas informativas públicas.
- `us-05.md`: Redirección y acceso basada en roles al panel administrativo.
- `us-06.md`: Estructura del panel administrativo y dashboard de estadísticas.
- `us-07.md`: Gestión de solicitudes, lista de espera y exportación a Excel.
- `us-08.md`: Gestión integral de cursos (CRUD de administración).

### 4. Reglas del Proyecto (Estándares de Código)
Se ha creado el archivo `rules.md` que define los estándares obligatorios:
- Código estrictamente en **Inglés**.
- **Arquitectura Modular:** Organización por capas (views, components, services, stores, composables).
- Uso de **Pinia** para estado global y **Composables** para lógica reutilizable.
- Uso de **variables CSS** para el diseño y paleta de colores.
- Prohibición de **hardcoding** de datos sensibles.
- Aplicación de principios **SOLID** y **DRY**.
- Uso de **TypeScript** para seguridad de tipos.

### 5. Estrategia de Control de Versiones (Git)
Se ha definido una estrategia de ramificación en el archivo `GIT_WORKFLOW.md`:
- Ramas principales: `main` y `develop`.
- Ramas de funcionalidad: `feature/HU-XXX-description`.
- Convención de commits: **Conventional Commits**.

---
**Nota:** Asegúrate de tener instalado `pnpm` globalmente en tu sistema para evitar conflictos con los scripts configurados.
