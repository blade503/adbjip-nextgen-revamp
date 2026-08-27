import { ArrowRight, Phone } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';

/**
 * TROIS LARGEURS POUR LE BANDEAU D'OUVERTURE.
 *
 * Le seul fichier servi était le 1536 px, soit 90,9 Ko, envoyé tel quel à un
 * téléphone. Les variantes sont produites depuis le master PNG de `src/assets/`,
 * qui reste en place et n'est jamais livré. `sizes="100vw"` est exact : le
 * bandeau occupe toute la largeur de la fenêtre à toutes les tailles.
 */
import gestionCoproImage from '@/assets/GestionDeCopropriete2-large.webp';
import gestionCoproImage1024 from '@/assets/GestionDeCopropriete2-1024.webp';
import gestionCoproImage700 from '@/assets/GestionDeCopropriete2.webp';

const gestionCoproImageSet = `${gestionCoproImage700} 700w, ${gestionCoproImage1024} 1024w, ${gestionCoproImage} 1536w`;

/**
 * SYNDIC DE COPROPRIÉTÉ — recomposée dans le langage de la charte.
 *
 * LE CONTENU RÉDACTIONNEL EST REPRIS MOT POUR MOT. Les six atouts, les trois
 * catégories du rôle du syndic, les trois niveaux d'accès Gercop et le passage
 * sur l'observatoire des charges viennent de la version précédente : c'est la
 * matière de l'agence, pas de la mise en page.
 *
 * CE QUI A CHANGÉ EST LA FORME, et seulement elle. Relevé avant : 74 vestiges
 * de gabarit sur cette seule page — 12 `text-center`, 12 `rounded-2xl/3xl`,
 * 16 `animate-*`, 7 gélules, 6 pastilles d'icônes colorées, 6 `gradient-text`,
 * 8 `bg-gradient-*`, 3 `hover-lift`, 2 `glass`. Contre 2 sur la gérance locative
 * et 1 sur l'accueil.
 *
 * Les six remplacements, un par un :
 *
 *  - le centrage systématique → tout est ferré à gauche sur la travée, et les
 *    six en-têtes passent par `EnTeteSection` : plaque vissée, filet qui court,
 *    titre sur une mesure de 46 caractères.
 *  - les carrés d'icônes en aplat coloré → des filets de laiton. Une pastille
 *    par carte, c'était six familles de couleur sur une page qui en compte deux.
 *  - la grille de cartes égales → un registre de rangées réglées. Six cartes de
 *    même poids prétendent que les six atouts se valent ; une liste laisse
 *    l'ordre dire la hiérarchie, et donne la place d'une phrase entière.
 *  - `gradient-text` sur un mot du titre → le titre entier en pierre ou en
 *    encre. Le laiton reste sur la plaque, où il est mesuré.
 *  - les fonds en dégradé → l'alternance nuit / pierre / ivoire de la charte.
 *  - `animate-slide-up` avec des `animationDelay` en ligne → le voile de
 *    `Ouverture`, échelonné par `echelonner()`, masqué SEULEMENT sous le pli.
 *
 * DEUX TABLEAUX MORTS ONT ÉTÉ RETIRÉS : `services` (huit libellés) et
 * `expertise` (trois entrées) étaient déclarés et rendus nulle part. Leur
 * contenu est reporté dans la note de passation plutôt que perdu.
 *
 * CE QUI RESTE À TRANCHER, et qui n'est donc pas touché : « 24 h » comme délai
 * de réponse, « réduction significative des principaux postes de dépenses »,
 * « économies garanties », « fournisseurs triés sur le volet », « expertise
 * reconnue ». Aucune source. Ils figuraient sur la page, ils y restent jusqu'à
 * arbitrage — la charte interdit de les inventer, pas de les conserver.
 */

/** Repères de l'ouverture. Mêmes valeurs qu'avant, sans les pastilles. */
const REPERES = [
  { valeur: 'Depuis 2011', libelle: 'Agence indépendante' },
  { valeur: <>Paris 8<sup>e</sup></>, libelle: '27, rue de Lisbonne' },
  { valeur: '24 h', libelle: 'Délai de réponse' },
];

