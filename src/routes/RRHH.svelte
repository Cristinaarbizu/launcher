<script>
    import { onMount } from 'svelte';
  
    let empleados = [];
    let totalSalarios = 0;
  
    onMount(() => {
      // Simulación de carga de datos
      empleados = [
        { id: 1, nombre: 'Juan Pérez', cargo: 'Desarrollador', departamento: 'TI', salario: 50000 },
        { id: 2, nombre: 'María García', cargo: 'Gerente de Ventas', departamento: 'Ventas', salario: 65000 },
        { id: 3, nombre: 'Carlos López', cargo: 'Diseñador UX', departamento: 'Diseño', salario: 55000 },
        { id: 4, nombre: 'Ana Martínez', cargo: 'Contadora', departamento: 'Finanzas', salario: 60000 },
        { id: 5, nombre: 'Pedro Sánchez', cargo: 'Representante de Ventas', departamento: 'Ventas', salario: 45000 }
      ];
  
      totalSalarios = empleados.reduce((total, empleado) => total + empleado.salario, 0);
    });
  </script>
  
  <div class="rrhh-container">
    <h2>Recursos Humanos</h2>
  
    <div class="resumen">
      <p>Total de Salarios: ${totalSalarios.toLocaleString()}</p>
      <p>Número de Empleados: {empleados.length}</p>
    </div>
  
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Cargo</th>
          <th>Departamento</th>
          <th>Salario Anual</th>
        </tr>
      </thead>
      <tbody>
        {#each empleados as empleado}
          <tr>
            <td>{empleado.id}</td>
            <td>{empleado.nombre}</td>
            <td>{empleado.cargo}</td>
            <td>{empleado.departamento}</td>
            <td>${empleado.salario.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
  <style>
    .rrhh-container {
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
  
  