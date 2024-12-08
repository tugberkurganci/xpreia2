import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

/*
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});




*/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined // SPA için optimize eder
      }
    }
  },
  plugins: [react()],
  base: "./",
  server: {
    host: true, //dış bağlantı için
    proxy: {
    "/api": "https://monkfish-app-v9x5k.ondigitalocean.app/"
   
    
  },}}
);
