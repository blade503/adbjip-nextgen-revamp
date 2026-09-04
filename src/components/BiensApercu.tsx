import { ArrowRight, Camera } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Calage, Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { Badge } from '@/components/ui/badge';
import { biens, eur, feeNote, isNew, locationLabel } from '@/lib/biens';
import { classesGrille } from '@/lib/grille';
import { Lien } from '@/components/systeme/Lien';
import Ordinaux from '@/components/systeme/Ordinaux';

/** Départements d'Île-de-France, pour le classement de la vitrine. */
const DEPARTEMENTS_IDF = ['75', '77', '78', '91', '92', '93', '94', '95'];

/**
 * Trois annonces du portefeuille, sur la page d'accueil.
 *
 * Les photos sont déjà rapatriées chaque nuit pour /biens : les afficher ici ne
 * coûte rien et donne à la page d'accueil les seules images vraies dont
 * l'agence dispose. Chaque fiche mène à SA page (`/biens/<slug>`) et non plus à
 * la liste : c'est ce que le visiteur attend d'une vignette d'annonce.
 *
 * LE DUOTONE NE S'APPLIQUE PAS ICI : un acheteur a droit à la couleur réelle du
 * bien qu'on lui montre.
 *
 * La vitrine **classe** le portefeuille, elle ne le filtre pas :
 *  1. les parkings en dernier — photographiés depuis le trottoir, ils font une
 *     vitrine d'accueil désastreuse alors qu'ils se vendent très bien depuis
 *     /biens ;
 *  2. l'Île-de-France d'abord ;
 *  3. à égalité, l'ordre d'origine (le tri est stable, la récence est préservée).
 */
const rangVitrine = (bien: (typeof biens)[number]) =>
  (bien.propertyType === 'parking' ? 2 : 0) +
  (DEPARTEMENTS_IDF.includes(bien.postalCode.slice(0, 2)) ? 0 : 1);

const BiensApercu = () => {
  const selection = [...biens].sort((a, b) => rangVitrine(a) - rangVitrine(b)).slice(0, 3);
  if (selection.length === 0) return null;

  const prix = (bien: (typeof biens)[number]) => {
    if (bien.price == null) return 'Prix sur demande';
    return bien.transaction === 'location' ? `${eur(bien.price)} /mois` : eur(bien.price);
  };

  return (
    <section className="bg-pierre py-16 lg:py-20">
      <div className="container mx-auto">
        <EnTeteSection
          plaque="Portefeuille"
          titre="À vendre et à louer aujourd'hui"
          chapeau="Le portefeuille est repris chaque nuit du logiciel de gestion de l'agence. Ce qui est affiché ici est disponible ce matin."
          aparte={
            <Lien
              to="/biens"
              className="lien-trait text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-foreground"
            >
              Tout le portefeuille
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Lien>
          }
        />

        <div className={`mt-12 grid grid-cols-1 gap-x-6 gap-y-10 ${classesGrille(selection.length)}`}>
          {selection.map((bien, index) => {
            const photo = bien.photos[0];
            const note = feeNote(bien);

            return (
              <Voile key={bien.id} delai={echelonner(index)}>
                <Lien to={`/biens/${bien.slug}`} className="rasante group block">
                  <Calage className="aspect-[4/3] w-full bg-lin">
                    {photo && (
                      <img
                        src={photo.medium}
                        srcSet={`${photo.small} 400w, ${photo.medium} 800w, ${photo.large} 1200w`}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                        alt={photo.alt}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}

                    {/* Les mentions sont posées SUR la photo, donc en aplat opaque. */}
                    <div className="absolute left-3 top-3 z-[3] flex flex-wrap gap-1.5">
                      <Badge variant={bien.transaction === 'location' ? 'secondary' : 'default'}>
                        {bien.transaction === 'location' ? 'Location' : 'Vente'}
                      </Badge>
                      {isNew(bien) && <Badge variant="pierre">Nouveau</Badge>}
                    </div>

                    {bien.photos.length > 1 && (
                      <span className="tabulaire absolute bottom-3 right-3 z-[3] flex items-center gap-1.5 bg-encre/80 px-2 py-1 text-[0.6875rem] font-medium text-pierre">
                        <Camera aria-hidden className="h-3 w-3" />
                        {bien.photos.length}
                      </span>
                    )}
                  </Calage>

                  {/* Titre en romain à gauche, prix en chiffres à droite : la
                      composition d'une ligne de catalogue. */}
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.15]">
                      <Ordinaux texte={bien.title} />
                    </h3>
                    <p className="tabulaire shrink-0 font-display text-[1rem] font-semibold">{prix(bien)}</p>
                  </div>
                  <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
                    <Ordinaux texte={locationLabel(bien)} />
                    {note && <> · {note}</>}
                  </p>
                </Lien>
              </Voile>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BiensApercu;
