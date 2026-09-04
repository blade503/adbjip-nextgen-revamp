import { ArrowRight, ArrowUpRight } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BandeauContact from '@/components/systeme/BandeauContact';
import BarreAppel from '@/components/systeme/BarreAppel';
import BoutonTelephone from '@/components/systeme/BoutonTelephone';
import EnTetePage from '@/components/systeme/EnTetePage';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ADRESSE, ESPACE_CLIENT } from '@/config/legal';
import { echelonner } from '@/lib/echelon';

import gestionCoproImage from '@/assets/GestionDeCopropriete2-large.webp';
import gestionCoproImage1024 from '@/assets/GestionDeCopropriete2-1024.webp';
import gestionCoproImage700 from '@/assets/GestionDeCopropriete2.webp';

const gestionCoproImageSet = `${gestionCoproImage700} 700w, ${gestionCoproImage1024} 1024w, ${gestionCoproImage} 1536w`;

/**
 * SYNDIC DE COPROPRIÉTÉ — planche 2c de la direction « La Plaque ».
 *
 * LE CONTENU RÉDACTIONNEL EST REPRIS MOT POUR MOT de la version précédente,
 * elle-même reprise du site en production : les six atouts, les trois volets
 * du rôle du syndic, les trois niveaux d'accès Gercop et l'observatoire des
 * charges UNIS / FNAIM. La planche abrégeait les textes et ajoutait des points
 * au volet financier (« budget et appels de fonds, carnet d'entretien ») :
 * on garde ce que l'agence a écrit, rien de plus.
 *
 * Le titre est celui de la planche — « Un syndic qui connaît l'immeuble » —
 * et le chapeau reprend la phrase du registre des métiers. La version
 * précédente ouvrait sur « Gestion de copropriété », un intitulé de rubrique.
 *
 * CE QUI RESTE À TRANCHER, et qui n'est donc pas touché : « réduction
 * significative des principaux postes de dépenses », « économies garanties »,
 * « fournisseurs triés sur le volet ». Aucune source. Ils figuraient sur la
 * page, ils y restent jusqu'à arbitrage — la charte interdit de les inventer,
 * pas de les conserver.
 */

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
    texte: "Une équipe disponible et à l'écoute pour répondre rapidement à tous vos besoins et questions.",
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
    cote: 'I',
    titre: 'Administratif',
    points: ['Préservation du patrimoine', "Mise en œuvre des décisions d'AG", "Gestion du quotidien et de l'avenir"],
  },
  {
    cote: 'II',
    titre: 'Juridique',
    points: ['Devoir de conseil', 'Suivi des évolutions réglementaires', 'Respect du règlement'],
  },
  {
    cote: 'III',
    titre: 'Financier',
    points: ['Transparence comptable et financière'],
  },
];

/** Les trois niveaux d'accès Gercop, conservés tels quels. */
const ACCES = [
  {
    titre: 'Espace personnel',
    pour: 'Chaque copropriétaire',
    items: ['Situation comptable', 'Appels de provisions', 'Relevé de dépenses'],
  },
  {
    titre: "Documents de l'immeuble",
    pour: 'Chaque copropriétaire',
    items: ['Convocations', "Procès-verbaux d'assemblée", 'Comptes-rendus'],
  },
  {
    titre: 'Accès étendu',
    pour: 'Conseil syndical',
    items: ['Factures', 'Contrats', 'Interventions et sinistres'],
  },
];

