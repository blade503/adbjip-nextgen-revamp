import { ArrowRight, Phone } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SEOOptimizedImage from '@/components/SEOOptimizedImage';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { echelonner } from '@/lib/echelon';
import { ADRESSE } from '@/config/legal';
/**
 * TROIS LARGEURS POUR LE BANDEAU D'OUVERTURE.
 *
 * Mesuré avant : le seul fichier servi était le 1536 px, soit 116,7 Ko — envoyé
 * tel quel à un téléphone de 390 px de large, qui n'en affiche jamais plus de
 * 1170 px physiques et souvent 780. Les trois variantes sont produites depuis le
 * master PNG de `src/assets/`, qui reste en place et n'est jamais livré.
 *
 * `sizes="100vw"` est exact ici : le bandeau occupe toute la largeur de la fenêtre
 * à toutes les tailles. L'annoncer permet au navigateur de choisir AVANT de
 * connaître la mise en page, donc avant le premier rendu.
 */
import gestionLocativeImage from '@/assets/GestionLocative-large.webp';
import gestionLocativeImage1024 from '@/assets/GestionLocative-1024.webp';
import gestionLocativeImage700 from '@/assets/GestionLocative.webp';
const gestionLocativeImageSet = `${gestionLocativeImage700} 700w, ${gestionLocativeImage1024} 1024w, ${gestionLocativeImage} 1536w`;
import { Lien } from '@/components/systeme/Lien';

/**
 * GÉRANCE LOCATIVE — la page la plus visitée du site.
 *
 * Recomposée dans le langage de la charte. Le contenu rédactionnel est repris
 * MOT POUR MOT de la version précédente : les seize prestations et les huit
 * options viennent du mandat réel de l'agence, ce n'est pas de la matière qu'on
 * réécrit pour faire joli.
 *
 * CE QUI A ÉTÉ RETIRÉ, et pourquoi :
 *
 *  - « 8 % HT des loyers encaissés » figurait dans les données structurées
 *    (`offers.description`) ET dans la description meta. C'était un TARIF publié
 *    à Google, invisible sur la page, que personne n'avait validé. Un taux
 *    d'honoraires faux exposé en `schema.org` engage l'agence ; il est retiré.
 *    À remettre le jour où l'agence le confirme, et alors visiblement.
 *  - les quatre pastilles d'icônes en aplat de laiton et les quatre blocs de
 *    statistiques : décor de gabarit. Une liste réglée dit la même chose.
 *  - les titres en dégradé, `hover-glow`, `glass`, le centrage systématique.
 *
 * La numérotation de la méthode est CONSERVÉE : contrairement aux « 01 / 02 / 03 »
 * décoratifs, ces quatre étapes sont une vraie séquence — l'ordre y porte une
 * information que le lecteur a besoin d'avoir.
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
    'Revalorisation du loyer en fonction de l\'indice de référence des loyers et des facteurs économiques',
];

const DYNAMIQUE = [
    'Réalisation de l\'état des lieux d\'entrée et de sortie des locataires à l\'amiable avec reportage photos',
    'Gestion des congés des locataires: conformité du congé, régularisation des charges, restitution du dépôt de garantie',
    'Participation aux assemblées générales des copropriétaires, rapport sur le Procès Verbal',
    'En cas de litige concernant le bien, présence et représentation de votre voix devant les administrations et organisations publiques ou privées',
    'En cas de sinistre, démarches auprès des assurances et du locataire, gestion de l\'indemnité d\'assurance',
    'Demande de travaux entretien du locataire ou entreprise sous contrat, étude comparative',
    'Après accord de votre part, suivi de l\'exécution de tous les travaux entretiens ou indispensables, et règlement des factures associées',
    'Proposition d\'une solution très revalorisante pour améliorer l\'état de votre bien et faciliter sa relocation',
];

const OPTIONS = [
    'Constitution et suivi des dossiers de demandes de subventions ou de crédits',
    'Demande d\'établissement des diagnostics obligatoires ainsi que des documents indispensables à l\'information du locataire dans le cadre du Dossier de Diagnostic Technique',
    'Appels des loyers, encaissement des loyers, charges, dépôt de garantie, cautionnements, indemnité d\'occupation, assurances, provisions, subventions, avances sur travaux',
    'Règlement des charges de copropriétés, auprès du syndic ou ensemble des chargés d\'immeubles',
    'En cas de conflit ou de défaut de paiement du locataire, intervention pour toutes les poursuites judiciaires et envois aux locataires des commandements, sommations, assignation devant les tribunaux',
    'Établissement de la déclaration de revenus fonciers',
    'Établissement de la déclaration de TVA',
    'L\'ensemble des frais de gestion locative sont déductibles de vos revenus fonciers',
];

const ETAPES = [
  { titre: 'Analyse de votre bien', detail: "Évaluation précise et conseils d'optimisation" },
  { titre: 'Recherche de locataires', detail: "Diffusion d'annonces et présélection des candidats" },
  { titre: 'Signature du bail', detail: 'Accompagnement juridique et administratif complet' },
  { titre: 'Gestion au quotidien', detail: 'Suivi permanent et reporting mensuel détaillé' },
];

/**
 * Repères de l'ouverture : uniquement des faits vérifiables. Les chiffres de
 * performance (taux de satisfaction, délai moyen, volume géré) avaient été
 * retirés parce qu'ils étaient inventés — ils ne reviennent pas.
 */
const REPERES = [
  { valeur: 'Depuis 2011', libelle: 'Agence indépendante' },
  { valeur: 'Deux mandats', libelle: 'Sérénité et Dynamique' },
  { valeur: '16 prestations', libelle: '+ 8 options au choix' },
];

