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
 * L'AGENCE — recomposée dans le langage de la charte.
 *
 * TOUT LE TEXTE EST REPRIS MOT POUR MOT. Les quatre engagements, les deux
 * paragraphes de l'histoire, les blocs « ce que nous faisons / ne faisons pas »
 * et les quatre repères viennent de la version précédente. Les commentaires qui
 * expliquaient POURQUOI ce contenu est celui-là — les quatre valeurs
 * interchangeables remplacées par du vérifiable, les chiffres de portefeuille
 * retirés parce qu'inventés — sont conservés : ils documentent une décision.
 *
 * CE QUI A CHANGÉ EST LA FORME. Relevé avant : 26 vestiges de gabarit —
 * 6 `text-center`, 4 `gradient-text`, 5 `glass`, 3 `hover-lift`, 3 `shadow-card`,
 * 3 `bg-gradient-subtle`, 1 pastille d'icône, 1 `rounded-2xl`.
 *
 *  - le centrage → tout ferré à gauche sur la travée, six en-têtes passés par
 *    `EnTeteSection` (plaque vissée, filet qui court, mesure de 46 caractères).
 *  - les quatre carrés d'icônes en aplat de laiton → un registre réglé. Quatre
 *    cartes centrées de même poids prétendaient que les engagements se valent.
 *  - `gradient-text` sur un mot de chaque titre → le titre entier en encre. Le
 *    laiton reste sur la plaque, où son contraste est mesuré (1,81:1 sur la
 *    pierre en texte, donc interdit).
 *  - `glass` / `glass-strong` / `shadow-card` → `.panneau` et `.cadre` : liseré
 *    gravé en retrait, aucune ombre portée, rien qui décolle au survol.
 *  - `bg-gradient-subtle` → l'alternance nuit / pierre / ivoire.
 *
 * « 24 h » comme temps de réponse reste en attente d'arbitrage, comme ailleurs
 * sur le site : la charte interdit de l'inventer, pas de le conserver.
 */

/**
 * Excellence, Proximité, Transparence, Efficacité : quatre mots que tous les
 * concurrents affichent aussi. Remplacés par ce qu'un visiteur peut vérifier en
 * nous appelant.
 */
const ENGAGEMENTS = [
  {
    titre: 'Un interlocuteur unique',
    texte:
      "Le même gestionnaire suit votre dossier du premier appel à la signature. Pas de standard, pas de numéro de dossier.",
  },
  {
    titre: 'Une réponse sous 24 heures',
    texte:
      "Ouvrées. C'est l'engagement que nous tenons sur les appels comme sur les courriels.",
  },
  {
    titre: 'Gérance et syndic réunis',
    texte:
      "Nous gérons des immeubles et des appartements. Quand nous vendons un lot, nous connaissons déjà l'immeuble.",
  },
  {
    titre: 'Indépendante depuis 2011',
    texte:
      'Ni franchise, ni réseau : une agence de quartier, au 27 rue de Lisbonne, dirigée par ceux qui la tiennent.',
  },
];

/**
 * Repères vérifiables uniquement. Les chiffres de portefeuille, de satisfaction
 * et d'effectif ont été retirés : ils étaient inventés et se contredisaient
 * d'une page à l'autre (25+ ans ici, 15+ ailleurs).
 *
 * `ᵉ` (U+1D49) n'appartient pas au sous-ensemble latin de Google Fonts : il
 * basculait dans une police système au milieu du mot, et « Paris 8ᵉ » s'affichait
 * « Paris 8° ». Le rendu passe donc par `<sup>`.
 */
const REPERES = [
  { valeur: '2011', libelle: 'Année de création' },
  { valeur: <>Paris 8<sup>e</sup></>, libelle: '27, rue de Lisbonne' },
  { valeur: '2', libelle: 'Métiers : gérance et syndic' },
  { valeur: '24 h', libelle: 'Temps de réponse' },
];

