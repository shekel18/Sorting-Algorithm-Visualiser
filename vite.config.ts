import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  base: '/Sorting-Algorithm-Visualiser/', // Add this line exactly like this
  plugins: [react()],
});
