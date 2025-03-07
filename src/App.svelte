<script>
  import Navigation from './lib/Navigation.svelte';
  import { onMount } from 'svelte';
  import Ventas from './routes/Ventas.svelte';
  import Facturacion from './routes/Facturacion.svelte';
  import Inventario from './routes/Inventario.svelte';
  import RRHH from './routes/RRHH.svelte';
  import Finanzas from './routes/Finanzas.svelte';
  import Graficos from '../src/routes/Graficos.svelte';
  import Login from './components/Login.svelte';

  let currentRoute = 'home';
  let isAuthenticated = true;

  let modules = [
    { name: 'Ventas', icon: '💼', route: 'ventas' },
    { name: 'Facturación', icon: '📄', route: 'facturacion' },
    { name: 'Inventario', icon: '📦', route: 'inventario' },
    { name: 'RRHH', icon: '👥', route: 'rrhh' },
    { name: 'Finanzas', icon: '💰', route: 'finanzas' },
    { name: 'Gráficos', icon: '📊', route: 'graficos' }
  ];

  function navigate(route) {
    currentRoute = route;
  }

  onMount(() => {
    console.log('App cargada');
  });
</script>

<Navigation {currentRoute} {navigate} />

<main>
  <h1>Launcher Empresarial</h1>

  {#if currentRoute === 'home'}
    <div class="module-grid">
      {#each modules as module, index}
        <button class="module-icon" on:click={() => navigate(module.route)}>
          <span class="icon">{module.icon}</span>
          <span class="name">{module.name}</span>
        </button>
      {/each}
    </div>
  {:else if currentRoute === 'ventas'}
    <Ventas />
  {:else if currentRoute === 'facturacion'}
    <Facturacion />
  {:else if currentRoute === 'inventario'}
    <Inventario />
  {:else if currentRoute === 'rrhh'}
    <RRHH />
  {:else if currentRoute === 'finanzas'}
    <Finanzas />
  {:else if currentRoute === 'graficos'}
    <Graficos moduleName="Ventas"/>
  {/if}
</main>

<style>

  main {
    text-align: center;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
    flex: 1; 
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    margin-bottom: 2rem;
  }

  .module-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }

  .module-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1rem;
    border: none;
    box-shadow: rgba(0,0,0,0.1) 0px 2px 4px;
    color: inherit;
    font-size: inherit;
  }

  .module-icon:hover {
    transform: scale(1.05);
    box-shadow: rgba(0,0,0,0.15) 0px 4px 8px;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: .5rem;
    transition: transform 0.3s ease;
  }

  .module-icon:hover .icon {
    transform: scale(1.2);
  }

  .name {
    font-size: .9rem;
    text-transform: capitalize;
  }

</style>
