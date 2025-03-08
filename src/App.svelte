<script>
  // Importaciones necesarias
  import { onMount, afterUpdate } from "svelte";
  import Navigation from "./lib/Navigation.svelte";
  import Ventas from "./routes/Ventas.svelte";
  import Facturacion from "./routes/Facturacion.svelte";
  import Inventario from "./routes/Inventario.svelte";
  import RRHH from "./routes/RRHH.svelte";
  import Finanzas from "./routes/Finanzas.svelte";
  import Graficos from "../src/routes/Graficos.svelte";
  import Login from "./components/Login.svelte";
  import { theme } from "./stores/theme";
  import DarkModeToggle from "./components/DarkModeToggle.svelte";

  // Variables de estado
  let currentRoute = "home";
  let isAuthenticated = false;
  let userRol = "";
  let username = "";
  let isDragging = false;

  // Definición de todos los módulos disponibles
  const allModules = [
    { name: "Ventas", icon: "💼", route: "ventas" },
    { name: "Facturación", icon: "📄", route: "facturacion" },
    { name: "Inventario", icon: "📦", route: "inventario" },
    { name: "RRHH", icon: "👥", route: "rrhh", roles: ["admin"] },
    { name: "Finanzas", icon: "💰", route: "finanzas", roles: ["admin"] },
    { name: "Gráficos", icon: "📊", route: "graficos", roles: ["admin"] },
  ];

  // Array de módulos filtrados según el rol del usuario
  let modules = [];

  // Función para navegar entre rutas
  function navigate(route) {
    if (!isDragging) currentRoute = route;
  }

  // Función para manejar el cierre de sesión
  function handleLogout() {
    isAuthenticated = false;
    userRol = "";
    username = "";
    currentRoute = "home";
    theme.set("light");
  }

  // Función para manejar el inicio de sesión
  function handleLogin(event) {
    isAuthenticated = true;
    userRol = event.detail.rol;
    username = event.detail.username;
    updateModules();
    currentRoute = "home";
  }

  // Función para actualizar los módulos según el rol del usuario
  function updateModules() {
    const savedOrder = localStorage.getItem("modulesOrder");
    const filtered = allModules.filter(
      (module) => !module.roles || module.roles.includes(userRol)
    );

    modules = savedOrder
      ? JSON.parse(savedOrder)
          .map((name) => filtered.find((m) => m.name === name))
          .filter(Boolean)
      : [...filtered];
  }

  // Función para guardar el orden de los módulos en localStorage
  function saveModulesOrder() {
    localStorage.setItem(
      "modulesOrder",
      JSON.stringify(modules.map((m) => m.name))
    );
  }

  let draggedItem;

  // Funciones para manejar el arrastre y soltar de los módulos
  function handleDragStart(event, module) {
    isDragging = true;
    draggedItem = module;
    event.dataTransfer.effectAllowed = "move";
    event.target.style.opacity = "0.5";
  }

  function handleDragOver(event, index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event, targetIndex) {
    event.preventDefault();
    if (draggedItem) {
      const currentIndex = modules.findIndex(m => m.name === draggedItem.name);
      if (currentIndex !== targetIndex) {
        modules = modules.filter(m => m !== draggedItem);
        modules.splice(targetIndex, 0, draggedItem);
        modules = [...modules];
        saveModulesOrder();
      }
    }
    isDragging = false;
  }

  function handleDragEnd(event) {
    isDragging = false;
    event.target.style.opacity = "1";
  }

  // Función que se ejecuta al montar el componente
  onMount(() => {
    theme.subscribe((value) => {
      document.body.className = value;
    });

    updateModules();
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
          {#each modules as module, index (module.name)}
            <button
              class="module-icon"
              draggable="true"
              on:click={() => navigate(module.route)}
              on:dragstart={(e) => handleDragStart(e, module)}
              on:dragover={(e) => handleDragOver(e, index)}
              on:drop={(e) => handleDrop(e, index)}
              on:dragend={handleDragEnd}
            >
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
  position: relative;
}

.module-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
  padding: 1rem;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  font-size: inherit;
}

.module-icon:active {
  cursor: grabbing;
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

.module-icon.dragging {
  opacity: 0.7;
  cursor: grabbing !important;
  z-index: 1000;
}

</style>
