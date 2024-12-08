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
  plugins: [react()],
  base: "/xpreia2/",
  server: {
    host: true, // dış bağlantı için
    port: process.env.PORT || 4173
    proxy: {
    "/api": "https://monkfish-app-v9x5k.ondigitalocean.app/"
   
    
  },}}
);
