import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path"; 
import dotenv from "dotenv";


dotenv.config();

export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
  plugins: [
    react(),
    mode === "development" && require("lovable-tagger").componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
