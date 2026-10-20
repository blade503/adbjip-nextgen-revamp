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
import hall640 from '@/assets/syndic-hall-640.webp';
import hall960 from '@/assets/syndic-hall-960.webp';
import hall1400 from '@/assets/syndic-hall-1400.webp';
import hall1840 from '@/assets/syndic-hall-1840.webp';

/**
 * L'IMAGE DE L'OUVERTURE (04/09/2026) : le vestibule d'un immeuble
 * haussmannien, vu de l'intérieur — carreaux de ciment, faux marbre, départ
 * d'escalier à rampe de fer, sas vitré ouvert sur la rue, un vélo. Les parties
 * communes sont l'objet exact du mandat de syndic, et la porte cochère fait
 * suite à celle de l'accueil, vue de l'autre côté.
 *
 * Image générée par le client (Gemini), troisième essai : le premier était un
 * plan d'architecte déroulé (« un architecte, pas un syndic »), le deuxième un
 * lobby large aux boîtes aux lettres américaines numérotées. Le prompt retenu
 * impose un couloir étroit et haut, un sas vitré, et PAS de boîtes aux
 * lettres — elles appellent des numéros, donc du texte. Recadrée en 4/3 sur
 * la source de 2752 × 1536, sans le tapis-brosse du premier plan, posé loin
 * de la porte. Dans le cadre 3/2 du téléphone, `object-fit` ne rogne que
 * 5,5 % en haut et en bas : la chaîne de la lanterne, rien d'autre.
 */
