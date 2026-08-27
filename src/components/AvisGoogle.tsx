import { ExternalLink, Star } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { AVIS, NOTE_GOOGLE } from '@/config/avis';
import { classesGrille } from '@/lib/grille';

/**
 * Avis clients repris de la fiche Google.
 *
 * Ne rend rien tant qu'aucun avis réel n'a été saisi : c'est volontaire, la
 * section ne doit jamais s'afficher avec du contenu de remplissage.
 *
 * La sélection ne va jamais sans le lien vers l'ensemble des avis : le visiteur
 * atteint la totalité en un clic, y compris les avis négatifs. La moyenne, elle,
 * n'est pas affichée — décision de l'agence tant qu'elle reste sous 4 sur 5.
 *
 * Section de nuit, et c'est ici que commence le dernier mouvement de la page
 * d'accueil : avis, conversion, pied de page s'enchaînent sur le même fond
 * sombre. On descend dans le hall à mesure qu'on approche de la porte, ce qui
 * est aussi l'ordre du parcours commercial — la preuve, puis la demande, puis
 * l'adresse.
 *
 * Le contraste y est meilleur qu'en clair, et de beaucoup : les étoiles et le
 * lien « voir tous les avis » sont en laiton, qui plafonne à 1,81:1 sur la
 * pierre et atteint 8,91:1 sur la nuit. C'est la même mesure qui a décidé de
 * l'inversion de tout le site.
 *
 * Plus de cartes : trois colonnes que séparent des filets verticaux. Un
 * témoignage n'a pas besoin d'être posé dans une boîte pour se lire comme une
 * citation — les guillemets et la règle typographique y suffisent.
 */
const AvisGoogle = () => {
  if (AVIS.length === 0) return null;

  return (
    <section className="nuit grain relative bg-nuit py-20 text-pierre lg:py-28">
      <div className="container relative mx-auto">
        <EnTeteSection
          fond="nuit"
          plaque="Avis Google"
          titre="Ce qu'en disent les clients"
          chapeau="Trois avis publiés sur la fiche Google de l'agence, recopiés mot pour mot."
          aparte={
            <a
              href={NOTE_GOOGLE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lien-trait font-display text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-primary"
            >
              Voir tous les avis
              <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          }
        />

        <div className={`mt-16 grid grid-cols-1 gap-x-10 gap-y-10 ${classesGrille(AVIS.length)}`}>
          {AVIS.map((avis, index) => (
            <Voile
              key={`${avis.auteur}-${avis.date}`}
              delai={echelonner(index)}
              className="flex border-t border-pierre/15 pt-7 sm:border-t-0 sm:border-l sm:border-pierre/15 sm:pl-10 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
            >
              <figure className="m-0 flex flex-1 flex-col">
                {/* `aria-label` SUR UN `div` SANS RÔLE N'EST PAS LU.
                    Relevé par Lighthouse (`aria-prohibited-attr`, 3 éléments) :
                    un `div` nu n'a pas de rôle, et la spécification ARIA interdit
                    de le nommer — la note était donc simplement absente pour un
                    lecteur d'écran, alors que le balisage donnait l'illusion du
                    contraire.

                    Corrigé par un texte réel en `sr-only` : plus fiable qu'un
                    attribut, traduisible, et présent dans le HTML prérendu. Les
                    étoiles restent `aria-hidden` : elles répètent ce que la
                    phrase dit déjà. */}
                {avis.note && (
                  <p className="mb-5 flex items-center gap-1">
                    <span className="sr-only">Note : {avis.note} sur 5</span>
                    {Array.from({ length: avis.note }).map((_, etoile) => (
                      <Star key={etoile} aria-hidden className="h-4 w-4 fill-current text-primary" />
                    ))}
                  </p>
                )}

                {/* Ni italique ni gris : un témoignage est le texte le plus lu
                    de la page. Composé en Archivo, corps 17, il devient une
                    citation et non une légende. */}
                <blockquote className="font-display text-[1.0625rem] font-normal leading-[1.5] tracking-[-0.008em] text-pierre">
                  « {avis.texte} »
                </blockquote>

                <figcaption className="mt-6 border-t border-pierre/15 pt-4 text-[0.8125rem] sm:mt-auto">
                  <span className="font-display font-semibold uppercase tracking-[0.1em] text-pierre">
                    {avis.auteur}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    Avis Google, {avis.date}
                  </span>
                </figcaption>
              </figure>
            </Voile>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvisGoogle;
