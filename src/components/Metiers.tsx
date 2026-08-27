import { ArrowRight } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Calage, Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import gestionLocativeImage from '@/assets/GestionLocative.webp';
import gestionCoproImage from '@/assets/GestionDeCopropriete2.webp';
import estimationImage from '@/assets/EstimationBien.webp';
import achatVenteImage from '@/assets/VenteDeBiens.webp';
import gestionLocative440 from '@/assets/GestionLocative-440.webp';
import gestionCopro440 from '@/assets/GestionDeCopropriete2-440.webp';
import estimation440 from '@/assets/EstimationBien-440.webp';
import achatVente440 from '@/assets/VenteDeBiens-440.webp';

/**
 * DEUX LARGEURS, ET LES BONNES.
 *
 * Largeur d'affichage MESURÉE de la vignette, pas estimée :
 *     fenêtre  390 px (DPR 3)    → 112 px CSS →  336 px physiques
 *     fenêtre  412 px (DPR 1,75) → 112 px CSS →  196 px physiques
 *     fenêtre  768 px (DPR 2)    → 192 px CSS →  384 px physiques
 *     fenêtre 1024 px et au-delà → 272 px CSS →  544 px physiques
 *
 * Elle ne dépasse donc jamais 544 px : le 1024w servi auparavant était perdu
 * dans tous les cas. C'est `sizes` qui était faux — il déclarait `100vw` sous
 * 1024 px, donc 390 × 3 = 1170 px de besoin, donc le plus gros fichier pour une
 * image de 112 px. Relevé par Lighthouse : « larger than it needs to be
 * (1024x682) for its displayed dimensions (196x131) », 147 Kio pour rien.
 *
 * `sizes` est maintenant exprimé en PIXELS, ce qui est exact ici parce que la
 * vignette a une largeur fixe par palier, et non une fraction de la fenêtre.
 */
const JEUX: Record<string, string> = {
  [gestionLocativeImage]: `${gestionLocative440} 440w, ${gestionLocativeImage} 700w`,
  [gestionCoproImage]: `${gestionCopro440} 440w, ${gestionCoproImage} 700w`,
  [estimationImage]: `${estimation440} 440w, ${estimationImage} 700w`,
  [achatVenteImage]: `${achatVente440} 440w, ${achatVenteImage} 700w`,
};

/** Paliers relevés au navigateur — voir le commentaire ci-dessus. */
const TAILLES = '(min-width: 1024px) 272px, (min-width: 640px) 192px, 112px';
import { Lien } from '@/components/systeme/Lien';

/**
 * LES MÉTIERS — un registre, pas une grille de cartes.
 *
 * Quatre cartes de verre égales alignées sur une rangée : c'est la disposition
 * que produit tout gabarit, et c'est ce qu'il y avait ici. Elle a deux défauts
 * qui ne sont pas d'apparence. D'abord elle prétend que les quatre métiers
 * pèsent le même poids, alors que la gérance et le syndic sont le fonds de
 * commerce et que les deux autres sont adjacents. Ensuite elle réduit chaque
 * métier à quarante mots, parce qu'une carte étroite ne tient pas davantage.
 *
 * Un registre de lignes pleine largeur règle les deux : chaque métier a une
 * ligne, un cadre gravé, la place d'une phrase entière, et l'ordre de la liste
 * dit la hiérarchie sans avoir à l'écrire.
 *
 * Au survol, RIEN NE DÉCOLLE : le lavis entre par la gauche, le liseré de
 * laiton se réveille, l'image se cale de 3 %. C'est `.rasante` dans
 * `src/index.css`. La ligne entière est cliquable — pas seulement le lien —
 * mais le lien reste le seul élément focalisable, pour ne pas doubler chaque
 * arrêt de tabulation.
 */