/** Les six atouts, libellés tels quels. */
const ATOUTS = [
  {
    titre: 'Suivi individuel',
    intitule: 'Personnalisé',
    texte:
      "Chaque copropriété bénéficie d'un accompagnement sur-mesure et d'une attention particulière de nos experts.",
  },
  {
    titre: 'Contrat transparent',
    intitule: 'Sans surprise',
    texte:
      'Des conditions claires, une tarification transparente et des engagements précis pour votre tranquillité.',
  },
  {
    titre: 'Équipe réactive',
    intitule: 'Joignable',
    texte:
      "Une équipe disponible et à l'écoute pour répondre rapidement à tous vos besoins et questions.",
  },
  {
    titre: 'Rigueur comptable',
    intitule: 'Optimisation',
    texte:
      'Notre contrôle rigoureux conduit à une réduction significative des principaux postes de dépenses de votre immeuble.',
  },
  {
    titre: 'Analyse des charges',
    intitule: 'Performance',
    texte:
      'Une analyse approfondie de vos charges et engagements pour optimiser votre gestion et réduire vos coûts.',
  },
  {
    titre: 'Réseau fournisseurs',
    intitule: 'Qualité',
    texte:
      'Un réseau de fournisseurs triés sur le volet, au service exclusif des copropriétaires pour des prestations de qualité.',
  },
];

/** Les trois volets du mandat de syndic, et ce que chacun couvre. */
const ROLES = [
  {
    titre: 'Administratif',
    resume: 'Gestion administrative et organisationnelle',
    points: [
      'Préservation du patrimoine',
      "Mise en œuvre des décisions d'AG",
      "Gestion du quotidien et de l'avenir",
    ],
  },
  {
    titre: 'Juridique',
    resume: 'Conseil et conformité réglementaire',
    points: [
      'Devoir de conseil',
      'Suivi des évolutions réglementaires',
      'Respect du règlement',
    ],
  },
  {
    titre: 'Financière',
    resume: 'Transparence et gestion comptable',
    points: ['Transparence comptable et financière'],
  },
];

/** Les trois niveaux d'accès Gercop, conservés tels quels. */
const ACCES = [
  {
    titre: 'Espace personnel',
    pour: 'Chaque copropriétaire',
    texte: 'Accès sécurisé à vos données, à toute heure.',
    items: ['Situation comptable', 'Appels de provisions', 'Relevé de dépenses'],
  },
  {
    titre: "Documents de l'immeuble",
    pour: 'Chaque copropriétaire',
    texte: 'Les documents collectifs de la copropriété.',
    items: ['Convocations', "Procès-verbaux d'assemblée", 'Comptes-rendus'],
  },
  {
    titre: 'Accès conseil syndical',
    pour: 'Membres du conseil syndical',
    texte: "Une vue étendue sur la gestion courante de l'immeuble.",
    items: ['Factures', 'Contrats', 'Interventions et sinistres'],
  },
];

/** Une entrée de liste : filet de laiton en puce, jamais une pastille. */
const Point = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3 last:border-0">
    <span aria-hidden className="mt-[0.7rem] h-px w-3 shrink-0 bg-primary-ink" />
    <span className="text-[0.9375rem] leading-relaxed">{children}</span>
  </li>
);

