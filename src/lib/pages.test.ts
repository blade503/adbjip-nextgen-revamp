import { describe, expect, it } from 'vitest';

import { PAGES, cleDeRoute } from './pages';

/**
 * La résolution d'une URL vers la page à précharger avant le premier rendu
 * (voir `main.tsx`). Une clé fausse, et c'est l'écran d'attente qui revient —
 * ou un morceau téléchargé pour rien.
 */
describe('résolution de la page différée', () => {
  it("l'accueil est dans le noyau : rien à précharger", () => {
    expect(cleDeRoute('/')).toBeNull();
    expect(cleDeRoute('')).toBeNull();
  });

  it('résout les routes fixes, avec ou sans barre finale', () => {
    expect(cleDeRoute('/biens')).toBe('biens');
    expect(cleDeRoute('/biens/')).toBe('biens');
    expect(cleDeRoute('/services/gestion-locative')).toBe('gestionLocative');
    expect(cleDeRoute('/services/gestion-copropriete/')).toBe('gestionCopropriete');
    expect(cleDeRoute('/services/vendre-estimer')).toBe('vendreEstimer');
    expect(cleDeRoute('/agence')).toBe('agence');
    expect(cleDeRoute('/contact')).toBe('contact');
    expect(cleDeRoute('/mentions-legales')).toBe('mentionsLegales');
  });

  it('une fiche bien, quel que soit le slug', () => {
    expect(cleDeRoute('/biens/v027-3-pieces-immeuble-renove')).toBe('bien');
    expect(cleDeRoute('/biens/v027-3-pieces-immeuble-renove/')).toBe('bien');
  });

  it('tout le reste mène à la 404, elle aussi différée', () => {
    expect(cleDeRoute('/inexistant')).toBe('introuvable');
    expect(cleDeRoute('/biens/a/b')).toBe('introuvable');
    expect(cleDeRoute('/equipe')).toBe('introuvable');
  });

  it('tolère le préfixe de la préversion GitHub Pages', () => {
    expect(cleDeRoute('/depot/agence', '/depot/')).toBe('agence');
    expect(cleDeRoute('/depot/', '/depot/')).toBeNull();
  });

  it('chaque clé résolue a son importeur', () => {
    for (const chemin of ['/biens', '/biens/x', '/agence', '/contact', '/inexistant']) {
      const cle = cleDeRoute(chemin);
      expect(cle && typeof PAGES[cle]).toBe('function');
    }
  });
});