/** Une prestation : puce en filet de laiton, jamais une pastille d'icône. */
const Prestation = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3 last:border-0">
    <span aria-hidden className="mt-[0.7rem] h-px w-3 shrink-0 bg-primary-ink" />
    <span className="text-[0.9375rem] leading-relaxed">{children}</span>
  </li>
);

const GestionLocative = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  // Pas d'`offers` : un tarif ne se publie pas en données structurées sans que
  // l'agence l'ait confirmé. Voir l'en-tête du fichier.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Gérance locative — Paris 8ᵉ',
    description:
      "Gérance locative à Paris : recherche de locataire, bail, quittances, encaissement des loyers, régularisation des charges et suivi des travaux.",
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
        {/* ---- OUVERTURE ----------------------------------------------
            `nuit` est INDISPENSABLE et non décoratif : sans cette portée, le
            fond passe au sombre tandis que `--foreground` reste l'encre, et on
            obtient de l'encre sur du marine. Toute section sombre du site doit
            la porter.

            Le voile est CONSTRUIT : opaque à 96 % en haut où se trouve le
            texte, donc le contraste y est celui du fond plein. Et le texte est
            ferré à gauche, pas centré — un voile ne couvre une bande que si le
            texte s'y tient. */}
        <section className="nuit grain relative isolate overflow-hidden bg-nuit pb-20 pt-32 text-pierre lg:pb-28">
          <div className="absolute inset-0 -z-10">
            <SEOOptimizedImage
              src={gestionLocativeImage}
              srcSet={gestionLocativeImageSet}
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
              plaque="Gérance locative"
              titre={<>Vous gardez vos revenus,<br />nous gérons tout le reste.</>}
              chapeau="Recherche de locataire, bail, quittances, encaissement des loyers, régularisation des charges et suivi des travaux : un mandat, un interlocuteur."
            />

            <Voile delai={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#mandats-gestion">
                  Voir les deux mandats
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
            </Voile>

            {/* Trois repères, séparés par des filets verticaux. Les quatre
                pastilles d'icônes en aplat de laiton ont disparu : une pastille
                colorée par repère était du décor, et le plus daté du lot. */}
            <Voile delai={280}>
              <dl className="mt-14 grid max-w-[34rem] grid-cols-1 border-t border-pierre/15 sm:grid-cols-3">
                {REPERES.map(({ valeur, libelle }) => (
                  <div
                    key={valeur}
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

        {/* ---- LES DEUX MANDATS ------------------------------------- */}
        <section id="mandats-gestion" className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les mandats"
              titre="Deux mandats, seize prestations"
              chapeau="Le mandat Sérénité couvre l'administration du bien. Le mandat Dynamique y ajoute la vie du bail et des travaux, plus huit options."
            />

            <div className="mt-16 grid gap-x-16 gap-y-14 lg:grid-cols-2">
              <Voile>
                <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)]">Mandat Sérénité</h3>
                <p className="mesure mt-2 text-[0.9375rem] text-muted-foreground">
                  Gestion administrative complète de votre bien
                </p>
                <ul className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {SERENITE.map((x) => (
                    <Prestation key={x}>{x}</Prestation>
                  ))}
                </ul>
              </Voile>

              <Voile delai={80}>
                <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)]">Mandat Dynamique</h3>
                <p className="mesure mt-2 text-[0.9375rem] text-muted-foreground">
                  Des options complémentaires pour une location sécuritaire
                </p>
                <ul className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {DYNAMIQUE.map((x) => (
                    <Prestation key={x}>{x}</Prestation>
                  ))}
                </ul>
              </Voile>
            </div>
          </div>
        </section>

        {/* ---- LES OPTIONS ----------------------------------------- */}
        <section className="bg-ivoire py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les options"
              titre="Huit options, à prendre ou à laisser"
              chapeau="Elles s'ajoutent au mandat Dynamique, une par une, selon ce que vous voulez déléguer."
            />

            <ul className="mesure-large mt-14 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {OPTIONS.map((x, i) => (
                <Voile as="li" key={x} delai={echelonner(i)}>
                  <div className="flex gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-4">
                    <span className="tabulaire shrink-0 pt-[0.15rem] font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                      Option
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed">{x}</span>
                  </div>
                </Voile>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- LA MÉTHODE -------------------------------------------
            Les numéros sont conservés ici, contrairement aux « 01 / 02 / 03 »
            retirés ailleurs : ces quatre étapes sont une vraie séquence, et
            l'ordre y porte une information utile au lecteur. */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="La méthode"
              titre="Quatre étapes, dans cet ordre"
              chapeau="De la première visite du bien au reporting mensuel, le même interlocuteur suit le dossier."
            />

            <ol className="mt-14 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {ETAPES.map((etape, i) => (
                <Voile as="li" key={etape.titre} delai={echelonner(i)}>
                  <div className="grid gap-x-8 gap-y-1 border-b border-[hsl(var(--trait)/var(--trait-a))] py-6 sm:grid-cols-[4rem_1fr]">
                    <span className="tabulaire font-display text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary-ink">
                      Étape {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem]">{etape.titre}</h3>
                      <p className="mesure-large mt-1 text-[0.9375rem] text-muted-foreground">
                        {etape.detail}
                      </p>
                    </div>
                  </div>
                </Voile>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- LE RENDEZ-VOUS -------------------------------------- */}
        <section className="nuit grain relative bg-nuit py-20 text-pierre lg:py-28">
          <div className="container relative mx-auto">
            <EnTeteSection
              fond="nuit"
              plaque="Confier un bien"
              titre="Parlons de votre lot"
              chapeau="Un interlocuteur vous répond, regarde le bien et vous dit ce qu'il en pense. Sans engagement."
            />

            <Voile delai={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Lien to="/contact?service=gestion-locative">
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

export default GestionLocative;
