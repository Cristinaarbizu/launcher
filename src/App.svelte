<script>
  import Navigation from "./lib/Navigation.svelte";
  import { onMount } from "svelte";
  import Ventas from "./routes/Ventas.svelte";
  import Facturacion from "./routes/Facturacion.svelte";
  import Inventario from "./routes/Inventario.svelte";
  import RRHH from "./routes/RRHH.svelte";
  import Finanzas from "./routes/Finanzas.svelte";
  import Graficos from "../src/routes/Graficos.svelte";
  import Login from "./components/Login.svelte";
  import { theme } from "./stores/theme";
  import DarkModeToggle from "./components/DarkModeToggle.svelte";

  let currentRoute = "home";
  let isAuthenticated = false;
  let userRol = ""; // 'user' o 'admin'
  let username = "";

  let allModules = [
    { name: "Ventas", icon: "💼", route: "ventas" },
    { name: "Facturación", icon: "📄", route: "facturacion" },
    { name: "Inventario", icon: "📦", route: "inventario" },
    { name: "RRHH", icon: "👥", route: "rrhh", roles: ["admin"] },
    { name: "Finanzas", icon: "💰", route: "finanzas", roles: ["admin"] },
    { name: "Gráficos", icon: "📊", route: "graficos", roles: ["admin"] },
  ];

  let modules = [];

  function navigate(route) {
    currentRoute = route;
  }

  function handleLogout() {
    isAuthenticated = false;
    userRol = "";
    username = "";
    currentRoute = "home";
    theme.set("light"); // Establecer el tema a "light" (modo día) al cerrar sesión
  }

  function handleLogin(event) {
    isAuthenticated = true;
    userRol = event.detail.rol; // Se asume que el evento de login envía un objeto { rol: "user" o "admin" }
    username = event.detail.username; // Asignar el username del evento de login
    updateModules();
    currentRoute = "home";
  }

  function updateModules() {
    modules = allModules.filter(module => !module.roles || module.roles.includes(userRol));
  }

  onMount(() => {
    console.log("App cargada");
    theme.subscribe((value) => {
      document.body.className = value;
    });
  });
</script>

<div class={$theme}>
  {#if isAuthenticated}
    <Navigation {currentRoute} {navigate} {handleLogout} {userRol} {username} />

    <main>
      <DarkModeToggle />

      <h1>Launcher Empresarial</h1>

      {#if currentRoute === "home"}
        <div class="module-grid">
          {#each modules as module}
            <button class="module-icon" on:click={() => navigate(module.route)}>
              <span class="icon">{module.icon}</span>
              <span class="name">{module.name}</span>
            </button>
          {/each}
        </div>
      {:else if currentRoute === "ventas"}
        <Ventas />
      {:else if currentRoute === "facturacion"}
        <Facturacion />
      {:else if currentRoute === "inventario"}
        <Inventario />
      {:else if currentRoute === "rrhh" && userRol === "admin"}
        <RRHH />
      {:else if currentRoute === "finanzas" && userRol === "admin"}
        <Finanzas />
      {:else if currentRoute === "graficos" && userRol === "admin"}
        <Graficos moduleName="Ventas" />
      {/if}
    </main>
  {:else}
    <Login on:login={handleLogin} />
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  .light {
    background-color: #ffffff;
    color: #333333;
  }

  .dark {
    background-color: #333333;
    color: #ffffff;
  }

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
    border-radius: 8px;
    padding: 1rem;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
    font-size: inherit;
  }

  .light .module-icon {
    background-color: #f9f9f9;
    color: #333333;
  }

  .dark .module-icon {
    background-color: #4a4a4a;
    color: #ffffff;
  }

  .module-icon:hover {
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 8px;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    transition: transform 0.3s ease;
  }

  .module-icon:hover .icon {
    transform: scale(1.2);
  }

  .name {
    font-size: 0.9rem;
    text-transform: capitalize;
  }
</style>
