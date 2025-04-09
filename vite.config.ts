import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vitejs.dev/config/
export default defineConfig({
 
  plugins: [react(), tsconfigPaths(), nodePolyfills()],
  server: {
    proxy: {
      '/api': {
        target: 'http://118.195.149.216:3000',
        changeOrigin: true,
        // rewrite: (path) => {
        //   console.log("path", path);
        //   return path.replace(/^\/api/, '')
        // }
      }
    }
  }
})
