import { ArrowRight } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BandeauContact from '@/components/systeme/BandeauContact';
import BarreAppel from '@/components/systeme/BarreAppel';
import EnTetePage from '@/components/systeme/EnTetePage';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';
import { cn } from '@/lib/utils';
/**
 * TROIS LARGEURS POUR L'IMAGE D'OUVERTURE. Le master PNG de `src/assets/`
 * reste en place et n'est jamais livré. L'image occupe une colonne sur deux
 * dès lg : `sizes` le dit.
 */
import gestionLocativeImage from '@/assets/GestionLocative-large.webp';
import gestionLocativeImage1024 from '@/assets/GestionLocative-1024.webp';
import gestionLocativeImage700 from '@/assets/GestionLocative.webp';

const gestionLocativeImageSet = `${gestionLocativeImage700} 700w, ${gestionLocativeImage1024} 1024w, ${gestionLocativeImage} 1536w`;

/**
 * GÉRANCE LOCATIVE — la page la plus visitée du site, planche 2b de la
 * direction « La Plaque ».
 *
 * LE CONTENU RÉDACTIONNEL EST REPRIS MOT POUR MOT : les seize prestations et
 * les huit options viennent du mandat réel de l'agence. La planche les
 * abrégeait pour tenir dans ses cartes ; on garde les libellés de l'agence,
 * c'est la mise en page qui s'adapte, pas le mandat.
 *
 * CE QUI A ÉTÉ RETIRÉ, et pourquoi (décisions antérieures, conservées) :
 *  - « 8 % HT des loyers encaissés » figurait dans les données structurées.
 *    C'était un TARIF publié à Google que personne n'avait validé. À remettre
 *    le jour où l'agence le confirme, et alors visiblement.
 *  - les chiffres de performance (satisfaction, délai moyen, volume géré)
 *    étaient inventés — ils ne reviennent pas.
 *
 * La numérotation de la méthode est CONSERVÉE : ces quatre étapes sont une
 * vraie séquence, l'ordre y porte une information.
 */

/** Les seize prestations du mandat, telles que l'agence les libelle. */
const SERENITE = [
  'Gestion Administrative du bien',
  'Recherche du locataire / étude de solvabilité',
  'Rédaction, renouvellement, actualisation des loyers',
  'États des lieux',
  'Résiliation du bail',
  'Contrôle et validation des assurances obligatoires pour le locataire',
  'Rédaction des avenants (baux commerciaux)',
  "Revalorisation du loyer en fonction de l'indice de référence des loyers et des facteurs économiques",
];

const DYNAMIQUE = [
  "Réalisation de l'état des lieux d'entrée et de sortie des locataires à l'amiable avec reportage photos",
  'Gestion des congés des locataires: conformité du congé, régularisation des charges, restitution du dépôt de garantie',
  'Participation aux assemblées générales des copropriétaires, rapport sur le Procès Verbal',
  'En cas de litige concernant le bien, présence et représentation de votre voix devant les administrations et organisations publiques ou privées',
  "En cas de sinistre, démarches auprès des assurances et du locataire, gestion de l'indemnité d'assurance",
  'Demande de travaux entretien du locataire ou entreprise sous contrat, étude comparative',
  "Après accord de votre part, suivi de l'exécution de tous les travaux entretiens ou indispensables, et règlement des factures associées",
  "Proposition d'une solution très revalorisante pour améliorer l'état de votre bien et faciliter sa relocation",
];

const OPTIONS = [
  'Constitution et suivi des dossiers de demandes de subventions ou de crédits',
  "Demande d'établissement des diagnostics obligatoires ainsi que des documents indispensables à l'information du locataire dans le cadre du Dossier de Diagnostic Technique",
  "Appels des loyers, encaissement des loyers, charges, dépôt de garantie, cautionnements, indemnité d'occupation, assurances, provisions, subventions, avances sur travaux",
  "Règlement des charges de copropriétés, auprès du syndic ou ensemble des chargés d'immeubles",
  'En cas de conflit ou de défaut de paiement du locataire, intervention pour toutes les poursuites judiciaires et envois aux locataires des commandements, sommations, assignation devant les tribunaux',
  'Établissement de la déclaration de revenus fonciers',
  'Établissement de la déclaration de TVA',
  "L'ensemble des frais de gestion locative sont déductibles de vos revenus fonciers",
];

const ETAPES = [
  { titre: 'Analyse de votre bien', detail: "Évaluation précise et conseils d'optimisation" },
  { titre: 'Recherche de locataires', detail: "Diffusion d'annonces et présélection des candidats" },
  { titre: 'Signature du bail', detail: 'Accompagnement juridique et administratif complet' },
  { titre: 'Gestion au quotidien', detail: 'Suivi permanent et reporting mensuel détaillé' },
];