const Metiers = () => {
  const metiers = [
    {
      titre: 'Gérance locative',
      accroche:
        "Les revenus sont pour vous, la gestion est pour nous : quittances, révisions, régularisation des charges, relances, travaux, et l'interlocuteur qui décroche quand le locataire appelle.",
      lien: 'Confier un bien',
      route: '/services/gestion-locative',
      image: gestionLocativeImage,
    },
    {
      titre: 'Syndic de copropriété',
      accroche:
        "La pérennité de l'immeuble, tenue par quelqu'un qui en connaît les dossiers : budget, appels de fonds, assemblée générale, carnet d'entretien, suivi des travaux votés.",
      lien: 'Changer de syndic',
      route: '/services/gestion-copropriete',
      image: gestionCoproImage,
    },
    {
      titre: 'Estimation',
      accroche:
        'Projet de vente, succession, transmission de patrimoine : la valeur de marché établie sur pièces, à partir des ventes réellement enregistrées dans le quartier.',
      lien: 'Faire estimer un bien',
      route: '/services/estimation-biens',
      image: estimationImage,
    },
    {
      titre: 'Achat et vente',
      accroche:
        "Vendre un lot dans un immeuble que l'on administre déjà, c'est vendre en connaissance : charges, procès-verbaux, travaux votés, rien à découvrir chez le notaire.",
      lien: 'Vendre ou acheter',
      route: '/services/achats-ventes',
      image: achatVenteImage,
    },
  ];

  return (
    <section id="metiers" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto">
        <EnTeteSection
          plaque="Nos métiers"
          titre="Quatre métiers tenus sous le même toit"
          chapeau="Gérance et syndic sont le fonds de la maison. L'estimation et la transaction en découlent : on estime et on vend mieux un immeuble dont on tient les comptes."
        />

        <ul className="mt-16 border-t border-[hsl(var(--trait)/var(--trait-a))]">
          {metiers.map((metier, index) => (
            <Voile as="li" key={metier.titre} delai={echelonner(index)}>
              <Lien
                to={metier.route}
                className="rasante group grid grid-cols-[7rem_1fr] items-start gap-x-6 gap-y-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-7 sm:grid-cols-[12rem_1fr] sm:items-center sm:gap-x-8 sm:py-8 lg:grid-cols-[17rem_1fr_14rem] lg:gap-x-12"
              >
                {/* Le cadre gravé porte l'illustration. Le duotone la ramène
                    dans la palette : les quatre images venaient de sources
                    différentes et juraient entre elles autant qu'avec la
                    charte. Deux niveaux sont nécessaires — `.cadre` et
                    `.photo-editoriale` définissent chacune un `::after`. */}
                <Calage className="cadre aspect-[3/2] w-full">
                  <div className="photo-editoriale h-full w-full">
                    <img
                      src={metier.image}
                      srcSet={JEUX[metier.image]}
                      sizes={TAILLES}
                      alt=""
                      /* `width` et `height` POSÉS, toujours : ils donnent le
                         ratio au navigateur avant l'arrivée du fichier, donc la
                         boîte est réservée et rien ne se décale. Ces deux
                         attributs manquaient sur les quatre vignettes — c'était
                         le seul décalage de mise en page évitable de l'accueil. */
                      width={700}
                      height={467}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Calage>

                <div className="col-span-2 sm:col-span-1">
                  <h3 className="text-[clamp(1.375rem,2.2vw,1.875rem)]">{metier.titre}</h3>
                  <p className="mesure-large mt-2.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {metier.accroche}
                  </p>
                  {/* Le libellé revient sous le texte quand la troisième colonne
                      n'existe pas, c'est-à-dire sous lg. */}
                  <p className="lien-trait mt-4 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-foreground group-hover:before:scale-x-100 lg:hidden">
                    {metier.lien}
                  </p>
                </div>

                {/* L'ACTION EST FERRÉE À DROITE, et c'est le libellé qui y va,
                    pas un chevron seul — un chevron ne dit pas où il mène. La
                    colonne existait déjà pour la flèche, mais elle laissait un
                    tiers de la rangée vide : le regard finissait sa lecture dans
                    du blanc au lieu de finir sur l'action. */}
                <p className="lien-trait ml-auto hidden w-fit text-right font-display text-[0.6875rem] font-semibold uppercase leading-[1.5] tracking-[0.13em] text-foreground group-hover:before:scale-x-100 lg:flex">
                  {metier.lien}
                  <ArrowRight
                    aria-hidden
                    className="mt-px h-3.5 w-3.5 shrink-0 text-primary-ink transition-transform duration-4 ease-sortie group-hover:translate-x-1"
                  />
                </p>
              </Lien>
            </Voile>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Metiers;
