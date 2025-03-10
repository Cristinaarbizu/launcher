<script>
  import { onMount } from 'svelte';
  
  let facturas = [];
  let totalVentas = 0;
  
  onMount(async () => {
  try {
    const response = await fetch('/src/data/facturas.json');
    if (!response.ok) {
      throw new Error('Error al cargar las facturas');
    }
    const data = await response.json(); // Obtener el objeto completo
    facturas = data.facturas; // Acceder al array dentro del JSON
    totalVentas = facturas.reduce((total, factura) => total + factura.ingresos, 0);
  } catch (error) {
    console.error(error);
  }
});

  /*
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
  */

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
    <p>Total Ventas: ${totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
            <td class="alinear-dcha">${factura.ingresos.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
    margin-bottom: 1rem;
  }

  .resumen {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
  }

  .estado-pagada,
  .estado-pendiente,
  .estado-vencida {
    font-weight: bold;
  }
  
  .alinear-dcha {
      text-align: right;
  }
  
  /* Estilos de colores para los estados */
  .estado-pagada {
    color: green;
  }

  .estado-pendiente {
    color: orange;
  }

  .estado-vencida {
    color: red;
  }

  .estado-en-progreso {
    color: blue; /* Color para el nuevo estado "En progreso" */
  }
  
  .alinear-dcha {
    text-align: right;
  }
  
</style>
