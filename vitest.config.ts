import path from 'path';
import { defineConfig } from 'vitest/config';

/**
 * Configuration distincte de `vite.config.ts`, volontairement.
 *
 * `vite.config.ts` charge `lovable-tagger` et lit `process.env.VITE_BASE` : rien
 * de tout cela ne concerne les tests, et l'y mêler ferait dépendre la suite de
 * réglages de build. Les alias sont en revanche indispensables — `src/lib/biens.ts`
 * importe `@data/biens.json`.
 *
 * PÉRIMÈTRE : la logique pure de `src/lib/`, et rien d'autre. Pas de tests de
 * composants. Ce projet n'a pas de rendu à tester automatiquement : ce qui se
 * voit se vérifie par capture d'écran regardée, ce qui se calcule se vérifie ici.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data'),
    },
  },
  test: {
    // `node` et non `jsdom` : aucune fonction testée ne touche au DOM, et
    // ajouter un environnement de navigateur ralentirait la suite pour rien.
    environment: 'node',
    include: ['src/lib/**/*.test.ts'],
  },
});
