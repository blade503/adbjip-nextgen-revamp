import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import MarketDataService, { type DonneesMarche } from '@/components/estimation/MarketDataService';
import BandeauContact from '@/components/systeme/BandeauContact';
import BarreAppel from '@/components/systeme/BarreAppel';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';

/**
 * VENDRE & ESTIMER — planche 2d de la direction « La Plaque ».
 *
 * FUSION de deux pages, décidée avec l'arborescence de la direction :
 * « Estimation de biens » (calculateur express, méthode, formulaire détaillé)
 * et « Achats et ventes » (les deux mandats, la méthode, les atouts). Les deux
 * anciennes URL redirigent ici (`public/.htaccess`).
 *
 * CE QUI EST REPRIS MOT POUR MOT : les huit prestations de vente et les huit
 * d'achat, les trois motifs d'estimation, les trois repères, la logique de
 * calcul et ses multiplicateurs.
 *
 * UN SEUL FORMULAIRE SUR LA PAGE. La première version gardait, sous le
 * calculateur express, l'ancien formulaire de « demande d'estimation
 * détaillée » (dix champs) : deux formulaires d'estimation sur une page, l'un
 * en haut, l'autre en bas — remarqué à l'écran le 04/09/2026. La demande
 * détaillée passe désormais par le formulaire de contact, profil « vendeur ou
 * acquéreur » présélectionné, le champ du bien PRÉREMPLI avec ce que le visiteur
 * a saisi dans le calculateur (adresse, surface, pièces, et l'estimation
 * express si elle a été calculée). Il ne ressaisit rien. Ce qui est perdu : le
 * champ « objectif » (vente, succession, patrimoine), que le visiteur écrit
 * dans son message s'il le souhaite.
 *
 * CE QUI N'A PAS SUIVI, parce que la planche ne le prévoit pas : les huit
 * critères de « notre méthode d'évaluation », le panneau « pourquoi nous
 * choisir » (dont « 15+ années d'expérience », sans source), les quatre étapes
 * de la transaction et les trois atouts de la page achats-ventes. Le texte est
 * consigné dans REPRISE.md § 14 pour ne pas être perdu.
 *
 * Trois vestiges retirés au passage : `saveToLocalStorage`, jamais appelée, son
 * `loadFromLocalStorage` qui ne trouvait donc jamais rien, et l'écouteur
 * clavier global sur la touche Entrée, redondant avec la soumission du
 * formulaire du calculateur.
 *
 * LES DEUX PLUS GROS MORCEAUX SONT DIFFÉRÉS : `QuickCalculator` (le plus gros
 * fichier de `src/`) et `InteractiveMap`, qui n'est demandée qu'au clic sur
 * « Voir sur la carte ».
 */
const QuickCalculator = lazy(() => import('@/components/estimation/QuickCalculator'));
const InteractiveMap = lazy(() => import('@/components/estimation/InteractiveMap'));

/** Réserve la hauteur d'un bloc différé : l'arrivée du morceau ne décale rien. */
const Reserve = ({ hauteur }: { hauteur: string }) => (
  <div role="status" className={`panneau flex items-center justify-center ${hauteur}`}>
    <span aria-hidden className="attente block h-5 w-5 rounded-full border-b-2 border-primary-ink" />
    <span className="sr-only">Chargement…</span>
  </div>
);

/**
 * Repères de l'ouverture : des faits, pas des chiffres de performance.
 * « 24 h » reste en attente d'arbitrage, comme partout ailleurs sur le site :
 * la charte interdit d'inventer un chiffre, pas de conserver celui qui y était.
 */
const REPERES = [
  { valeur: 'DVF', libelle: 'données publiques DGFiP' },
  { valeur: 'Gratuit', libelle: 'sans engagement' },
  { valeur: '24 h', libelle: 'délai de réponse' },
];

const SERVICES_VENTE = [
  'Estimation gratuite et précise de votre bien',
  'Mise en valeur et home staging',
  'Diffusion multi-canaux des annonces',
  'Négociation optimisée du prix de vente',
  'Accompagnement juridique complet',
  "Suivi jusqu'à la signature chez le notaire",
  'Rédaction et suivi du compromis',
  'Discrétion sur les ventes sensibles',
];

