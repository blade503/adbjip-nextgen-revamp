import { ArrowRight, ArrowUpRight } from 'lucide-react';

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
import { ADRESSE, ESPACE_CLIENT } from '@/config/legal';
import { echelonner } from '@/lib/echelon';
import cles640 from '@/assets/gerance-cles-640.webp';
import cles960 from '@/assets/gerance-cles-960.webp';
import cles1400 from '@/assets/gerance-cles-1400.webp';
import cles2000 from '@/assets/gerance-cles-2000.webp';

/**
 * L'IMAGE DE L'OUVERTURE (04/09/2026) : la remise des clés. Deux mains
 * au-dessus d'un bureau, un trousseau à étiquette vierge, une chemise fermée
 * et un stylo, la fenêtre sur la rue. Image générée par le client (Gemini),
 * troisième essai : le premier était un bureau de particulier, le deuxième
 * posait un état des lieux dont on lisait le titre — l'IA écrit du texte dès
 * qu'on lui montre une page ouverte, d'où la chemise FERMÉE du prompt.
 * Recadrée en 3/2 sur la source de 2752 × 1536 : le même fichier sert les
 * deux cadres d'`EnTetePage`, 3/2 sous le titre sur téléphone et 4/3 sur
 * bureau où `object-fit` ne rogne que les côtés — la fenêtre et le stylo
 * restent dans le champ aux deux largeurs.
 */
const IMAGE_CLES = {
  src: cles1400,
  srcSet: `${cles640} 640w, ${cles960} 960w, ${cles1400} 1400w, ${cles2000} 2000w`,
  alt: "Au-dessus d'un bureau en bois sombre, une main en veste bleue tend un trousseau de clés à étiquette vierge à une autre main en veste grise ; dessous, une chemise cartonnée fermée et un stylo plume ; derrière, une fenêtre à petits carreaux sur un immeuble en pierre.",
  width: 1400,
  height: 933,
};

/**
 * GÉRANCE LOCATIVE — la page la plus visitée du site, planche 2b de la
 * direction « La Plaque ».
 *
 * RÉÉCRITE LE 20/10/2026 SUR LE MANDAT TYPE DE L'AGENCE (« mandat type 2026 à
 * 6 % option GLI + sécurité 10 », PDF transmis par le client). Tout ce que la
 * page affirme en vient : les pouvoirs du mandataire, la reddition des
 * comptes, la durée, les deux options et leurs taux.
 *
 * CE QUI A DISPARU, et pourquoi :
 *  - les deux mandats « Sérénité » et « Dynamique » et leurs seize
 *    prestations, repris de l'ancien site : le mandat réel est UNIQUE. Le
 *    texte est conservé dans l'historique git et dans REPRISE.md ;
 *  - les cinq options (subventions, revenus fonciers, TVA…) : le mandat n'en
 *    connaît que deux, la garantie de versement et l'assurance loyers impayés.
 *    Les subventions et la représentation devant les administrations sont
 *    des pouvoirs du mandat, elles passent dans « Démarches » ;
 *  - la méthode en quatre étapes, qui promettait un « reporting mensuel » :
 *    le mandat type rend compte chaque TRIMESTRE. Le client précise le
 *    20/10/2026 que le mois est aussi possible : la page dit désormais « chaque
 *    mois ou chaque trimestre », partout où elle disait « trimestre » seul ;
 *  - les avenants de baux commerciaux : ce mandat type vise l'habitation.
 *
 * L'ENCAISSEMENT DES LOYERS REVIENT, barré par le client le 12/10/2026 : le
 * mandat le prévoit en toutes lettres, et la garantie du 10 du mois n'a pas de
 * sens sans lui. Confirmé le 20/10/2026.
 *
 * LE TAUX DE GESTION N'EST PAS PUBLIÉ. Le mandat type porte 6 % HT, mais le
 * client précise qu'il se négocie bien par bien : afficher 6 % promettrait un
 * prix qui n'est pas celui de tous. La page dit donc que le taux est fixé au
 * mandat, et renvoie à l'agence. Les deux options, elles, ont un taux fixe,
 * qui était publié dans leurs cartes — RETIRÉ LE 20/10/2026 (client) : il est
 * fixé par le partenaire assureur, pas par l'agence, et l'afficher sous le
 * nom de l'agence prêtait à confusion sur les montants.
 */

