<script>
    import { onMount } from 'svelte';
    
    let facturas = [];
    let totalVentas = 0;
    
    onMount(async () => {
      // Simular una carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      facturas = [
        { id: 1, cliente: 'Empresa A', ingresos: 5000, fecha: '2025-03-06', estado: 'Pagada' },
        { id: 2, cliente: 'Empresa B', ingresos: 7500, fecha: '2025-03-05', estado: 'Pendiente' },
        { id: 3, cliente: 'Empresa C', ingresos: 3000, fecha: '2025-03-04', estado: 'Pagada' },
        { id: 4, cliente: 'Empresa D', ingresos: 6000, fecha: '2025-03-03', estado: 'Vencida' },
      ];
      
      totalVentas = facturas.reduce((total, factura) => total + factura.ingresos, 0);
    });
  
    function getEstadoClass(estado) {
      switch(estado) {
        case 'Pagada': return 'estado-pagada';
        case 'Pendiente': return 'estado-pendiente';
        case 'Vencida': return 'estado-vencida';
        default: return '';
      }
    }
  </script>
  
  <div class="facturacion-container">
    <h2>Facturación</h2>
    
    <div class="resumen">
      <p>Total Ventas: ${totalVentas.toLocaleString()}</p>
    </div>
    
    {#if facturas.length === 0}
      <p>Cargando facturas...</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Ingresos</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {#each facturas as factura}
            <tr>
              <td>{factura.id}</td>
              <td>{factura.cliente}</td>
              <td>${factura.ingresos.toLocaleString()}</td>
              <td>{factura.fecha}</td>
              <td class={getEstadoClass(factura.estado)}>{factura.estado}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  
  <style>
    .facturacion-container {
      padding: 1rem;
    }
  
    h2 {
      color: #333;
      margin-bottom: 1rem;
    }
  
    .resumen {
      background-color: #f0f0f0;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
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
  
    .estado-pagada {
      color: green;
      font-weight: bold;
    }
  
    .estado-pendiente {
      color: orange;
      font-weight: bold;
    }
  
    .estado-vencida {
      color: red;
      font-weight: bold;
    }
  </style>
  