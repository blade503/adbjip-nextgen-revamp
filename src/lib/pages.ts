import type { ComponentType } from "react";

/**
 * LA TABLE DES PAGES DIFFÉRÉES — une clé par morceau de route.
 *
 * Elle sert deux fois : `App.tsx` en fait des composants `lazy` (via
 * `pageDifferee`), et `main.tsx` PRÉCHARGE la page demandée avant le premier
 * rendu (`cleDeRoute` + `prechargerPage`, dans `chargement.ts`). C'est ce
 * préchargement qui évite l'écran d'attente sur la première visite : sans lui,
 * React remplaçait le HTML prérendu par le repli `<Attente>` le temps de
 * télécharger le morceau — « la page de chargement pendant quelques secondes »
 * signalée par le client sur la préversion le 09/09/2026.
 *
 * Les chemins de route restent écrits en clair dans `App.tsx` :
 * `scripts/prerender.mjs` les y lit par expression régulière.
 */
export type Importeur = () => Promise<{ default: ComponentType }>;

export const PAGES = {
  biens: () => import("@/pages/Biens"),
  bien: () => import("@/pages/BienPage"),
  gestionLocative: () => import("@/pages/services/GestionLocative"),
  gestionCopropriete: () => import("@/pages/services/GestionCopropriete"),
  vendreEstimer: () => import("@/pages/services/VendreEstimer"),
  agence: () => import("@/pages/About"),
  contact: () => import("@/pages/Contact"),
  mentionsLegales: () => import("@/pages/MentionsLegales"),
  introuvable: () => import("@/pages/NotFound"),
} satisfies Record<string, Importeur>;

export type ClePage = keyof typeof PAGES;

const FIXES: Record<string, ClePage> = {
  "/biens": "biens",
  "/services/gestion-locative": "gestionLocative",
  "/services/gestion-copropriete": "gestionCopropriete",
  "/services/vendre-estimer": "vendreEstimer",
  "/agence": "agence",
  "/contact": "contact",
  "/mentions-legales": "mentionsLegales",
};

/**
 * La page différée que servira une URL, ou `null` pour l'accueil, qui est dans
 * le noyau. Tolère la barre finale et le préfixe de la préversion GitHub Pages
 * (`BASE_URL`). Tout chemin inconnu mène à la 404 — elle aussi différée.
 */
export function cleDeRoute(
  pathname: string,
  base = import.meta.env.BASE_URL,
): ClePage | null {
  let chemin = pathname;
  if (base && base !== "/" && chemin.startsWith(base))
    chemin = "/" + chemin.slice(base.length);
  chemin = chemin.replace(/\/+$/, "") || "/";
  if (chemin === "/") return null;
  if (chemin in FIXES) return FIXES[chemin];
  if (/^\/biens\/[^/]+$/.test(chemin)) return "bien";
  return "introuvable";
}