/** Les pouvoirs du mandat, regroupés en quatre temps — libellés du mandat, raccourcis. */
const MISSIONS = [
  {
    cote: 'I',
    titre: 'Louer',
    points: [
      'Recherche du locataire, annonces et visites',
      'Signature et renouvellement du bail',
      'États des lieux',
      'Révision du loyer',
      'Congés donnés et reçus',
    ],
  },
  {
    cote: 'II',
    // « Encaissement et règlement », et non l'infinitif des trois autres :
    // titre demandé par le client le 20/10/2026 — le reversement au bailleur
    // fait partie de ce temps autant que l'encaissement.
    titre: 'Encaissement et règlement',
    // Le dépôt de garantie rejoint l'appel des loyers en un seul point
    // (client, 20/10/2026) : ce sont les mêmes sommes, appelées au même
    // locataire.
    points: [
      'Appel et encaissement des loyers, des charges et du dépôt de garantie',
      'Quittances',
      // Ajouté par le client le 20/10/2026 — le « règlement » du titre. Placé
      // avant le compte rendu, qui en rend compte.
      'Règlement des charges de copropriété et des fournisseurs',
      'Compte rendu et reversement, chaque mois ou chaque trimestre',
    ],
  },
  {
    cote: 'III',
    titre: 'Protéger',
    points: [
      // Ajouté par le client le 20/10/2026, dans « Protéger » et non « Louer »
      // à sa demande : le contrôle du dossier est la première protection
      // contre l'impayé, d'où sa place en tête.
      'Contrôle des dossiers locatifs',
      'Relances et poursuites en cas d’impayé',
      'Respect des clauses du bail',
      'Assurances du bien',
      // « Suivi », et non « Déclaration » (client, 20/10/2026) : c'est le
      // locataire ou le propriétaire qui déclare le sinistre, pas l'agence.
      'Suivi des sinistres et procédures',
    ],
  },
  {
    cote: 'IV',
    titre: 'Entretenir',
    points: [
      'Devis et travaux d’entretien, avec votre accord',
      'Remise en état entre deux locations',
      'Urgences traitées sans attendre, puis signalées',
    ],
  },
];

/** « Autres dispositions » du mandat. */
const DEMARCHES = [
  'Diagnostics obligatoires',
  'Demandes de subvention (Anah)',
  'Représentation devant les organismes publics et privés',
  'Déclarations à l’observatoire des loyers',
];

/** Les deux options du mandat type — sans leur taux, fixé par l'assureur. */
const OPTIONS = [
  {
    cote: 'Option I',
    titre: 'Votre loyer le 10 du mois',
    texte:
      "L'acompte mensuel convenu vous est versé le 10, même si le locataire paie en retard ou ne paie pas.",
    detail:
      "Jusqu'à trois mois sans assurance loyers impayés, jusqu'au plafond de l'assurance si vous la souscrivez.",
  },
  {
    cote: 'Option II',
    titre: 'Assurance loyers impayés',
    texte: 'Une assurance Odealim souscrite avec le mandat, qui couvre :',
    garanties: ['Les loyers impayés', 'Les détériorations immobilières', 'La protection juridique'],
  },
];

/** La grille des honoraires : seuls les taux fixés par le mandat type ont un chiffre. */
const HONORAIRES = [
  { libelle: 'Gestion courante', detail: 'Sur les sommes encaissées', valeur: 'Fixé au mandat' },
  { libelle: 'Loyer le 10 du mois', detail: 'Option I', valeur: '+ 1 % HT' },
  // Le taux reste ici, et lui seul : c'est la grille des honoraires. Mais il
  // est fixé par l'assureur, et l'agence ne s'y engage pas (client,
  // 20/10/2026) — d'où la précision, et son retrait de la carte de l'option.
  {
    libelle: 'Assurance loyers impayés',
    detail: 'Option II · soumis à variation selon le partenaire',
    valeur: '2,40 % TTC',
  },
];

const ENGAGEMENT = [
  { titre: 'Un an', texte: 'Le mandat court un an à compter de sa signature.' },
  { titre: "Puis d'année en année", texte: 'Il se renouvelle seul, sauf résiliation.' },
  {
    titre: 'Résiliable',
    texte: "Par lettre recommandée, trois mois avant l'échéance, par vous comme par nous.",
  },
  {
    titre: 'Des comptes au mois ou au trimestre',
    texte: "L'état détaillé de ce qui a été reçu et dépensé, et le reversement qui l'accompagne.",
  },
];