const SERVICES_ACHAT = [
  'Recherche personnalisée selon vos critères',
  'Accès à un portefeuille exclusif',
  "Négociation du prix d'achat",
  'Vérification juridique approfondie',
  'Accompagnement financement',
  'Organisation des visites',
  'Conseil en investissement locatif',
  'Suivi post-acquisition',
];

const MOTIFS = [
  {
    titre: 'Vente',
    texte: 'Estimation précise pour optimiser votre prix de vente et réduire le délai de commercialisation.',
  },
  {
    titre: 'Succession',
    texte: 'Évaluation officielle pour les déclarations fiscales et partages successoraux.',
  },
  {
    titre: 'Patrimoine',
    texte: "Bilan patrimonial complet pour vos projets d'investissement et de transmission.",
  },
];

/** Une carte « vendre » ou « acheter » : titre en romain, deux colonnes de prestations. */
const Sens = ({
  titre,
  resume,
  prestations,
  action,
  delai,
}: {
  titre: string;
  resume: string;
  prestations: string[];
  action: React.ReactNode;
  delai?: number;
}) => (
  <Voile delai={delai} className="panneau flex flex-col p-7 lg:p-8">
    <h3 className="text-[clamp(1.625rem,2.4vw,1.875rem)]">{titre}</h3>
    <p className="mt-1.5 text-[0.875rem] leading-[1.5] text-muted-foreground">{resume}</p>
    <ul className="mt-5 grid border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2 sm:gap-x-5">
      {prestations.map((x) => (
        <li
          key={x}
          className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5 text-[0.875rem] leading-[1.45] text-ardoise"
        >
          {x}
        </li>
      ))}
    </ul>
    <div className="mt-6">{action}</div>
  </Voile>
);

