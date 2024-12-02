import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      }
    }
  },
/*   optimizeDeps: {
    exclude: ["fs","crypto"]
}, */
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '.runtimeConfig': './runtimeConfig.browser',
     // fs: require.resolve('rollup-pligin-node-builtins'),
    "@": path.resolve(__dirname, "./src"),
    "~@": path.resolve(__dirname, "/src"),
  },
},
})
