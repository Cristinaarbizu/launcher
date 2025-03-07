<script>
  import { onMount } from 'svelte';

  let ventas = [];

  onMount(async () => {
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
          <th>Ingresos</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {#each ventas as venta}
          <tr>
            <td>{venta.id}</td>
            <td>{venta.cliente}</td>
            <td class="alinear-dcha">${(venta.ingresos).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
    margin-bottom: 1rem;
  }

  .alinear-dcha {
      text-align: right;
  }

</style>
