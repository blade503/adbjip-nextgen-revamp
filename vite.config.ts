import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

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
    /**
     * Carte du bundle, à la demande : `ANALYSE=1 npm run build` écrit
     * `dist/bundle.html` (treemap) et `dist/bundle.json` (données brutes,
     * exploitables en ligne de commande). Hors de cette variable, le plugin
     * n'est pas chargé : le build de production reste identique.
     */
    process.env.ANALYSE === '1' &&
    visualizer({
      filename: 'dist/bundle.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
    }),
    process.env.ANALYSE === '1' &&
    visualizer({ filename: 'dist/bundle.json', template: 'raw-data', gzipSize: true, emitFile: false }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Le portefeuille est produit par scripts/fetch-biens.mjs hors de src/.
      "@data": path.resolve(__dirname, "./data"),
    },
  },
}));
