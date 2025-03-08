<script>
  import { onMount } from 'svelte';

  let productos = [];
  let totalInventario = 0;

  onMount(async () => {
  try {
    const response = await fetch('/src/data/productos.json');
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }
    const data = await response.json(); // Obtener el JSON
    productos = data.productos; // Acceder al array dentro del JSON

    totalInventario = productos.reduce((total, producto) => total + (producto.cantidad * producto.precio), 0);
  } catch (error) {
    console.error(error);
  }
});

  /*
  onMount(() => {
    // Simulación de carga de datos
    productos = [
      { id: 1, nombre: 'Laptop', cantidad: 50, precio: 1000, categoria: 'Electrónica' },
      { id: 2, nombre: 'Escritorio', cantidad: 30, precio: 200, categoria: 'Muebles' },
      { id: 3, nombre: 'Silla de oficina', cantidad: 100, precio: 150, categoria: 'Muebles' },
      { id: 4, nombre: 'Monitor', cantidad: 75, precio: 300, categoria: 'Electrónica' },
      { id: 5, nombre: 'Teclado', cantidad: 120, precio: 50, categoria: 'Accesorios' }
    ];

    totalInventario = productos.reduce((total, producto) => total + (producto.cantidad * producto.precio), 0);
  });
  */

</script>

<div class="inventario-container">
  <h2>Inventario</h2>

  <div class="resumen">
    <p>Valor Total del Inventario: ${totalInventario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
        <th>Categoría</th>
        <th>Valor Total</th>
      </tr>
    </thead>
    <tbody>
      {#each productos as producto}
        <tr>
          <td>{producto.id}</td>
          <td>{producto.nombre}</td>
          <td class="alinear-dcha">{producto.cantidad}</td>
          <td class="alinear-dcha">${(producto.precio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>{producto.categoria}</td>
          <td class="alinear-dcha">${(producto.cantidad * producto.precio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .inventario-container {
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

  .alinear-dcha {
      text-align: right;
  }
  
</style>
