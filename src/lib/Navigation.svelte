<script>
  export let currentRoute;
  export let navigate;
  export let handleLogout;

  let routes = [
    { name: 'Inicio', route: 'home' },
    { name: 'Ventas', route: 'ventas' },
    { name: 'Facturación', route: 'facturacion' },
    { name: 'Inventario', route: 'inventario' },
    { name: 'RRHH', route: 'rrhh' },
    { name: 'Finanzas', route: 'finanzas' }
  ];
</script>

<nav>
  {#each routes as { name, route }}
    <button 
      class:active={currentRoute === route} 
      on:click={() => navigate(route)}
    >
      {name}
    </button>
  {/each}
  <button on:click={handleLogout}>Cerrar Sesión</button>
</nav>
  
  <style>
    nav {
      background-color: #f0f0f0;
      padding: 1em;
      display: flex;
      justify-content: center;
      gap: 1em;
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
  
    button:hover {
      background-color: #e0e0e0;
    }
  
    .active {
      background-color: #ff3e00;
      color: white;
    }
  
    .active:hover {
      background-color: #ff5722;
    }
  </style>
  