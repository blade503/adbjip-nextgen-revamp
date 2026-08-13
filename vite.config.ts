import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages sert le site sous /<nom-du-depot>/ ; l'hébergement LWS le sert
  // à la racine. VITE_BASE permet de construire pour l'un ou pour l'autre.
  base: process.env.VITE_BASE || '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Le portefeuille est produit par scripts/fetch-biens.mjs hors de src/.
      "@data": path.resolve(__dirname, "./data"),
    },
  },
}));
