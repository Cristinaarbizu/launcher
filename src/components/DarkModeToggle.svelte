<!-- src/components/DarkModeToggle.svelte -->
<script>
    import { theme } from '../stores/theme';
  
    function toggleTheme() {
      theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    }
  </script>
  
  <button on:click={toggleTheme}>
    {$theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
  </button>
  
  <style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
  }
  </style>
  