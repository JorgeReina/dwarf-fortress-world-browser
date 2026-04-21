import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/dwarf-fortress-world-browser/",
  plugins: [react()],
  worker: {
    format: "es"
  }
});
