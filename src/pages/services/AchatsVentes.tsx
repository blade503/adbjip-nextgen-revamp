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
 * Le seul fichier servi était le 1536 px, soit 106,5 Ko, envoyé tel quel à un
 * téléphone. Les variantes viennent du master PNG, qui reste en place et n'est
 * jamais livré. `sizes="100vw"` est exact : le bandeau occupe toute la largeur.
 */
import AchatVenteImage from '@/assets/VenteDeBiens-large.webp';
import AchatVenteImage1024 from '@/assets/VenteDeBiens-1024.webp';
import AchatVenteImage700 from '@/assets/VenteDeBiens.webp';

const AchatVenteImageSet = `${AchatVenteImage700} 700w, ${AchatVenteImage1024} 1024w, ${AchatVenteImage} 1536w`;

/**
 * ACHATS ET VENTES — recomposée dans le langage de la charte.
 *
 * TOUT LE TEXTE EST REPRIS MOT POUR MOT : les huit prestations de vente, les
 * huit d'achat, les quatre étapes de la méthode et les trois arguments.
 *
 * CE QUI A CHANGÉ EST LA FORME. Relevé avant : 39 vestiges de gabarit —
 * 8 centrages, 6 pastilles d'icônes en aplat, 6 `glass`, 5 `gradient-text`,
 * 5 rayons hors charte, 4 ombres portées, 3 `hover-lift`, 2 fonds en dégradé.
 *
 *  - le centrage → tout ferré à gauche, cinq en-têtes passés par
 *    `EnTeteSection` : plaque vissée, filet qui court, mesure de 46 caractères.
 *  - les pastilles d'icônes → des filets de laiton, et pour la méthode un
 *    numéro d'étape en capitales espacées. La numérotation est CONSERVÉE : ces
 *    quatre étapes sont une vraie séquence, l'ordre y porte une information,
 *    contrairement aux « 01 / 02 / 03 » décoratifs retirés ailleurs.
 *  - les grilles de cartes égales → des registres réglés.
 *  - `gradient-text` sur un mot de chaque titre → le titre entier en encre. Le
 *    laiton ne fait que 1,81:1 sur la pierre en texte ; il reste sur la plaque.
 *  - le h1 « Achats & Ventes » → casse de phrase. C'était la dernière capitale
 *    interne du site.
 *  - `bg-gradient-subtle` → l'alternance nuit / pierre / ivoire.
 */

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

const ETAPES = [
  { titre: 'Analyse', detail: 'Étude de vos besoins et définition de la stratégie optimale' },
  { titre: 'Recherche', detail: 'Prospection active et mise en relation avec les bons profils' },
  { titre: 'Négociation', detail: 'Négociation experte pour obtenir les meilleures conditions' },
  { titre: 'Finalisation', detail: "Accompagnement jusqu'à la signature définitive" },
];

const ATOUTS = [
  {
    titre: 'Syndic et vendeur',
    texte:
      "Nous administrons des immeubles que nous vendons aussi : charges, travaux votés, procédures en cours, le dossier est connu avant l'acquéreur.",
  },
  {
    titre: 'Négociation experte',
    texte: "Optimisation des conditions d'achat et de vente grâce à notre expertise.",
  },
  {
    titre: 'Sécurité juridique',
    texte: 'Vérifications approfondies et accompagnement juridique complet.',
  },
];

/** Une prestation : filet de laiton en puce, jamais un pictogramme. */
const Prestation = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3 last:border-0">
    <span aria-hidden className="mt-[0.7rem] h-px w-3 shrink-0 bg-primary-ink" />
    <span className="text-[0.9375rem] leading-relaxed">{children}</span>
  </li>
);

