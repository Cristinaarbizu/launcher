<script>
  import { onMount } from 'svelte';

  let transacciones = [];
  let totalIngresos = 0;
  let totalGastos = 0;

  onMount(() => {
    transacciones = [
      { id: 1, tipo: 'Ingreso', importe: 10000, fecha: '2025-03-06', categoria: 'Ventas' },
      { id: 2, tipo: 'Gasto', importe: 5000, fecha: '2025-03-05', categoria: 'Gastos Generales' },
      { id: 3, tipo: 'Ingreso', importe: 8000, fecha: '2025-03-04', categoria: 'Servicios' },
      { id: 4, tipo: 'Gasto', importe: 3000, fecha: '2025-03-03', categoria: 'Materiales' },
      { id: 5, tipo: 'Ingreso', importe: 12000, fecha: '2025-03-02', categoria: 'Inversiones' }
    ];

    totalIngresos = transacciones.filter(t => t.tipo === 'Ingreso').reduce((total, t) => total + t.importe, 0);
    totalGastos = transacciones.filter(t => t.tipo === 'Gasto').reduce((total, t) => total + t.importe, 0);
  });

  function getColor(tipo) {
    return tipo === 'Ingreso' ? 'var(--ingreso-color)' : 'var(--gasto-color)';
  }
</script>

<div class="finanzas-container">
  <h2>Finanzas</h2>

  <div class="resumen">
    <p>Total Ingresos: ${totalIngresos.toLocaleString()}</p>
    <p>Total Gastos: ${totalGastos.toLocaleString()}</p>
    <p>Balance: ${(totalIngresos - totalGastos).toLocaleString()}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Tipo</th>
        <th>Importe</th>
        <th>Fecha</th>
        <th>Categoría</th>
      </tr>
    </thead>
    <tbody>
      {#each transacciones as transaccion}
        <tr>
          <td>{transaccion.id}</td>
          <td style="color: {getColor(transaccion.tipo)}">{transaccion.tipo}</td>
          <td>${transaccion.importe.toLocaleString()}</td>
          <td>{transaccion.fecha}</td>
          <td>{transaccion.categoria}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .finanzas-container {
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
</style>
