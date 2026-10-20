import { ArrowRight } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BandeauContact from '@/components/systeme/BandeauContact';
import BarreAppel from '@/components/systeme/BarreAppel';
import BoutonTelephone from '@/components/systeme/BoutonTelephone';
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
 * CE QUI EST REPRIS MOT POUR MOT : les prestations de vente, les trois motifs
 * d'estimation, les trois repères, la logique de calcul et ses multiplicateurs.
 *
 * RETOURS DU CLIENT DU 12/10/2026 : la carte « Acheter un bien » et ses huit
 * prestations sont barrées d'une croix, et avec elles « Les deux sens » — la
 * section ne parle plus que de la vente. « Rédaction et suivi du compromis »
 * est barré, « home staging » raturé. Le résultat du calculateur est arrondi
 * (voir `calculateEstimation`).
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
 * LE CALCULATEUR EXPRESS A ÉTÉ RETIRÉ LE 20/10/2026 (client : « les résultats
 * ne sont pas précis »). Une moyenne au mètre carré corrigée de cinq
 * coefficients n'est pas une estimation, et l'afficher sous le nom de l'agence
 * engageait sa crédibilité. À sa place : la carte « Demander une estimation »,
 * qui dit ce que le vendeur obtient, puis le déroulé et ce qui est regardé. Les
 * trois repères de l'ouverture (DVF, Gratuit, 48 h) sont partis avec lui : la
 * carte dit les deux derniers, la deuxième étape dit le premier. Les fichiers
 * `components/estimation/` (QuickCalculator, InteractiveMap,
 * MarketDataService) restent dans le dépôt, plus importés par personne.
 *
 * « 48 h » : arbitré par le client sur ses retours papier du 12/10/2026 (« 24
 * heures » barré, « 48 h » écrit à la main), et appliqué partout sur le site.
 */

/**
 * Ce que contient une demande. Rien qui ne soit déjà promis sur la page avant
 * le 20/10/2026 : « une visite, un rapport argumenté, une réponse sous 48
 * heures ouvrées » (le bandeau de clôture) et « gratuite et sans engagement ».
 */
const DEMANDE = [
  'Une visite du bien',
  'Un avis de valeur écrit et argumenté',
  'Une réponse sous 48 heures ouvrées',
];

/** Les types d'estimation, donnés par le client le 20/10/2026. */
const TYPES = ['Vente', 'Fiscale', 'Patrimoniale', 'Locative', 'Successorale'];

/**
 * Le déroulé d'une estimation. Chaque étape reprend une affirmation déjà sur la
 * page — la visite, les ventes enregistrées du quartier, l'immeuble administré,
 * le rapport argumenté, la réponse sous 48 h. À faire valider par le client :
 * l'ordre exact et ce que contient le rapport.
 */
const ETAPES = [
  {
    cote: '01',
    titre: 'Vous nous contactez',
    texte: 'Par téléphone ou par le formulaire. Nous vous répondons sous 48 heures ouvrées.',
  },
  {
    cote: '02',
    titre: 'Nous visitons le bien',
    texte: "Sur place, ce qu'une annonce ne dit pas : l'état, l'étage, la disposition des pièces.",
  },
  {
    cote: '03',
    titre: 'Nous comparons',
    texte:
      'Aux ventes réellement enregistrées dans le quartier — les données publiques DVF de la DGFiP.',
  },
  {
    cote: '04',
    titre: "Vous recevez l'avis de valeur",
    texte: 'Un rapport écrit et argumenté, gratuit et sans engagement.',
  },
];

/**
 * Ce qui est regardé. « Le bien » reprend les critères du calculateur retiré,
 * eux-mêmes repris du site en production ; « l'immeuble » développe la phrase
 * du chapeau (« vendre un lot dans un immeuble que l'on administre déjà »). À
 * faire valider par le client : la liste de « l'immeuble ».
 */
