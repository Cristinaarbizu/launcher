<script>
  import { theme } from "../stores/theme";
  export let currentRoute;
  export let navigate;
  export let handleLogout;

  let routes = [
    { name: 'Inicio', route: 'home' },
    { name: 'Ventas', route: 'ventas' },
    { name: 'Facturación', route: 'facturacion' },
    { name: 'Inventario', route: 'inventario' },
    { name: 'RRHH', route: 'rrhh' },
    { name: 'Finanzas', route: 'finanzas' },
    { name: 'Gráficos', route: 'graficos' }
  ];
</script>

<nav class={$theme}>
  <div class="nav-buttons">
    {#each routes as { name, route }}
      <button
        class:active={currentRoute === route}
        on:click={() => navigate(route)}
      >
        {name}
      </button>
    {/each}
  </div>
  <button on:click={handleLogout} class="logout-button">Cerrar Sesión</button>
</nav>
  
<style>
  nav {
    padding: 1em;
    display: flex;
    justify-content: center;
    gap: 1em;
  }

  nav.light {
    background-color: #f0f0f0;
    color: #333333;
  }

  nav.dark {
    background-color: #2a2a2a;
    color: #ffffff;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em;
    padding: 0.5em 1em;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .light button:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }

  .dark button:hover {
    background-color: #3a3a3a;
    transform: scale(1.05);
  }

  .active {
    background-color: #1a13e7;
    color: white;
  }

  .active:hover {
    background-color: #ff5722;
  }

  .logout-button {
    background-color: #ff3e00;
    color: white;
  }
</style>
