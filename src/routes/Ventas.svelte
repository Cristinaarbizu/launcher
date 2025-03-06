<script>
    import { onMount } from 'svelte';
    
    let ventas = [];
    
    onMount(async () => {
      // Simular una carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      ventas = [
        { id: 1, cliente: 'Cliente A', ingresos: 1000, fecha: '2025-03-06' },
        { id: 2, cliente: 'Cliente B', ingresos: 1500, fecha: '2025-03-05' },
        { id: 3, cliente: 'Cliente C', ingresos: 2000, fecha: '2025-03-04' },
      ];
    });
  </script>
  
  <div class="ventas-container">
    <h2>Página de Ventas</h2>
    
    {#if ventas.length === 0}
      <p>Cargando ventas...</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>ingresos </th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {#each ventas as venta}
            <tr>
              <td>{venta.id}</td>
              <td>{venta.cliente}</td>
              <td>${venta.ingresos}</td>
              <td>{venta.fecha}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  
  <style>
    .ventas-container {
      padding: 1rem;
    }
  
    h2 {
      color: #333;
      margin-bottom: 1rem;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
  
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
  
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  
    tr:hover {
      background-color: #f5f5f5;
    }
  </style>
  