/** Une carte de mandat : cote, nom en romain, sous-titre, puis la liste réglée. */
const Mandat = ({
  cote,
  nom,
  resume,
  prestations,
  marine,
  delai,
}: {
  cote: string;
  nom: string;
  resume: string;
  prestations: string[];
  marine?: boolean;
  delai?: number;
}) => (
  <Voile delai={delai} className={cn('flex flex-col p-7 lg:p-8', marine ? 'nuit bg-marine text-pierre' : 'panneau')}>
    <p className="cote">{cote}</p>
    <h3 className="mt-2 text-[clamp(1.75rem,2.4vw,2rem)]">{nom}</h3>
    <p className="mt-1.5 text-[0.875rem] text-muted-foreground">{resume}</p>
    <ul className="mt-5 border-t border-[hsl(var(--trait)/var(--trait-a))]">
      {prestations.map((x) => (
        <li
          key={x}
          className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5 text-[0.875rem] leading-[1.5] last:border-0"
        >
          {x}
        </li>
      ))}
    </ul>
  </Voile>
);

const GestionLocative = () => {
  // Pas d'`offers` : un tarif ne se publie pas en données structurées sans que
  // l'agence l'ait confirmé.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Gérance locative — Paris 8ᵉ',
    description:
      'Gérance locative à Paris : recherche de locataire, bail, quittances, encaissement des loyers, régularisation des charges et suivi des travaux.',
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
    serviceType: 'Gérance locative',
    areaServed: 'Paris',
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Gérance locative — JIP, Paris 8ᵉ"
        description="Gérance locative au 27 rue de Lisbonne, Paris 8ᵉ : recherche de locataire, bail, quittances, encaissement des loyers, charges et travaux. Un mandat, un interlocuteur."
        keywords="gérance locative paris, gestion locative paris 8, encaissement loyers, sélection locataires, mandat de gestion"
        canonicalUrl="https://www.adbjip.fr/services/gestion-locative"
        structuredData={structuredData}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        <EnTetePage
          surtitre="Gérance locative"
          titre={
            <>
              Vous gardez vos revenus, <em>nous gérons tout le reste.</em>
            </>
          }
          chapeau="Recherche de locataire, bail, quittances, encaissement des loyers, régularisation des charges et suivi des travaux : un mandat, un interlocuteur."
          actions={
            <>
              <Button size="lg" asChild>
                <Lien to="/contact?service=gestion-locative">
                  Confier un bien
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#mandats-gestion">Voir les deux mandats</a>
              </Button>
            </>
          }
          image={{
            src: gestionLocativeImage,
            srcSet: gestionLocativeImageSet,
            alt: '',
            width: 1536,
            height: 1024,
          }}
        />

        {/* ---- LES DEUX MANDATS ------------------------------------- */}
        <section id="mandats-gestion" className="scroll-mt-24 bg-lin py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les mandats"
              titre="Deux mandats, seize prestations"
              chapeau="Le mandat Sérénité couvre l'administration du bien. Le mandat Dynamique y ajoute la vie du bail et des travaux, plus huit options."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Mandat
                cote="Mandat I"
                nom="Sérénité"
                resume="Gestion administrative complète de votre bien"
                prestations={SERENITE}
              />
              <Mandat
                cote="Mandat II"
                nom="Dynamique"
                resume="Sérénité, plus la vie du bail, les travaux et huit options au choix"
                prestations={DYNAMIQUE}
                marine
                delai={80}
              />
            </div>
          </div>
        </section>

        {/* ---- LES OPTIONS ----------------------------------------- */}
        <section className="bg-pierre py-16 lg:py-20">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <Voile>
              <p className="gravure">Les options</p>
              <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">Huit options, à prendre ou à laisser</h2>
              <p className="mesure mt-4 text-[1rem] leading-[1.55] text-ardoise">
                Elles s'ajoutent au mandat Dynamique, une par une, selon ce que vous voulez déléguer.
              </p>
            </Voile>
            <ol className="grid border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2 sm:gap-x-10">
              {OPTIONS.map((x, i) => (
                <Voile
                  as="li"
                  key={x}
                  delai={echelonner(i)}
                  className="flex gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3.5"
                >
                  <span className="cote shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[0.875rem] leading-[1.5] text-ardoise">{x}</span>
                </Voile>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- LA MÉTHODE ------------------------------------------- */}
        <section className="bg-pierre pb-16 lg:pb-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="La méthode"
              titre="Quatre étapes, dans cet ordre"
              chapeau="De la première visite du bien au reporting mensuel, le même interlocuteur suit le dossier."
            />
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {ETAPES.map((etape, i) => (
                <Voile as="li" key={etape.titre} delai={echelonner(i)}>
                  <p className="font-serif text-[3rem] leading-none text-primary-display" aria-hidden>
                    {i + 1}
                  </p>
                  <h3 className="mt-3 font-sans text-[1rem] font-semibold">
                    <span className="sr-only">Étape {i + 1} : </span>
                    {etape.titre}
                  </h3>
                  <p className="mt-1.5 text-[0.875rem] leading-[1.5] text-muted-foreground">{etape.detail}</p>
                </Voile>
              ))}
            </ol>
          </div>
        </section>

        <BandeauContact
          titre="Parlons de votre lot."
          texte="Un interlocuteur vous répond, regarde le bien et vous dit ce qu'il en pense. Sans engagement."
          action={{ libelle: 'Nous écrire', href: '/contact?service=gestion-locative' }}
        />
      </main>
      <Footer />
      <BarreAppel action={{ libelle: 'Confier', href: '/contact?service=gestion-locative' }} />
    </div>
  );
};

export default GestionLocative;