const VendreEstimer = () => {
  const marketDataService = useMemo(() => MarketDataService.getInstance(), []);

  // ---- Le calculateur express -------------------------------------------
  const [quickEstimation, setQuickEstimation] = useState({
    address: '',
    city: '',
    postalCode: '',
    surface: '',
    rooms: '',
    type: '',
    floor: '',
    condition: 'bon',
  });
  const [estimationResult, setEstimationResult] = useState<number | null>(null);
  const [estimationData, setEstimationData] = useState<DonneesMarche | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Facteurs d'ajustement — inchangés.
  const getTypeMultiplier = useCallback((type: string) => {
    const multipliers = { appartement: 1.0, maison: 1.1, studio: 0.9, duplex: 1.05 };
    return multipliers[type as keyof typeof multipliers] || 1.0;
  }, []);

  const getConditionMultiplier = useCallback((condition: string) => {
    const multipliers = { excellent: 1.15, 'tres-bon': 1.08, bon: 1.0, moyen: 0.92, mauvais: 0.8 };
    return multipliers[condition as keyof typeof multipliers] || 1.0;
  }, []);

  const getFloorMultiplier = useCallback((floor: string) => {
    if (!floor) return 1.0;
    const floorNum = parseInt(floor);
    if (floorNum === 0) return 0.95;
    if (floorNum === 1) return 1.0;
    if (floorNum >= 2 && floorNum <= 4) return 1.02;
    if (floorNum >= 5) return 1.05;
    return 1.0;
  }, []);

  const getSurfaceMultiplier = useCallback((surface: number) => {
    if (surface < 30) return 1.1;
    if (surface > 100) return 0.95;
    return 1.0;
  }, []);

  const getRoomsMultiplier = useCallback((rooms: number, surface: number) => {
    const surfacePerRoom = surface / rooms;
    if (surfacePerRoom < 15) return 0.95;
    if (surfacePerRoom > 35) return 1.05;
    return 1.0;
  }, []);

  const calculateEstimation = useCallback(async () => {
    if (
      !quickEstimation.address ||
      !quickEstimation.city ||
      !quickEstimation.postalCode ||
      !quickEstimation.surface ||
      !quickEstimation.rooms
    ) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setIsCalculating(true);
    setErrorMessage(null);

    try {
      const coordinates = await marketDataService.geocodeAddress(
        quickEstimation.address,
        quickEstimation.city,
        quickEstimation.postalCode,
      );
      if (!coordinates) {
        setErrorMessage('Adresse non trouvée. Veuillez vérifier votre saisie.');
        return;
      }

      const marketData = await marketDataService.getMarketData(coordinates, quickEstimation.address);
      if (!marketData) {
        setErrorMessage("Impossible d'obtenir les données de marché pour cette zone.");
        return;
      }
      setEstimationData(marketData);

      const surface = parseInt(quickEstimation.surface);
      const rooms = parseInt(quickEstimation.rooms);
      let adjustedPrice = marketData.basePricePerM2;
      adjustedPrice *=
        getTypeMultiplier(quickEstimation.type) *
        getConditionMultiplier(quickEstimation.condition) *
        getFloorMultiplier(quickEstimation.floor) *
        getSurfaceMultiplier(surface) *
        getRoomsMultiplier(rooms, surface);

      setEstimationResult(Math.round(adjustedPrice * surface));
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      setErrorMessage('Une erreur est survenue lors du calcul. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  }, [
    quickEstimation,
    marketDataService,
    getTypeMultiplier,
    getConditionMultiplier,
    getFloorMultiplier,
    getSurfaceMultiplier,
    getRoomsMultiplier,
  ]);

  /**
   * Le lien vers le formulaire de contact, profil vendeur, le bien prérempli
   * avec la saisie du calculateur. Borné à 160 caractères côté formulaire.
   */
  const versDemande = () => {
    const q = quickEstimation;
    const bien = [
      [q.address, q.postalCode, q.city].filter(Boolean).join(' '),
      q.surface ? `${q.surface} m²` : '',
      q.rooms ? `${q.rooms} pièces` : '',
      estimationResult ? `estimation express ${estimationResult.toLocaleString('fr-FR')} €` : '',
    ]
      .filter(Boolean)
      .join(' · ');
    return `/contact?service=achats-ventes${bien ? `&bien=${encodeURIComponent(bien)}` : ''}`;
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Vendre et estimer un bien — Paris 8ᵉ',
    description:
      "Estimation immobilière gratuite appuyée sur les transactions enregistrées (DVF), et accompagnement de la vente ou de l'achat jusqu'à la signature.",
    provider: {
      '@type': 'RealEstateAgent',
      name: 'J.I.P. — Jobard Immobilier Paris',
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADRESSE.rue,
        addressLocality: ADRESSE.ville,
        addressRegion: 'Île-de-France',
        postalCode: ADRESSE.codePostal,
        addressCountry: 'FR',
      },
    },
    serviceType: ['Estimation immobilière', 'Transaction immobilière'],
    areaServed: 'Paris',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Estimation gratuite et sans engagement',
    },
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Vendre et estimer un bien à Paris — JIP"
        description="Estimation gratuite appuyée sur les transactions réellement enregistrées (DVF), et accompagnement de la vente ou de l'achat jusqu'à la signature. Agence JIP, 27 rue de Lisbonne, Paris 8e."
        keywords="estimation immobilière gratuite paris, vendre appartement paris, acheter paris 8, transaction immobilière, données DVF"
        canonicalUrl="https://www.adbjip.fr/services/vendre-estimer"
        structuredData={structuredData}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- L'OUVERTURE : le propos à gauche, le calculateur à droite --- */}
        <section className="bg-pierre pb-14 pt-10 lg:pb-16 lg:pt-16">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="voile gravure">Vendre & estimer</p>
              <h1 className="voile mesure mt-5 text-[clamp(2.625rem,6vw,4.5rem)] [animation-delay:90ms]">
                Connaissez la <em>vraie valeur</em> de votre bien.
              </h1>
              <p className="voile mesure-large mt-6 text-[1.0625rem] leading-[1.55] text-ardoise [animation-delay:180ms] sm:text-[1.125rem]">
                Estimation gratuite et sans engagement, appuyée sur les transactions réellement
                enregistrées dans le quartier. Vendre un lot dans un immeuble que l'on administre
                déjà, c'est vendre en connaissance.
              </p>
              <dl className="voile mt-9 flex flex-wrap gap-x-8 gap-y-4 [animation-delay:270ms]">
                {REPERES.map(({ valeur, libelle }) => (
                  <div key={libelle}>
                    <dt className="font-serif text-[1.75rem] leading-none">{valeur}</dt>
                    <dd className="mt-1.5 text-[0.8125rem] text-muted-foreground">{libelle}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Voile delai={120}>
              <Suspense fallback={<Reserve hauteur="min-h-[36rem]" />}>
                <QuickCalculator
                  quickEstimation={quickEstimation}
                  setQuickEstimation={setQuickEstimation}
                  estimationResult={estimationResult}
                  isCalculating={isCalculating}
                  errorMessage={errorMessage}
                  onCalculate={calculateEstimation}
                  onShowMap={() => setIsMapOpen(true)}
                  marketData={estimationData}
                />
              </Suspense>
            </Voile>
          </div>
        </section>

        {/* La carte : montée SEULEMENT à l'ouverture, donc son morceau n'est
            jamais téléchargé par qui ne l'ouvre pas. */}
        {isMapOpen && (
          <Suspense fallback={<Reserve hauteur="min-h-[20rem]" />}>
            <InteractiveMap
              isOpen={isMapOpen}
              onClose={() => setIsMapOpen(false)}
              address={quickEstimation.address}
              city={quickEstimation.city}
              postalCode={quickEstimation.postalCode}
              estimationResult={estimationResult}
              marketData={estimationData}
            />
          </Suspense>
        )}

        {/* ---- LES DEUX SENS ------------------------------------------- */}
        <section id="les-deux-sens" className="scroll-mt-24 bg-lin py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les deux sens"
              titre="Vendre votre bien, acheter un bien"
              chapeau="Deux mandats distincts, seize prestations. Le même interlocuteur suit le dossier dans les deux sens."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Sens
                titre="Vendre votre bien"
                resume="Valoriser votre patrimoine grâce à notre expertise du marché parisien : maximiser la valeur de votre bien, réduire les délais de vente."
                prestations={SERVICES_VENTE}
                action={
                  <Button asChild>
                    <Lien to="/contact?service=achats-ventes">
                      Vendre mon bien
                      <ArrowRight aria-hidden />
                    </Lien>
                  </Button>
                }
              />
              <Sens
                titre="Acheter un bien"
                resume="Trouver le bien idéal grâce à notre réseau exclusif et notre connaissance approfondie du marché immobilier parisien."
                prestations={SERVICES_ACHAT}
                action={
                  <Button variant="secondary" asChild>
                    <Lien to="/biens">
                      Voir les biens
                      <ArrowRight aria-hidden />
                    </Lien>
                  </Button>
                }
                delai={80}
              />
            </div>
          </div>
        </section>

        {/* ---- LES MOTIFS ------------------------------------------------ */}
        <section className="bg-pierre py-16 lg:py-20">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <Voile>
              <p className="gravure">Les motifs</p>
              <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">Trois raisons d'estimer</h2>
              <p className="mesure mt-4 text-[1rem] leading-[1.55] text-ardoise">
                Projet de vente, succession, transmission de patrimoine : la valeur de marché
                établie sur pièces.
              </p>
            </Voile>
            <dl className="border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {MOTIFS.map((motif, index) => (
                <Voile
                  key={motif.titre}
                  delai={echelonner(index)}
                  className="grid gap-x-8 gap-y-1 border-b border-[hsl(var(--trait)/var(--trait-a))] py-5 sm:grid-cols-[12rem_1fr]"
                >
                  <dt className="font-serif text-[1.5rem] leading-[1.1]">{motif.titre}</dt>
                  <dd className="text-[0.875rem] leading-[1.5] text-ardoise">{motif.texte}</dd>
                </Voile>
              ))}
            </dl>
          </div>
        </section>

        <BandeauContact
          surtitre="Aller plus loin"
          titre="Demande d'estimation détaillée"
          texte="Une visite, un rapport argumenté, une réponse sous 24 heures ouvrées. Ce que vous avez saisi ci-dessus est repris dans votre demande."
          action={{ libelle: "Demander l'estimation", href: versDemande() }}
          ordre="action"
        />
      </main>
      <Footer />
      <BarreAppel action={{ libelle: 'Estimer', href: '#calculateur-rapide' }} />
    </div>
  );
};

export default VendreEstimer;