const CRITERES = [
  {
    cote: 'I',
    titre: 'Le bien',
    points: ['Type et surface', 'Nombre de pièces', 'Étage', 'État général'],
  },
  {
    cote: 'II',
    titre: 'Le quartier',
    points: ['Les ventes enregistrées à proximité', 'Les biens comparables en vente'],
  },
  {
    cote: 'III',
    titre: "L'immeuble",
    points: [
      'Les charges de copropriété',
      'Les travaux votés',
      'L’état des parties communes',
    ],
    note: 'Quand nous en sommes le syndic, nous le connaissons déjà.',
  },
];

const SERVICES_VENTE = [
  'Estimation gratuite et précise de votre bien',
  'Mise en valeur',
  'Diffusion multi-canaux des annonces',
  'Négociation optimisée du prix de vente',
  'Accompagnement juridique complet',
  "Suivi jusqu'à la signature chez le notaire",
  'Discrétion sur les ventes sensibles',
];

/**
 * Cinq motifs depuis le 20/10/2026 (client : « estimation fiscale,
 * patrimoniale, locative, successorale »). Vente et Patrimoine gardent leur
 * texte d'origine ; Succession perd « déclarations fiscales », qui a désormais
 * sa ligne ; Fiscale et Locative sont nouvelles.
 */
const MOTIFS = [
  {
    titre: 'Vente',
    texte: 'Estimation précise pour optimiser votre prix de vente et réduire le délai de commercialisation.',
  },
  {
    titre: 'Fiscale',
    texte: 'La valeur de votre bien pour vos déclarations fiscales.',
  },
  {
    titre: 'Patrimoniale',
    texte: "Bilan patrimonial complet pour vos projets d'investissement et de transmission.",
  },
  {
    titre: 'Locative',
    texte: 'Le loyer de marché de votre bien, avant de le mettre en location.',
  },
  {
    titre: 'Successorale',
    texte: 'Évaluation pour la déclaration de succession et le partage entre héritiers.',
  },
];

/** La carte du mandat de vente : titre en romain, deux colonnes de prestations. */
const Mandat = ({
  titre,
  resume,
  prestations,
  action,
}: {
  titre: string;
  resume: string;
  prestations: string[];
  action: React.ReactNode;
}) => (
  <Voile className="panneau flex flex-col p-7 lg:p-8">
    <h3 className="text-[clamp(1.625rem,2.4vw,1.875rem)]">{titre}</h3>
    <p className="mt-1.5 text-[1rem] leading-[1.5] text-muted-foreground">{resume}</p>
    <ul className="mt-5 grid border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2 sm:gap-x-5">
      {prestations.map((x) => (
        <li
          key={x}
          className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5 text-[1rem] leading-[1.45] text-ardoise"
        >
          {x}
        </li>
      ))}
    </ul>
    <div className="mt-6">{action}</div>
  </Voile>
);

