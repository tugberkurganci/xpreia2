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
    proxy: {
    "/api": "https://137.184.199.29:8080"
   
    
  },}}
);
