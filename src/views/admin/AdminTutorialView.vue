<template>
  <div class="admin-tutorial container section-padding">
    <div class="card glass-card tutorial-card">
      <h2>Tutorial del Dashboard Administrativo</h2>
      <p class="description">
        En esta sección encontrarás una guía rápida sobre cómo usar el dashboard para Administradores y Super Administradores.
      </p>

      <section>
        <h3>1. Navegación en el panel izquierdo</h3>
        <p>
          El menú lateral permite acceder a las principales áreas administrativas:
        </p>
        <ul>
          <li><strong>Dashboard:</strong> Resumen general de métricas y actividad reciente.</li>
          <li><strong>Gestión de Solicitudes:</strong> Vista para revisar solicitudes de los usuarios.</li>
          <li><strong>Gestión de Cursos:</strong> Panel para trabajar con los cursos disponibles.</li>
          <li><strong>Gestión de Usuarios:</strong> Solo disponible para Super Administradores, permite administrar cuentas de administradores.</li>
          <li><strong>Lista de Espera:</strong> Área para administrar la lista de usuarios o estudiantes en espera.</li>
          <li><strong>Tutorial:</strong> Enlace directo a esta guía para consultar cómo funciona el dashboard.</li>
          <li><strong>Ir a ver el sitio:</strong> Acceso directo al sitio web como usuario.</li>
        </ul>
      </section>

      <section>
        <h3>2. Roles y accesos</h3>
        <p>
          Existen dos roles administrativos:
        </p>
        <ul>
          <li><strong>Admin:</strong> Accede a las funciones principales del dashboard, solicitudes, cursos y lista de espera.</li>
          <li><strong>Super Admin:</strong> Además de las funciones de Admin, puede ver y gestionar administradores en <strong>Gestión de Usuarios</strong>.</li>
        </ul>
      </section>

      <section>
        <h3>3. Cómo usar el Dashboard</h3>
        <p>
          En la pantalla principal del dashboard se muestra un resumen de datos clave, como métricas y gráficos. Usa esta vista para obtener una visión rápida del estado general. <br>Información de sesión del usuario logueado. <br>Accesos rapidos a la gestión administrativa: Solicitudes, Cursos, Usuarios y Lista de espera.
        </p>
      </section>

      <section>
        <h3>4. Cerrar sesión</h3>
        <p>
          El botón <strong>“Cerrar Sesión”</strong> se encuentra al final del panel izquierdo. Utilízalo cuando termines tu turno para mantener segura la sesión.
        </p>
      </section>

      <router-link to="/admin/dashboard" class="btn-primary back-btn">
        Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-tutorial {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.tutorial-card {
  width: 100%;
  max-width: 900px;
  padding: 2.5rem;
}

h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.description {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

section {
  margin-bottom: 1.75rem;
}

h3 {
  margin-bottom: 0.75rem;
}

ul {
  list-style: disc inside;
  color: var(--text-color);
  margin-left: 0;
}

li {
  margin-bottom: 0.65rem;
}

.back-btn {
  display: inline-block;
  margin-top: 1.5rem;
}
</style>
