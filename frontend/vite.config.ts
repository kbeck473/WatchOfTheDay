import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you don't want JSX transform via plugin, you can remove this plugin;
// Vite will still handle react-jsx with TS setting above.
// Keeping it improves HMR & dev DX.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 3000
  }
});
