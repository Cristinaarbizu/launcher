<script>
  import { createEventDispatcher, onMount } from 'svelte';

  let username = '';
  let password = '';
  let error = '';
  let usuarios = [];

  const dispatch = createEventDispatcher();
  

  // Cargar la lista de usuarios desde usuarios.json
  async function cargarUsuarios() {
      try {
        const response = await fetch('/src/data/usuarios.json');
        const data = await response.json();
        usuarios = data.usuarios;
      } catch (err) {
          console.error("Error cargando usuarios.json:", err);
          error = "Error al cargar los usuarios";
      }
  }

  onMount(() => {
      cargarUsuarios();
  });

  function handleSubmit() {
    if (usuarios.length === 0) {
        error = 'Usuarios no cargados correctamente';
        return;
    }
    
    const usuarioEncontrado = usuarios.find(user => user.username === username && user.password === password);
    if (usuarioEncontrado) {
        dispatch('login', { username, rol: usuarioEncontrado.rol });
    } else {
        error = 'Usuario o contraseña incorrectos';
    }
  }
</script>
  
  <div class="login-container">
    <h1>Launcher Empresarial</h1>
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="input-group">
          <label for="username">Usuario</label>
          <input type="text" id="username" bind:value={username} required>
        </div>
        <div class="input-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" bind:value={password} required>
        </div>
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <button type="submit" class="login-button">Iniciar Sesión</button>
      </form>
    </div>
  </div>
  
  <style>

    /* Contenedor principal */
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100%;
      padding: 1rem;
      box-sizing: border-box;
      background: linear-gradient(to bottom, #ff3e00, #ff7f50); 
    }
  
    /* Título principal */
    h1 {
      color: white;
      text-transform: uppercase;
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 2rem;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    }
  
    /* Tarjeta de login */
    .login-card {
      background-color: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
      width: min(100%, 400px);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    /* Título de la tarjeta */
    h2 {
      color: #333;
      font-size: 1.8em;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: bold;
      border-bottom: solid #ff3e00 3px;
      display: inline-block;
      padding-bottom: .5rem;
    }
  
    /* Grupo de inputs */
    .input-group {
      width: 100%;
      margin-bottom: 1rem;
    }
  
    label {
      display: block;
      margin-bottom: .5rem;
      color: #666;
      font-weight: bold;
      font-size: .95rem;
    }
  
    input {
      width: 100%;
      padding: .75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
  
    input:focus {
      outline: none;
      border-color: #ff3e00;
      box-shadow: 0 0 0 2px rgba(255, 62, 0, 0.2);
    }
  
    /* Botón de login */
    .login-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #ff3e00;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background-color 0.3s ease, transform 0.1s ease;
      margin-top: 1rem;
    }
  
    .login-button:hover {
      background-color: #e63600;
    }
  
    .login-button:active {
      transform: scale(0.98);
    }
  
    /* Mensaje de error */
    .error {
      color: #ff3e00;
      margin-top: 0.5rem;
      text-align: center;
      font-weight: bold;
    }
  </style>
  