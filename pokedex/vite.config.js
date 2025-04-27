import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sæt din repo URL korrekt her:
export default defineConfig({
  plugins: [react()],
  base: '/Assignment2-Pokedex/', // meget vigtigt til GitHub Pages
})
