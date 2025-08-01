import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import dotenv from 'dotenv';
import { env } from "process";
dotenv.config();

export default defineConfig(({ mode }) => ({
  base: "./", 
  server: {
    host: "::",
    port: 8080,
  },
 define: {
  'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
},

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