const AchatsVentes = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Achat et vente immobilière — Paris 8ᵉ',
    description:
      "Accompagnement de l'estimation à la signature chez le notaire, pour vendre ou acheter à Paris.",
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
    serviceType: 'Transaction immobilière',
    areaServed: 'Paris',
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Achat et vente immobilière à Paris — JIP"
        description="Accompagnement de l'estimation à la signature chez le notaire, pour vendre ou acheter à Paris. Agence JIP, 27 rue de Lisbonne, Paris 8e."
        keywords="vendre appartement paris, acheter paris 8, transaction immobilière paris, estimation vente"
        canonicalUrl="https://www.adbjip.fr/services/achats-ventes"
        structuredData={structuredData}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- OUVERTURE ----------------------------------------------
            `nuit` est indispensable et non décoratif : sans cette portée le
            fond passe au sombre tandis que `--foreground` reste l'encre. */}
        <section className="nuit grain relative isolate overflow-hidden bg-nuit pb-20 pt-32 text-pierre lg:pb-28">
          <div className="absolute inset-0 -z-10">
            <img
              src={AchatVenteImage}
              srcSet={AchatVenteImageSet}
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
              plaque="Transaction"
              titre="Achats et ventes"
              chapeau="N'oubliez pas votre syndic pour la vente de votre bien ! Accompagnement de A à Z pour vos projets d'acquisition et de cession immobilière à Paris."
            />

            <Voile delai={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Lien to="/contact?service=achats-ventes">
                  Échanger sur votre projet
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
          </div>
        </section>

        {/* ---- VENDRE ET ACHETER ------------------------------------- */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les deux sens"
              titre="Vendre votre bien, acheter un bien"
              chapeau="Deux mandats distincts, seize prestations. Le même interlocuteur suit le dossier dans les deux sens."
            />

            <div className="mt-16 grid gap-x-16 gap-y-14 lg:grid-cols-2">
              <Voile>
                <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)]">Vendre votre bien</h3>
                <p className="mesure mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  Valorisez votre patrimoine grâce à notre expertise du marché parisien. Nous
                  maximisons la valeur de votre bien et réduisons les délais de vente.
                </p>
                <ul className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {SERVICES_VENTE.map((x) => (
                    <Prestation key={x}>{x}</Prestation>
                  ))}
                </ul>
                <Button className="mt-8" asChild>
                  <Lien to="/contact?service=achats-ventes">
                    Vendre mon bien
                    <ArrowRight aria-hidden />
                  </Lien>
                </Button>
              </Voile>

              <Voile delai={80}>
                <h3 className="text-[clamp(1.375rem,2.2vw,1.75rem)]">Acheter un bien</h3>
                <p className="mesure mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  Trouvez le bien idéal grâce à notre réseau exclusif et notre connaissance
                  approfondie du marché immobilier parisien.
                </p>
                <ul className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {SERVICES_ACHAT.map((x) => (
                    <Prestation key={x}>{x}</Prestation>
                  ))}
                </ul>
                <Button className="mt-8" variant="secondary" asChild>
                  <Lien to="/biens">
                    Trouver mon bien
                    <ArrowRight aria-hidden />
                  </Lien>
                </Button>
              </Voile>
            </div>
          </div>
        </section>

        {/* ---- LA MÉTHODE -------------------------------------------
            Les numéros sont conservés : ces quatre étapes sont une vraie
            séquence, et l'ordre y porte une information utile au lecteur. */}
        <section className="bg-ivoire py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="La méthode"
              titre="Notre méthode"
              chapeau="Un accompagnement personnalisé à chaque étape."
            />

            <ol className="mt-14 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {ETAPES.map((etape, i) => (
                <Voile as="li" key={etape.titre} delai={echelonner(i)}>
                  <div className="grid gap-x-8 gap-y-1 border-b border-[hsl(var(--trait)/var(--trait-a))] py-6 sm:grid-cols-[5rem_1fr]">
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

        {/* ---- LES TROIS ATOUTS -------------------------------------- */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Pourquoi JIP"
              titre="Pourquoi nous choisir ?"
              chapeau="Vendre un lot dans un immeuble que l'on administre déjà, c'est vendre en connaissance."
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
              {ATOUTS.map((a, index) => (
                <Voile key={a.titre} delai={echelonner(index)} className="grid gap-x-10 gap-y-2 border-b border-[hsl(var(--trait)/var(--trait-a))] py-7 lg:grid-cols-[20rem_1fr]">
                  <dt className="text-[1.0625rem] font-semibold">{a.titre}</dt>
                  <dd className="mesure-large text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {a.texte}
                  </dd>
                </Voile>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- LE RENDEZ-VOUS ---------------------------------------- */}
        <section className="nuit grain bg-nuit py-20 text-pierre lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              plaque="Nous joindre"
              titre="Prêt à acheter ou vendre ?"
              chapeau="Parlons de votre projet immobilier et définissons ensemble la meilleure stratégie."
            />

            <Voile delai={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Lien to="/contact?service=achats-ventes">
                  Prendre rendez-vous
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

export default AchatsVentes;