const VendreEstimer = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Vendre et estimer un bien — Paris 8ᵉ',
    description:
      'Estimation immobilière gratuite appuyée sur les transactions enregistrées (DVF), et accompagnement de la vente jusqu\'à la signature.',
    provider: {
      '@type': 'RealEstateAgent',
      name: 'Jobard Immobilier',
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
        title="Vendre et estimer un bien à Paris — Jobard Immobilier"
        description="Estimation gratuite appuyée sur les transactions enregistrées (DVF), et accompagnement de la vente jusqu'à la signature. JIP, Paris 8e."
        keywords="estimation immobilière gratuite paris, vendre appartement paris, estimation fiscale, estimation successorale, estimation locative, données DVF"
        canonicalUrl="https://www.adbjip.fr/services/vendre-estimer"
        structuredData={[
          structuredData,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.adbjip.fr/' },
              { '@type': 'ListItem', position: 2, name: 'Vendre et estimer', item: 'https://www.adbjip.fr/services/vendre-estimer' },
            ],
          },
        ]}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- L'OUVERTURE : le propos à gauche, la demande à droite ----- */}
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
            </div>

            {/* La carte blanche qu'occupait le calculateur : ce que l'on obtient,
                pour quels motifs, et les deux façons de le demander. */}
            <Voile delai={120}>
              <div id="demande-estimation" className="panneau scroll-mt-24 p-6 sm:p-8">
                <p className="cote">Gratuit · sans engagement</p>
                <h2 className="mt-2 text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]">
                  Demander une estimation
                </h2>
                <ul className="mt-5 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {DEMANDE.map((point) => (
                    <li
                      key={point}
                      className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-3 text-[1rem] leading-[1.45] text-ardoise"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="gravure mt-6">Pour une estimation</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {TYPES.map((type) => (
                    <li key={type} className="plaque">
                      {type}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Lien to="/contact?service=achats-ventes">
                      Demander une estimation
                      <ArrowRight aria-hidden />
                    </Lien>
                  </Button>
                  <BoutonTelephone />
                </div>
              </div>
            </Voile>
          </div>
        </section>

        {/* ---- LE DÉROULÉ ------------------------------------------------ */}
        <section className="bg-lin py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Le déroulé"
              titre="Comment se passe une estimation"
              chapeau="Quatre temps, du premier appel à l'avis de valeur écrit."
            />
            <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {ETAPES.map((etape, index) => (
                <Voile as="li" key={etape.titre} delai={echelonner(index)} className="border-t border-foreground pt-4">
                  <p className="cote">{etape.cote}</p>
                  <h3 className="mt-2 text-[clamp(1.5rem,2vw,1.75rem)] leading-[1.15]">{etape.titre}</h3>
                  <p className="mt-3 text-[1rem] leading-[1.55] text-ardoise">{etape.texte}</p>
                </Voile>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- CE QUI EST REGARDÉ ---------------------------------------- */}
        <section className="bg-pierre py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="La méthode"
              titre="Ce que nous regardons pour estimer"
              chapeau="Le bien, le quartier, et l'immeuble : c'est là que le syndic voit ce que l'annonce ne montre pas."
            />
            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              {CRITERES.map((critere, index) => (
                <Voile key={critere.titre} delai={echelonner(index)} className="border-t border-foreground pt-4">
                  <p className="cote">{critere.cote}</p>
                  <h3 className="mt-2 text-[clamp(1.5rem,2vw,1.75rem)]">{critere.titre}</h3>
                  <ul className="mt-3 space-y-1.5 text-[1rem] leading-[1.6] text-ardoise">
                    {critere.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {critere.note && (
                    <p className="mt-3 text-[0.9375rem] leading-[1.5] text-muted-foreground">{critere.note}</p>
                  )}
                </Voile>
              ))}
            </div>
          </div>
        </section>

        {/* ---- LA VENTE -------------------------------------------------
            Une seule carte depuis le retrait de la partie achat : elle prend
            toute la largeur, ses prestations restent sur deux colonnes. */}
        <section id="vendre" className="scroll-mt-24 bg-lin py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Le mandat de vente"
              titre="De l'estimation à la signature"
              chapeau="Sept prestations, un seul interlocuteur : celui qui estime votre bien suit la vente jusque chez le notaire."
            />
            <div className="mt-10">
              <Mandat
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
            </div>
          </div>
        </section>

        {/* ---- LES MOTIFS ------------------------------------------------ */}
        <section className="bg-pierre py-16 lg:py-20">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <Voile>
              <p className="gravure">Les motifs</p>
              <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">Cinq raisons d'estimer</h2>
              <p className="mesure mt-4 text-[1rem] leading-[1.55] text-ardoise">
                Vendre, déclarer, transmettre, louer, hériter : la valeur de marché établie sur
                pièces.
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
                  <dd className="text-[1rem] leading-[1.5] text-ardoise">{motif.texte}</dd>
                </Voile>
              ))}
            </dl>
          </div>
        </section>

        {/* « Détaillée » et « ce que vous avez saisi ci-dessus » sont partis
            avec le calculateur : il n'y a plus qu'une seule demande. */}
        <BandeauContact
          surtitre="Estimer votre bien"
          titre="Demande d'estimation"
          texte="Une visite, un rapport argumenté, une réponse sous 48 heures ouvrées."
          action={{ libelle: "Demander l'estimation", href: '/contact?service=achats-ventes' }}
          ordre="action"
        />
      </main>
      <Footer />
      <BarreAppel action={{ libelle: 'Estimer', href: '/contact?service=achats-ventes' }} />
    </div>
  );
};

export default VendreEstimer;
