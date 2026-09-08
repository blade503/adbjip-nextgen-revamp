import { lazy, type ComponentType } from "react";

/**
 * CHARGEMENT DIFFÉRÉ D'UNE PAGE, AVEC UN RECHARGEMENT DE SECOURS.
 *
 * Incident du 08/09/2026 sur la préversion : page blanche sur
 * /services/vendre-estimer, console « Failed to fetch dynamically imported
 * module …/assets/VendreEstimer-DXEeQtdU.js » (404). La cause est structurelle
 * et reviendra à chaque mise en ligne : les morceaux de route portent une
 * empreinte dans leur nom, un déploiement change les empreintes, et l'envoi
 * FTP SUPPRIME les fichiers absents du nouveau build (comportement par défaut
 * de FTP-Deploy-Action, vérifié : l'ancien morceau répond 404). Un visiteur
 * dont l'onglet était ouvert avant le déploiement garde en mémoire l'ancienne
 * table des morceaux ; son premier clic vers une page pas encore visitée
 * demande un fichier qui n'existe plus. Le cache de périphérie de LWS, qui
 * peut servir un HTML périmé quelques minutes, produit le même effet.
 *
 * Réponse : quand l'import échoue, on recharge la page UNE FOIS — le HTML
 * frais porte les nouvelles empreintes — puis, si cela échoue encore (cache
 * périmé, réseau coupé), on laisse l'erreur remonter au `GardeFou`, qui
 * affiche un écran lisible au lieu d'une page blanche. La garde d'une seule
 * tentative est posée par URL dans `sessionStorage`, et levée dès qu'un
 * chargement réussit ; sans elle, un vrai 404 ferait boucler le navigateur.
 *
 * Pendant le rechargement, la promesse ne se résout jamais : `Suspense`
 * continue d'afficher `<Attente>`, et rien ne clignote.
 */
const PREFIXE = "jip:rechargement:";

function memoire(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    // Navigation privée stricte, ou stockage refusé : on ne recharge pas, on
    // laisse l'erreur au garde-fou.
    return null;
  }
}

export function pageDifferee(
  importer: () => Promise<{ default: ComponentType }>,
) {
  return lazy(() =>
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
          return new Promise<{ default: ComponentType }>(() => {});
        }
        throw erreur;
      },
    ),
  );
}
