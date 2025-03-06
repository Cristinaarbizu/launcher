<script>
    import { onMount } from 'svelte';
  
    let productos = [];
    let totalInventario = 0;
  
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
  </script>
  
  <div class="inventario-container">
    <h2>Inventario</h2>
  
    <div class="resumen">
      <p>Valor Total del Inventario: ${totalInventario.toLocaleString()}</p>
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
            <td>{producto.cantidad}</td>
            <td>${producto.precio}</td>
            <td>{producto.categoria}</td>
            <td>${(producto.cantidad * producto.precio).toLocaleString()}</td>
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
  </style>
  