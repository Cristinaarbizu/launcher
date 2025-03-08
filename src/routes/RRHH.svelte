<script>
    import { onMount } from 'svelte';
  
    let empleados = [];
    let totalSalarios = 0;

    onMount(async () => {
      try {
        const response = await fetch('/src/data/empleados.json'); 
        if (!response.ok) {
          throw new Error('Error al cargar los empleados');
        }
        const data = await response.json(); // Obtener el JSON
        empleados = data.empleados; // Acceder al array dentro del JSON

        totalSalarios = empleados.reduce((total, empleado) => total + empleado.salario, 0);
      } catch (error) {
        console.error(error);
      }
    });
  
    /*
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
    */

  </script>
  
  <div class="rrhh-container">
    <h2>Recursos Humanos</h2>
  
    <div class="resumen">
      <p>Total de Salarios: ${totalSalarios.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
            <td class="alinear-dcha">${(empleado.salario).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
    
    .alinear-dcha {
        text-align: right;
    }
  
  </style>
  
  