const GestionCopropriete = () => {
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
        <EnTetePage
          surtitre="Syndic de copropriété · depuis 2011"
          titre={
            <>
              Un syndic qui <em>connaît l'immeuble.</em>
            </>
          }
          chapeau="La pérennité de l'immeuble, tenue par quelqu'un qui en connaît les dossiers : budget, appels de fonds, assemblée générale, carnet d'entretien, suivi des travaux votés."
          actions={
            <>
              <Button size="lg" asChild>
                <Lien to="/contact?service=gestion-copropriete">
                  Demander un audit gratuit
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
              <BoutonTelephone />
            </>
          }
          image={{
            src: gestionCoproImage,
            srcSet: gestionCoproImageSet,
            alt: '',
            width: 1536,
            height: 1024,
            duotone: true,
          }}
        />

        {/* ---- POURQUOI JIP : les six atouts en grille ------------ */}
        <section className="bg-lin py-16 lg:py-20">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <Voile>
              <p className="gravure">Pourquoi JIP</p>
              <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">
                Ce que vous obtenez d'un syndic qui connaît l'immeuble
              </h2>
              <p className="mesure mt-4 text-[1rem] leading-[1.55] text-ardoise">
                Syndic de copropriétés parisiennes depuis 2011, JIP s'impose comme le partenaire de
                confiance pour la préservation et la valorisation de votre patrimoine immobilier.
              </p>
            </Voile>

            {/* Six cases séparées par un filet d'un pixel : le fond de la
                grille est le trait, les cases le recouvrent. Une grille de
                cartes sans rien qui flotte. */}
            <dl className="grid gap-px border border-[hsl(var(--trait)/var(--trait-a))] bg-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2 lg:grid-cols-3">
              {ATOUTS.map((atout, index) => (
                <Voile key={atout.titre} delai={echelonner(index)} className="bg-pierre p-6">
                  <dt>
                    <span className="cote block">{atout.intitule}</span>
                    <span className="mt-2.5 block font-serif text-[1.375rem] leading-[1.15]">{atout.titre}</span>
                  </dt>
                  <dd className="mt-2 text-[0.8125rem] leading-[1.5] text-muted-foreground">{atout.texte}</dd>
                </Voile>
              ))}
            </dl>
          </div>

          {/* L'observatoire des charges : une affiliation réelle, gardée. */}
          <div className="container mx-auto">
            <Voile delai={200} className="panneau mt-10 p-7 lg:p-8">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="text-[clamp(1.25rem,2vw,1.625rem)]">Observatoire des charges</h3>
                <p className="flex gap-2">
                  <span className="plaque">UNIS</span>
                  <span className="plaque">FNAIM</span>
                </p>
              </div>
              <p className="mesure-large mt-3 text-[0.9375rem] leading-relaxed text-ardoise">
                En collaboration avec UNIS et FNAIM, nous comparons les dépenses de votre copropriété à
                celles d'autres copropriétés pour une gestion optimale et des économies garanties.
              </p>
            </Voile>
          </div>
        </section>

        {/* ---- LE RÔLE DU SYNDIC -------------------------------------- */}
        <section className="bg-pierre py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection plaque="Le mandat" titre="Quel est le rôle du syndic ?" />
            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              {ROLES.map((role, index) => (
                <Voile key={role.titre} delai={echelonner(index)} className="border-t border-foreground pt-4">
                  <p className="cote">{role.cote}</p>
                  <h3 className="mt-2 text-[clamp(1.5rem,2vw,1.75rem)]">{role.titre}</h3>
                  <ul className="mt-3 space-y-1.5 text-[0.875rem] leading-[1.6] text-ardoise">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Voile>
              ))}
            </div>
          </div>
        </section>

        {/* ---- L'ACCÈS EN LIGNE : Gercop, en bloc de marine ----------
            Le service décrit est réel : les trois niveaux d'accès sont ceux
            du site en production, et l'URL de l'extranet vient de la source
            unique (`ESPACE_CLIENT`). */}
        <section className="bg-pierre pb-16 lg:pb-20">
          <div className="container mx-auto">
            <div className="nuit grid gap-x-8 gap-y-10 bg-marine p-8 text-pierre lg:grid-cols-4 lg:p-12">
              <Voile>
                <p className="gravure">Accès en ligne</p>
                <h2 className="mt-3 text-[clamp(1.75rem,2.6vw,2.125rem)] leading-[1.1]">
                  Votre copropriété en ligne
                </h2>
                <p className="mt-3 text-[0.875rem] leading-[1.5] text-muted-foreground">
                  Comptes et documents de l'immeuble sur Gercop, accessibles à toute heure.
                </p>
                {ESPACE_CLIENT.url && (
                  <Button className="mt-6" asChild>
                    <a href={ESPACE_CLIENT.url} target="_blank" rel="noopener noreferrer">
                      {ESPACE_CLIENT.libelle}
                      <ArrowUpRight aria-hidden />
                    </a>
                  </Button>
                )}
              </Voile>
              {ACCES.map((acces, index) => (
                <Voile
                  key={acces.titre}
                  delai={echelonner(index + 1)}
                  className="border-t border-[hsl(var(--trait)/var(--trait-a))] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
                >
                  <p className="cote">{acces.pour}</p>
                  <h3 className="mt-2 text-[1.375rem]">{acces.titre}</h3>
                  <ul className="mt-3 space-y-1 text-[0.8125rem] leading-[1.6] text-muted-foreground">
                    {acces.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Voile>
              ))}
            </div>
          </div>
        </section>

        <BandeauContact
          fond="lin"
          surtitre="Changer de syndic"
          titre="Parlons de votre immeuble."
          texte="Un interlocuteur regarde le dossier et vous dit ce qu'il en pense."
          action={{ libelle: 'Nous écrire', href: '/contact?service=gestion-copropriete' }}
          ordre="action"
        />
      </main>
      <Footer />
      <BarreAppel action={{ libelle: 'Nous écrire', href: '/contact?service=gestion-copropriete' }} />
    </div>
  );
};

export default GestionCopropriete;