const GestionLocative = () => {
  // Pas d'`offers` : le taux de gestion se fixe au mandat, il n'y a pas de
  // prix unique à publier en données structurées.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Gérance locative — Paris 8ᵉ',
    description:
      'Gérance locative à Paris : recherche du locataire, bail, encaissement des loyers, travaux, compte rendu chaque mois ou chaque trimestre. Loyer versé le 10 du mois et assurance loyers impayés en option.',
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
    serviceType: 'Gérance locative',
    areaServed: 'Paris',
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Gérance locative à Paris — Jobard Immobilier"
        description="Gérance locative au 27 rue de Lisbonne, Paris 8ᵉ : locataire, bail, loyers, travaux, comptes au mois ou au trimestre. En option, votre loyer le 10 du mois, payé ou non."
        keywords="gérance locative paris, gestion locative paris 8, loyer garanti, assurance loyers impayés, mandat de gestion"
        canonicalUrl="https://www.adbjip.fr/services/gestion-locative"
        structuredData={[
          structuredData,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.adbjip.fr/' },
              { '@type': 'ListItem', position: 2, name: 'Gérance locative', item: 'https://www.adbjip.fr/services/gestion-locative' },
            ],
          },
        ]}
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
          chapeau="Le locataire, le bail, les loyers, les travaux et les comptes : un seul mandat, un seul interlocuteur."
          actions={
            <>
              <Button size="lg" asChild>
                <Lien to="/contact?service=gestion-locative">
                  Confier un bien
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#mandat">Ce que couvre le mandat</a>
              </Button>
            </>
          }
          /* PLUS DE REPÈRES SOUS LES BOUTONS (client, 20/10/2026) : « Le 10 »,
             « Trimestriels » et « 1 an » redisaient ce que les options,
             l'engagement et le mandat détaillent plus bas — et
             « Trimestriels » était devenu inexact, le mois étant possible. */
          /* L'image de banque (clés et bail) était générée et faisait fausse ;
             le dessin d'élévation (`Ferronnerie`) l'a remplacée un après-midi.
             Depuis le soir du 04/09, la remise des clés choisie par le client. */
          image={IMAGE_CLES}
        />

        {/* ---- LE MANDAT : quatre temps, puis les démarches ------------ */}
        <section id="mandat" className="scroll-mt-24 bg-lin py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Le mandat"
              titre="Un mandat, tout ce qu'il couvre"
              chapeau="Ce que vous nous confiez en signant, dans l'ordre où cela arrive : louer, encaisser, protéger, entretenir."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MISSIONS.map((mission, index) => (
                <Voile key={mission.titre} delai={echelonner(index)} className="panneau flex flex-col p-6 lg:p-7">
                  <p className="cote">{mission.cote}</p>
                  <h3 className="mt-2 text-[clamp(1.625rem,2.2vw,1.875rem)]">{mission.titre}</h3>
                  <ul className="mt-4 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                    {mission.points.map((point) => (
                      <li
                        key={point}
                        className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5 text-[0.9375rem] leading-[1.45] text-ardoise last:border-0"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </Voile>
              ))}
            </div>

            <Voile delai={200} className="mt-8 flex flex-col gap-x-8 gap-y-3 border-t border-foreground pt-5 lg:flex-row lg:items-baseline">
              <p className="gravure shrink-0">Et les démarches</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-ardoise">
                {DEMARCHES.map((demarche) => (
                  <li key={demarche}>{demarche}</li>
                ))}
              </ul>
            </Voile>

            {/* L'extranet est ouvert aux propriétaires aussi (client,
                20/10/2026). Même adresse que pour le syndic, confirmée par le
                client le même jour : `ESPACE_CLIENT`, source unique. On ne liste
                pas ce qu'on y trouve — rien ne le documente ; seule la
                consultation du compte est affirmée. */}
            {ESPACE_CLIENT.url && (
              <Voile
                delai={200}
                className="mt-5 flex flex-col gap-x-8 gap-y-3 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-5 lg:flex-row lg:items-baseline"
              >
                <p className="gravure shrink-0">Votre compte en ligne</p>
                <p className="text-[0.9375rem] leading-[1.55] text-ardoise">
                  Votre compte de gérance est consultable sur l'extranet de l'agence.{' '}
                  <a
                    href={ESPACE_CLIENT.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lien-trait font-semibold text-foreground"
                  >
                    {ESPACE_CLIENT.libelle}
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </p>
              </Voile>
            )}
          </div>
        </section>

        {/* ---- LES OPTIONS : le bloc appuyé de la page ------------------
            Les deux garanties sont ce qu'un bailleur compare d'une agence à
            l'autre : elles prennent le marine. Leur taux n'y figure plus
            (20/10/2026) : c'est l'assureur qui le fixe. */}
        <section id="options" className="scroll-mt-24 bg-pierre py-16 lg:py-20">
          <div className="container mx-auto">
            <div className="nuit bg-marine p-8 text-pierre lg:p-12">
              <EnTeteSection
                plaque="Les options"
                titre="Deux garanties, à ajouter au mandat"
                chapeau="Pour que le loyer arrive à date, même quand le locataire ne paie pas."
              />
              <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-2">
                {OPTIONS.map((option, index) => (
                  <Voile
                    key={option.titre}
                    delai={echelonner(index)}
                    className="flex flex-col border-t border-[hsl(var(--trait)/var(--trait-a))] pt-6"
                  >
                    <p className="cote">{option.cote}</p>
                    <h3 className="mt-2 text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]">{option.titre}</h3>
                    <p className="mt-3 text-[1rem] leading-[1.55]">{option.texte}</p>
                    {option.garanties && (
                      <ul className="mt-3 space-y-1.5 text-[1rem] leading-[1.5]">
                        {option.garanties.map((garantie) => (
                          <li key={garantie} className="flex gap-3">
                            <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-primary" />
                            {garantie}
                          </li>
                        ))}
                      </ul>
                    )}
                    {option.detail && (
                      <p className="mt-3 text-[0.9375rem] leading-[1.55] text-muted-foreground">{option.detail}</p>
                    )}
                  </Voile>
                ))}
              </div>
              <p className="mt-10 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-5 text-[0.9375rem] leading-[1.55] text-muted-foreground">
                Les deux se cumulent : avec l'assurance, le versement du 10 est garanti jusqu'à son
                plafond, et non plus trois mois.
              </p>
            </div>
          </div>
        </section>

        {/* ---- LES HONORAIRES ------------------------------------------- */}
        <section className="bg-pierre pb-16 lg:pb-20">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <Voile>
              <p className="gravure">Les honoraires</p>
              <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">Un taux fixé avec vous</h2>
              <p className="mesure mt-4 text-[1rem] leading-[1.55] text-ardoise">
                La gestion courante est rémunérée par un pourcentage des sommes encaissées. Il dépend
                du bien et de ce que vous nous confiez : nous le fixons ensemble, de vive voix, avant
                de signer.
              </p>
              <Button className="mt-6" asChild>
                <Lien to="/contact?service=gestion-locative">
                  En parler avec nous
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
            </Voile>

            <Voile delai={90}>
              <dl className="border-t border-foreground">
                {HONORAIRES.map((ligne) => (
                  <div
                    key={ligne.libelle}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[hsl(var(--trait)/var(--trait-a))] py-4"
                  >
                    <dt>
                      <span className="block font-serif text-[1.375rem] leading-[1.15]">{ligne.libelle}</span>
                      <span className="mt-0.5 block text-[0.875rem] text-muted-foreground">{ligne.detail}</span>
                    </dt>
                    <dd className="tabulaire font-display text-[1.125rem] font-semibold">{ligne.valeur}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                TVA en sus au taux en vigueur. Les honoraires sont prélevés sur chaque relevé de
                compte ; les prestations complémentaires suivent le tarif affiché à l'agence, remis
                avec le mandat. Les honoraires de location à la charge du locataire sont fixés par la
                loi.
              </p>
            </Voile>
          </div>
        </section>

        {/* ---- L'ENGAGEMENT --------------------------------------------- */}
        <section className="bg-lin py-16 lg:py-20">
          <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
            <Voile>
              <p className="gravure">L'engagement</p>
              <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">Un an, puis d'année en année</h2>
            </Voile>
            <dl className="grid border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2">
              {ENGAGEMENT.map((e, index) => (
                <Voile
                  key={e.titre}
                  delai={echelonner(index)}
                  className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-6 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <dt className="font-serif text-[1.5rem] leading-[1.1]">{e.titre}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-[1.5] text-ardoise">{e.texte}</dd>
                </Voile>
              ))}
            </dl>
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
