import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/xpeia2/",
  //server: {
   // proxy: {
  //  "/api": "https://xperia-dsbo.onrender.com/"
      //"http://localhost:8080",
    //},
  },
});