import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { prechargerPage } from "./lib/chargement";
import { PAGES, cleDeRoute } from "./lib/pages";
import "./index.css";

/**
 * LE PRÉRENDU RESTE À L'ÉCRAN JUSQU'AU VRAI RENDU.
 *
 * Le HTML de chaque page est prérendu : le visiteur voit la page complète dès
 * le premier octet. Monter React tout de suite la faisait DISPARAÎTRE : la
 * route est un `lazy`, `Suspense` posait le repli `<Attente>` à la place du
 * contenu le temps de télécharger le morceau — des secondes sur la préversion
 * après un déploiement, signalé par le client le 09/09/2026. On attend donc
 * le morceau de la page demandée (trois secondes au plus), puis on monte :
 * le contenu prérendu est remplacé par le même contenu, rendu par React.
 * L'accueil est dans le noyau et ne précharge rien. Voir `lib/chargement.ts`.
 */
const racine = createRoot(document.getElementById("root")!);
prechargerPage(cleDeRoute(window.location.pathname), PAGES).then(() =>
  racine.render(<App />),
);
