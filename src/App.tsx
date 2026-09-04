import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollManager from "./components/ScrollManager";
import Attente from "./components/systeme/Attente";
import Index from "./pages/Index";

/**
 * DÉCOUPAGE DES ROUTES — ce qui est chargé d'emblée, et ce qui attend.
 *
 * L'ACCUEIL RESTE STATIQUE, volontairement. C'est la page d'arrivée de la
 * quasi-totalité des visites : la découper reviendrait à ajouter un aller-retour
 * réseau devant le premier pixel utile. Elle arrive d'un bloc, avec le noyau
 * React, le routeur, l'en-tête et le pied de page — que toutes les autres pages
 * réutilisent ensuite sans rien retélécharger.
 *
 * TOUT LE RESTE EST EN `lazy`. Les poids ci-dessous ont été relevés avant la
 * direction « La Plaque » (`ANALYSE=1 npm run build`) ; les pages ont changé
 * depuis, l'ordre de grandeur reste :
 *   EstimationBiens .......... 28,4 Ko  + QuickCalculator 32,9 + MarketDataService 10,7
 *                                       + InteractiveMap 8,0  = ~80 Ko à elle seule
 *                                       (devenue VendreEstimer, avec AchatsVentes)
 *   GestionCopropriete ....... 27,1 Ko
 *   Biens .................... 18,4 Ko  (+ data/biens.json, qui reste au noyau
 *                                        car l'aperçu de l'accueil s'en sert)
 *   GestionLocative .......... 14,4 Ko
 *   About .................... 10,7 Ko  (devenue L'agence + Équipe)
 *
 * Le repli est `<Attente>` : hauteur minimale posée, `role="status"`, et la
 * seule animation que le mouvement réduit conserve.
 *
 * PIÈGE VÉRIFIÉ : `scripts/prerender.mjs` doit laisser le temps aux morceaux
 * d'arriver, sinon il écrit dix pages contenant le repli. Le contrôle du `#root`
 * vide ne suffirait pas — le repli, lui, n'est pas vide. Le prérendu est donc
 * revérifié sur le contenu réel après ce découpage.
 */
const Biens = lazy(() => import("./pages/Biens"));
const BienPage = lazy(() => import("./pages/BienPage"));
const GestionLocative = lazy(() => import("./pages/services/GestionLocative"));
const GestionCopropriete = lazy(() => import("./pages/services/GestionCopropriete"));
const VendreEstimer = lazy(() => import("./pages/services/VendreEstimer"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Atelier = lazy(() => import("./pages/Atelier"));

/**
 * Chemin de l'atelier de contrôle visuel, dans une constante et non en clair.
 * `scripts/prerender.mjs` extrait les routes de ce fichier par une expression
 * régulière sur l'attribut « path » des balises Route : un littéral ici aurait été prérendu, aurait
 * ajouté un fichier à `dist/` et aurait fait mentir le repère du prérendu.
 */
const CHEMIN_ATELIER = "/atelier";

/**
 * PAS DE FOURNISSEUR AUTOUR DU ROUTEUR, et ce n'est pas un oubli.
 *
 * Le gabarit d'origine enveloppait l'application dans un `QueryClientProvider`
 * et un `TooltipProvider`. Aucun des deux ne servait : pas un seul `useQuery`
 * dans le dépôt, pas une seule info-bulle affichée. Les deux dépendances
 * partaient pourtant dans le bundle — 37,9 Ko compressés pour deux balises
 * vides. Retirés le 27/08/2026, avec `src/components/ui/tooltip.tsx`.
 *
 * Si un jour une donnée distante doit être mise en cache côté client, remettre
 * `@tanstack/react-query` est un `npm install` — mais le site n'appelle
 * aujourd'hui d'API qu'au build (les annonces) et depuis `MarketDataService`,
 * qui gère son propre cache de 24 h. Ne pas le réinstaller « au cas où ».
 */
const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ScrollManager />
    <Suspense fallback={<Attente />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/biens" element={<Biens />} />
        {/* La fiche bien : `:slug` est résolu par `scripts/routes.mjs` depuis
            `data/biens.json`, pour le prérendu, le sitemap et les vérificateurs.
            Les trois anciennes routes (/services/estimation-biens,
            /services/achats-ventes, /equipe) redirigent en 301 depuis le
            `.htaccess` — pas de `<Navigate>` ici, qui prérendrait une page
            en doublon. */}
        <Route path="/biens/:slug" element={<BienPage />} />
        <Route path="/services/gestion-locative" element={<GestionLocative />} />
        <Route path="/services/gestion-copropriete" element={<GestionCopropriete />} />
        <Route path="/services/vendre-estimer" element={<VendreEstimer />} />
        <Route path="/agence" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        {/* Atelier : développement uniquement. Absent du bundle de
            production, donc le chemin y retombe sur la 404. */}
        {import.meta.env.DEV && <Route path={CHEMIN_ATELIER} element={<Atelier />} />}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