const IMAGE_HALL = {
  src: hall1400,
  srcSet: `${hall640} 640w, ${hall960} 960w, ${hall1400} 1400w, ${hall1840} 1840w`,
  alt: "Vestibule étroit et haut d'un immeuble haussmannien : sol en carreaux de ciment, murs en faux marbre, départ d'escalier en pierre à rampe de fer forgé et tapis rouge, lanterne suspendue, sas vitré ouvert sur la rue et l'immeuble d'en face ; un vélo appuyé au mur.",
  width: 1840,
  height: 1380,
};

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
 * LES TROIS PROMESSES SANS SOURCE ONT ÉTÉ TRANCHÉES par le client le
 * 20/10/2026 : « réduction significative des principaux postes de dépenses »
 * (remplacé, voir « Rigueur comptable »), « fournisseurs triés sur le volet »
 * (case retirée) et « économies garanties » (observatoire des charges : « on
 * ne veut pas garantir quelque chose qu'on n'est pas certains d'atteindre »).
 * Ne pas réintroduire de résultat promis sans chiffre ni source.
 */

/** Les six atouts, libellés tels quels — sauf quatre, retouchés par le client. */
const ATOUTS = [
  {
    titre: 'Suivi individuel',
    intitule: 'Personnalisé',
    // « de nos experts » retiré à la demande du client le 20/10/2026 : il ne
    // veut pas du mot « expert », et préfère parler de savoir-faire.
    texte:
      "Chaque copropriété bénéficie d'un accompagnement sur-mesure et d'une attention particulière, portés par notre savoir-faire.",
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
    // Réécrit par le client le 20/10/2026 : « réduction significative des
    // principaux postes de dépenses » n'avait pas de source, et le règlement
    // des prestataires sans retard a été écarté — il ne parle pas au
    // copropriétaire.
    texte:
      "Suivi de chaque facture reçue pour la copropriété, et adaptation de votre budget au plus juste coût pour l'entretien de votre patrimoine.",
  },
  {
    // Remplace « Analyse des charges », retirée par le client le 20/10/2026 ;
    // les cinq domaines du texte sont ceux qu'il a énumérés.
    titre: 'Conseil',
    intitule: 'Accompagnement',
    texte:
      "Entretien et préservation de l'immeuble, questions juridiques, comptables ou d'assurance : nous vous conseillons sur chacune.",
  },
  {
    // Remplace « Réseau fournisseurs » (« triés sur le volet », sans source),
    // retirée par le client le 20/10/2026 ; il voulait communication et
    // transparence. « Transparent » est déjà le titre de la deuxième case :
    // celle-ci parle de communication, la transparence y est concrète — la
    // consultation en ligne, décrite plus bas (`ACCES`, extranet Gercop).
    titre: 'Copropriété informée',
    intitule: 'Communication',
    texte:
      'Vous savez ce qui se passe dans votre immeuble : décisions, travaux, comptes. Documents et situation comptable restent consultables en ligne, à toute heure.',
  },
];

/** Les trois volets du mandat de syndic, et ce que chacun couvre. */
const ROLES = [
  {
    cote: 'I',
    titre: 'Administratif',
    // « Préparation de l'assemblée générale » ajouté par le client le
    // 20/10/2026, placé avant la mise en œuvre de ses décisions : l'ordre de
    // l'année du syndic.
    points: [
      'Préservation du patrimoine',
      "Préparation de l'assemblée générale",
      "Mise en œuvre des décisions d'AG",
      "Gestion du quotidien et de l'avenir",
    ],
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
    serviceType: 'Syndic de copropriété',
    areaServed: 'Paris',
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Syndic de copropriété à Paris — Jobard Immobilier"
        description="Syndic de copropriété à Paris depuis 1978 : assemblées générales, comptabilité, travaux, comptes de l'immeuble en ligne. 27 rue de Lisbonne, Paris 8e."
        keywords="syndic copropriété paris, syndic paris 8, assemblée générale, appels de fonds, gestion copropriété"
        canonicalUrl="https://www.adbjip.fr/services/gestion-copropriete"
        structuredData={[
          structuredData,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.adbjip.fr/' },
              { '@type': 'ListItem', position: 2, name: 'Syndic de copropriété', item: 'https://www.adbjip.fr/services/gestion-copropriete' },
            ],
          },
        ]}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        <EnTetePage
          surtitre="Syndic de copropriété · depuis 1978"
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
          /* L'image de banque (hall aux boîtes aux lettres) était générée et
             faisait fausse ; le dessin d'élévation (`Ferronnerie`) l'a
             remplacée un après-midi. Depuis le soir du 04/09, le vestibule
             choisi par le client — voir IMAGE_HALL. */
          image={IMAGE_HALL}
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
                Syndic de copropriétés parisiennes depuis 1978, JIP s'impose comme le partenaire de
                confiance pour la préservation et la valorisation de votre patrimoine immobilier.
              </p>
            </Voile>

            {/* Six cases séparées par un filet d'un pixel : le fond de la
                grille est le trait, les cases le recouvrent. Une grille de
                cartes sans rien qui flotte.
                SIX, ET PAS UN AUTRE NOMBRE SANS Y PENSER : six remplit les
                deux grilles (2 × 3 et 3 × 2). Une case vide laisserait voir
                le fond, donc un aplat de trait — avec cinq, le 20/10/2026, il
                avait fallu étirer la dernière (`sm:last:col-span-2`). */}
            <dl className="grid gap-px border border-[hsl(var(--trait)/var(--trait-a))] bg-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2 lg:grid-cols-3">
              {ATOUTS.map((atout, index) => (
                <Voile key={atout.titre} delai={echelonner(index)} className="bg-pierre p-6">
                  <dt>
                    <span className="cote block">{atout.intitule}</span>
                    <span className="mt-2.5 block font-serif text-[1.375rem] leading-[1.15]">{atout.titre}</span>
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-[1.5] text-muted-foreground">{atout.texte}</dd>
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
                celles d'autres copropriétés pour une gestion optimale et pour repérer les économies
                possibles.
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
                  <ul className="mt-3 space-y-1.5 text-[1rem] leading-[1.6] text-ardoise">
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
                {/* « L'extranet » et non « Gercop » (client, 20/10/2026) : le
                    texte ne nomme pas l'éditeur du logiciel, et ne sera pas à
                    reprendre si l'agence en change. Seule l'URL, dans
                    `ESPACE_CLIENT`, suit le prestataire. */}
                <p className="mt-3 text-[1rem] leading-[1.5] text-muted-foreground">
                  Comptes et documents de l'immeuble sur l'extranet, accessibles à toute heure.
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
                  <ul className="mt-3 space-y-1 text-[0.9375rem] leading-[1.6] text-muted-foreground">
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