const About = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  return (
    <div className="min-h-screen">
      <SEOHead
        title="L'agence — JIP, Jobard Immobilier Paris"
        description="Deux métiers sous le même toit depuis 2011 : gestion locative et syndic de copropriété, au 27 rue de Lisbonne dans le 8e arrondissement de Paris."
        keywords="agence immobilière paris 8, jobard immobilier paris, syndic et gérance, agence indépendante"
        canonicalUrl="https://www.adbjip.fr/agence"
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- OUVERTURE ----------------------------------------------
            Bande de nuit sans photographie, comme les sections de clôture du
            site : `nuit` rebascule les jetons du sous-arbre, sans quoi le fond
            passe au sombre tandis que le texte reste à l'encre. */}
        <section className="nuit grain bg-nuit pb-16 pt-32 text-pierre">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              niveau="h1"
              plaque="À propos de nous"
              titre="Notre expertise à votre service"
              chapeau="Depuis 2011, nous accompagnons propriétaires et copropriétés dans la gestion et la valorisation de leur patrimoine immobilier parisien."
            />
          </div>
        </section>

        {/* ---- L'HISTOIRE ---------------------------------------------
            Travée asymétrique 7 / 5 et non deux moitiés égales : deux colonnes
            de même largeur n'établissent aucune hiérarchie, et c'est le réglage
            par défaut de toutes les grilles. Ici le texte porte. */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <EnTeteSection plaque="La maison" titre="Une histoire de confiance" />
                <Voile delai={90}>
                  <p className="mesure mt-8 text-[1.0625rem] leading-relaxed text-muted-foreground">
                    Fondée par des professionnels passionnés de l'immobilier parisien, notre
                    société s'est développée autour de valeurs fortes : l'excellence du service,
                    la proximité client et la transparence dans nos relations.
                  </p>
                  <p className="mesure mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground">
                    Deux sociétés, deux métiers, une seule adresse : J.I.P. pour la gestion
                    locative et le syndic, Jobard Immobilier Patrimoine pour la transaction et
                    l'estimation. Le même interlocuteur suit votre dossier du premier appel à la
                    signature.
                  </p>
                  <Button className="mt-9" asChild>
                    <Lien to="/contact">
                      Nous contacter
                      <ArrowRight aria-hidden />
                    </Lien>
                  </Button>
                </Voile>
              </div>

              {/* Les deux panneaux : liseré gravé, aucune ombre, rien qui
                  décolle. `glass-strong` produisait un verre dépoli que la
                  charte a retiré du vocabulaire. */}
              <div className="flex flex-col gap-6 lg:col-span-5">
                <Voile delai={140}>
                  <div className="panneau cadre p-7">
                    <h3 className="text-[1.0625rem]">Ce que nous faisons</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      Nous gérons des appartements pour leurs propriétaires et des immeubles pour
                      leurs copropriétaires : loyers, travaux, assemblées générales, comptes.
                    </p>
                  </div>
                </Voile>
                <Voile delai={210}>
                  <div className="panneau cadre p-7">
                    <h3 className="text-[1.0625rem]">Ce que nous ne faisons pas</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      Nous ne gérons pas au-delà de ce que nous pouvons suivre. Le portefeuille
                      reste à la taille d'une agence où l'on connaît chaque immeuble.
                    </p>
                  </div>
                </Voile>
              </div>
            </div>
          </div>
        </section>

        {/* ---- LES ENGAGEMENTS ---------------------------------------- */}
        <section className="bg-ivoire py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les engagements"
              titre="Nos engagements"
              chapeau="Quatre choses que vous pouvez vérifier en nous appelant."
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
              {ENGAGEMENTS.map((e, index) => (
                <Voile key={e.titre} delai={echelonner(index)} className="grid gap-x-10 gap-y-2 border-b border-[hsl(var(--trait)/var(--trait-a))] py-7 lg:grid-cols-[20rem_1fr]">
                  <dt className="text-[1.0625rem] font-semibold">{e.titre}</dt>
                  <dd className="mesure-large text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {e.texte}
                  </dd>
                </Voile>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- LES REPÈRES -------------------------------------------- */}
        <section className="bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Les repères"
              titre="Nos chiffres clés"
              chapeau="Ce qui est vérifiable au registre du commerce."
            />

            <Voile delai={120}>
              <dl className="mt-14 grid grid-cols-2 border-t border-[hsl(var(--trait)/var(--trait-a))] lg:grid-cols-4">
                {REPERES.map(({ valeur, libelle }) => (
                  <div
                    key={libelle}
                    className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-6 lg:border-b-0 lg:border-l lg:border-[hsl(var(--trait)/var(--trait-a))] lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                  >
                    <dt className="font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-primary-display">
                      {valeur}
                    </dt>
                    <dd className="mt-1.5 text-[0.875rem] text-muted-foreground">{libelle}</dd>
                  </div>
                ))}
              </dl>
            </Voile>
          </div>
        </section>

        {/* ---- LE RENDEZ-VOUS ---------------------------------------- */}
        <section className="nuit grain bg-nuit py-20 text-pierre lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              plaque="Nous joindre"
              titre="Prêt à nous faire confiance ?"
              chapeau="Découvrez comment notre expertise peut valoriser votre patrimoine."
            />

            <Voile delai={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Lien to="/equipe">
                  Rencontrer l'équipe
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

export default About;
