import { ExternalLink, Star } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { AVIS, NOTE_GOOGLE } from '@/config/avis';
import { classesGrille } from '@/lib/grille';

/**
 * Avis clients repris de la fiche Google.
 *
 * Ne rend rien tant qu'aucun avis réel n'a été saisi : la section ne doit
 * jamais s'afficher avec du contenu de remplissage.
 *
 * La sélection ne va jamais sans le lien vers l'ensemble des avis : le visiteur
 * atteint la totalité en un clic, y compris les avis négatifs. La moyenne, elle,
 * n'est pas affichée — décision de l'agence tant qu'elle reste sous 4 sur 5.
 *
 * Trois colonnes séparées de filets, sur la bande de lin : un témoignage n'a
 * pas besoin d'être posé dans une boîte pour se lire comme une citation. Il est
 * composé en romain, corps 19 — c'est le texte le plus lu de la page.
 */
const AvisGoogle = () => {
  if (AVIS.length === 0) return null;

  return (
    <section className="bg-lin py-16 lg:py-20">
      <div className="container mx-auto">
        <EnTeteSection
          plaque="Avis Google"
          titre="Ce qu'en disent les clients"
          chapeau="Trois avis publiés sur la fiche Google de l'agence, recopiés mot pour mot."
          aparte={
            <a
              href={NOTE_GOOGLE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lien-trait text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-foreground"
            >
              Voir tous les avis
              <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          }
        />

        <div className={`mt-12 grid grid-cols-1 gap-x-10 gap-y-10 ${classesGrille(AVIS.length)}`}>
          {AVIS.map((avis, index) => (
            <Voile
              key={`${avis.auteur}-${avis.date}`}
              delai={echelonner(index)}
              className="flex border-t border-[hsl(var(--trait)/var(--trait-a))] pt-6 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
            >
              <figure className="m-0 flex flex-1 flex-col">
                {/* Un texte réel en `sr-only` plutôt qu'un `aria-label` sur un
                    `div` sans rôle, que la spécification interdit de nommer. */}
                {avis.note && (
                  <p className="mb-5 flex items-center gap-1">
                    <span className="sr-only">Note : {avis.note} sur 5</span>
                    {Array.from({ length: avis.note }).map((_, etoile) => (
                      <Star key={etoile} aria-hidden className="h-4 w-4 fill-current text-primary-ink" />
                    ))}
                  </p>
                )}

                <blockquote className="font-serif text-[1.1875rem] leading-[1.4] text-foreground">
                  « {avis.texte} »
                </blockquote>

                <figcaption className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-4 text-[0.8125rem] sm:mt-auto">
                  <span className="font-semibold text-foreground">{avis.auteur}</span>
                  <span className="mt-0.5 block text-muted-foreground">Avis Google, {avis.date}</span>
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
