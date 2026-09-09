import { createElement, lazy, type ComponentType } from "react";

import type { ClePage, Importeur } from "@/lib/pages";

/**
 * CHARGEMENT DIFFÉRÉ D'UNE PAGE : préchargement, rechargement de secours.
 *
 * DEUX INCIDENTS SUR LA PRÉVERSION, DEUX MÉCANISMES.
 *
 * 1. 08/09/2026 — page blanche sur /services/vendre-estimer, console « Failed
 *    to fetch dynamically imported module …/assets/VendreEstimer-DXEeQtdU.js »
 *    (404). Les morceaux de route portent une empreinte dans leur nom, un
 *    déploiement change les empreintes, et l'envoi FTP SUPPRIME les fichiers
 *    absents du nouveau build (vérifié : l'ancien morceau répond 404). Un
 *    visiteur dont l'onglet était ouvert avant le déploiement garde l'ancienne
 *    table des morceaux ; son premier clic vers une page pas encore visitée
 *    demande un fichier qui n'existe plus. Réponse : quand l'import échoue, on
 *    recharge la page UNE FOIS — le HTML frais porte les nouvelles empreintes —
 *    puis, si cela échoue encore, on laisse l'erreur remonter au `GardeFou`.
 *    La garde d'une seule tentative est posée par URL dans `sessionStorage`,
 *    levée dès qu'un chargement réussit ; sans elle, un vrai 404 ferait boucler.
 *
 * 2. 09/09/2026 — « la page de chargement du site pendant quelques secondes ».
 *    Le HTML est prérendu : le visiteur voit la page entière au premier octet.
 *    Puis React montait, tombait sur un `lazy` pas encore résolu, et `Suspense`
 *    REMPLAÇAIT ce contenu par le repli `<Attente>` le temps de télécharger le
 *    morceau — mesuré 25 ms sur une bonne ligne, des secondes sur la préversion
 *    après un déploiement (cache vide, empreintes neuves). On ne monte donc
 *    React qu'une fois le morceau de la page demandée arrivé (`prechargerPage`,
 *    appelé par `main.tsx`) : le composant préchargé est rendu directement,
 *    sans passer par `lazy`, et le prérendu reste à l'écran jusqu'au vrai
 *    rendu. Borné à trois secondes : au-delà on monte quand même, et le repli
 *    dit au moins que quelque chose se passe. Les navigations SUIVANTES passent
 *    par `lazy` comme avant — là, le repli est légitime.
 */
const PREFIXE = "jip:rechargement:";

/** Les modules déjà arrivés, par clé de page : rendus sans `Suspense`. */
const prechargees = new Map<ClePage, ComponentType>();

function memoire(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    // Navigation privée stricte, ou stockage refusé : on ne recharge pas, on
    // laisse l'erreur au garde-fou.
    return null;
  }
}

function avecSecours(importer: Importeur): Importeur {
  return () =>
    importer().then(
      (module) => {
        memoire()?.removeItem(PREFIXE + window.location.pathname);
        return module;
      },
      (erreur: unknown) => {
        const stockage = memoire();
        const cle = PREFIXE + window.location.pathname;
        if (stockage && !stockage.getItem(cle)) {
          stockage.setItem(cle, String(Date.now()));
          window.location.reload();
          // Pendant le rechargement, la promesse ne se résout jamais :
          // `Suspense` garde `<Attente>` à l'écran, rien ne clignote.
          return new Promise<{ default: ComponentType }>(() => {});
        }
        throw erreur;
      },
    );
}

export function pageDifferee(cle: ClePage, importer: Importeur): ComponentType {
  const Differee = lazy(avecSecours(importer));
  const Page = () => {
    const Prechargee = prechargees.get(cle);
    return createElement(Prechargee ?? Differee);
  };
  Page.displayName = `Page(${cle})`;
  return Page;
}

/**
 * Charge le morceau de la page demandée avant le premier rendu. Ne rejette
 * jamais : un échec ici sera rejoué par `lazy`, qui a le rechargement de
 * secours ; un dépassement du délai rend la main et laisse `Suspense` faire.
 */
export function prechargerPage(
  cle: ClePage | null,
  importeurs: Record<ClePage, Importeur>,
  delaiMax = 3000,
): Promise<void> {
  if (!cle) return Promise.resolve();
  const chargement = importeurs[cle]()
    .then((module) => {
      prechargees.set(cle, module.default);
    })
    .catch(() => undefined);
  const delai = new Promise<void>((resoudre) => setTimeout(resoudre, delaiMax));
  return Promise.race([chargement, delai]);
}
