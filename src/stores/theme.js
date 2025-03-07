// src/stores/theme.js
import { writable } from 'svelte/store';

const savedTheme = localStorage.getItem('theme') || 'light'; 
export const theme = writable(savedTheme);

theme.subscribe(value => {
  localStorage.setItem('theme', value); 
});
