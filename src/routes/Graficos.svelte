<!-- src/routes/Graficos.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let currentModule = null; // Módulo actual
    let chartData = {};      // Datos para la gráfica
  
    export let moduleName;    // Nombre del módulo
  
    onMount(() => {
      currentModule = moduleName; // Inicializa el módulo actual
      fetchChartData(moduleName);   // Carga los datos de la gráfica
    });
  
    async function fetchChartData(module) {
      // Simulación de datos para la gráfica
      chartData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        data: [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100)
        ]
      };
    }
  </script>
  
  <div class="graphics-container">
    <h2>Gráficos de {currentModule}</h2>
    {#if chartData.labels && chartData.data}
      <div class="chart">

        <p>Gráfica de {currentModule}</p>
        <ul>
          {#each chartData.labels as label, i}
            <li>{label}: {chartData.data[i]}</li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>Cargando datos...</p>
    {/if}
  </div>
  
  <style>
    .graphics-container {
      padding: 20px;
      text-align: center;
    }
  
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
  
    .chart {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }
  </style>
  