const GestionCopropriete = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Syndic de copropriété — Paris 8ᵉ',
    description:
      "Syndic de copropriété à Paris : assemblées générales, comptabilité, appels de fonds, suivi des travaux et accès en ligne aux comptes de l'immeuble.",
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
    serviceType: 'Syndic de copropriété',
    areaServed: 'Paris',
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Syndic de copropriété à Paris — JIP"
        description="Syndic de copropriétés parisiennes depuis 2011 : assemblées générales, comptabilité, travaux, accès en ligne aux comptes de votre immeuble. 27 rue de Lisbonne, Paris 8e."
        keywords="syndic copropriété paris, syndic paris 8, assemblée générale, appels de fonds, gestion copropriété"
        canonicalUrl="https://www.adbjip.fr/services/gestion-copropriete"
        structuredData={structuredData}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- OUVERTURE ----------------------------------------------
            `nuit` est INDISPENSABLE et non décoratif : sans cette portée, le
            fond passe au sombre tandis que `--foreground` reste l'encre, et on
            obtient de l'encre sur du marine.

            Le voile plafonne à 0,86 : au-delà la photographie n'existe plus, en
            dessous le laiton du titre tombe sous 3:1. Valeur calculée sur le
            99e percentile clair de l'image. */}
        <section className="nuit grain relative isolate overflow-hidden bg-nuit pb-20 pt-32 text-pierre lg:pb-28">
          <div className="absolute inset-0 -z-10">
            {/* Décorative : le titre voisin nomme déjà le service, et le voile
                la réduit à une texture. Un alt ne ferait que répéter le h1. */}
            <img
              src={gestionCoproImage}
              srcSet={gestionCoproImageSet}
              sizes="100vw"
              alt=""
              className="h-full w-full object-cover"
              width={1536}
              height={1024}
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-nuit/[0.90] via-nuit/[0.86] to-nuit/[0.92]" />
          </div>

          <div className="container relative mx-auto">
            <EnTeteSection
              fond="nuit"
              niveau="h1"
              /* Les deux textes viennent de la page précédente, sans un mot
                 ajouté : « Syndic depuis 2011 » était déjà une plaque plus bas,
                 et « Gestion de copropriété » était le h1. J'avais d'abord
                 composé un titre — hors sujet, la demande portait sur la forme,
                 et il débordait la mesure sur trois lignes. */
              plaque="Syndic depuis 2011"
              titre="Gestion de copropriété" 
              chapeau="La pérennité au service de votre immeuble avec une gestion professionnelle et transparente. Nous garantissons la valorisation et la préservation de votre patrimoine collectif."
            />

            <Voile delai={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Lien to="/contact?service=gestion-copropriete">
                  Demander un audit gratuit
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
            </Voile>

            {/* Trois repères séparés par des filets verticaux. Les trois carrés
                d'icônes en aplat de laiton ont disparu : une pastille par
                repère était du décor, et le plus daté du lot. */}
            <Voile delai={280}>
              <dl className="mt-14 grid max-w-[34rem] grid-cols-1 border-t border-pierre/15 sm:grid-cols-3">
                {REPERES.map(({ valeur, libelle }) => (
                  <div
                    key={libelle}
                    className="border-b border-pierre/15 py-4 sm:border-b-0 sm:border-l sm:border-pierre/15 sm:py-5 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
                  >
                    <dt className="font-display text-[0.9375rem] font-semibold">{valeur}</dt>
                    <dd className="mt-1 text-[0.8125rem] text-muted-foreground">{libelle}</dd>
                  </div>
                ))}
              </dl>
            </Voile>
          </div>
        </section>

        {/* ---- LES SIX ATOUTS -----------------------------------------
            Un registre, pas une grille de cartes : voir l'en-tête du fichier. */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Pourquoi JIP"
              titre="Ce que vous obtenez d'un syndic qui connaît l'immeuble"
              chapeau="Syndic de copropriétés parisiennes depuis 2011, JIP s'impose comme le partenaire de confiance pour la préservation et la valorisation de votre patrimoine immobilier."
            />

            {/* UN SEUL NIVEAU DE `div` DANS UN `dl`.
                `<Voile>` rend lui-même un `div` : lui ajouter un `div.grid`
                à l'intérieur en faisait DEUX, et la spécification n'en admet
                qu'un — celui qui groupe les `dt`/`dd`. Les classes de grille
                sont donc portées par le `Voile`.
                Relevé par Lighthouse (`dlitem` et `definition-list`) : le
                même défaut que j'avais corrigé sur le pied de page, et que
                j'ai réintroduit en recomposant ces pages. */}
            <dl className="mt-16 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {ATOUTS.map((atout, index) => (
                <Voile key={atout.titre} delai={echelonner(index)} className="grid gap-x-10 gap-y-2 border-b border-[hsl(var(--trait)/var(--trait-a))] py-7 lg:grid-cols-[18rem_1fr]">
                  {/* L'intitulé entre DANS le `dt` : sous son `div` de groupe, un
                      `dl` n'admet que des `dt` et des `dd`. Un `<p>` frère du `dt`,
                      enveloppé dans un second `div`, faisait deux fautes d'un coup —
                      relevé par Lighthouse (`dlitem`, `definition-list`). */}
                  <dt className="text-[1.0625rem] font-semibold">
                    {atout.titre}
                    <span className="tabulaire mt-1 block font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                      {atout.intitule}
                    </span>
                  </dt>
                  <dd className="mesure-large text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {atout.texte}
                  </dd>
                </Voile>
              ))}
            </dl>

            {/* L'observatoire des charges, en panneau et non en carte à dégradé
                bordée d'un filet arc-en-ciel. Les deux syndicats gardent leur
                plaque : c'est une affiliation, donc une inscription. */}
            <Voile delai={200}>
              <div className="panneau cadre mt-14 p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-[clamp(1.25rem,2vw,1.625rem)]">Observatoire des charges</h3>
                  <p className="flex gap-2">
                    <span className="plaque">UNIS</span>
                    <span className="plaque">FNAIM</span>
                  </p>
                </div>
                <p className="mesure-large mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  En collaboration avec <strong className="font-semibold text-foreground">UNIS</strong> et{' '}
                  <strong className="font-semibold text-foreground">FNAIM</strong>, nous comparons les
                  dépenses de votre copropriété à celles d'autres copropriétés pour une gestion
                  optimale et des économies garanties.
                </p>
              </div>
            </Voile>
          </div>
        </section>

        {/* ---- LE RÔLE DU SYNDIC -------------------------------------- */}
        <section className="bg-ivoire py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Le mandat"
              titre="Quel est le rôle du syndic ?"
              chapeau="Trois volets, portés par le même mandat : l'administration de l'immeuble, la conformité de ses décisions, et la tenue de ses comptes."
            />

            <div className="mt-16 grid gap-x-14 gap-y-12 lg:grid-cols-3">
              {ROLES.map((role, index) => (
                <Voile key={role.titre} delai={echelonner(index)}>
                  <h3 className="text-[clamp(1.25rem,2vw,1.625rem)]">{role.titre}</h3>
                  <p className="mesure mt-2 text-[0.9375rem] text-muted-foreground">{role.resume}</p>
                  <ul className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                    {role.points.map((point) => (
                      <Point key={point}>{point}</Point>
                    ))}
                  </ul>
                </Voile>
              ))}
            </div>
          </div>
        </section>

        {/* ---- L'ACCÈS EN LIGNE ---------------------------------------
            Cette section remplaçait déjà deux sections redondantes, dont une
            mettait en scène un tableau de bord fictif — bandeau « LIVE UPDATES »
            clignotant et compteur de notifications inventé. Le service décrit,
            lui, est réel : les trois niveaux d'accès sont conservés tels quels. */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Accès en ligne"
              titre="Votre copropriété en ligne"
              chapeau="L'agence tient les comptes et les documents de votre immeuble sur Gercop, accessible à toute heure. Trois niveaux d'accès, selon votre rôle dans la copropriété."
            />

            <div className="mt-16 grid gap-x-14 gap-y-12 lg:grid-cols-3">
              {ACCES.map((acces, index) => (
                <Voile key={acces.titre} delai={echelonner(index)}>
                  <h3 className="text-[clamp(1.25rem,2vw,1.625rem)]">{acces.titre}</h3>
                  <p className="tabulaire mt-1.5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                    {acces.pour}
                  </p>
                  <p className="mesure mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {acces.texte}
                  </p>
                  <ul className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                    {acces.items.map((item) => (
                      <Point key={item}>{item}</Point>
                    ))}
                  </ul>
                </Voile>
              ))}
            </div>
          </div>
        </section>

        {/* ---- LE RENDEZ-VOUS ---------------------------------------- */}
        <section className="nuit grain relative bg-nuit py-20 text-pierre lg:py-28">
          <div className="container relative mx-auto">
            <EnTeteSection
              fond="nuit"
              plaque="Changer de syndic"
              titre="Parlons de votre immeuble"
              chapeau="Confiez-nous la gestion de votre immeuble et bénéficiez de notre expertise reconnue. Un interlocuteur regarde le dossier et vous dit ce qu'il en pense."
            />

            <Voile delai={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Lien to="/contact?service=gestion-copropriete">
                  Nous écrire
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
            </Voile>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GestionCopropriete;
