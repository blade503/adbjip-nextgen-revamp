import { ArrowRight, Camera, MapPin } from 'lucide-react';

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
 * l'agence dispose — ses propres biens, et non une banque d'images.
 *
 * LE DUOTONE NE S'APPLIQUE PAS ICI, et c'est une règle et non un oubli. Toute
 * image d'atmosphère du site est ramenée dans la palette ; une photo d'annonce
 * ne l'est jamais. Un acheteur a droit à la couleur réelle du bien qu'on lui
 * montre — un parquet, une exposition, un ravalement se jugent sur la teinte.
 * Le duotone est de l'éditorial, pas de la description. Ce qui unifie ces
 * images à la charte, c'est le cadre gravé, pas la colorimétrie.
 *
 * La vitrine **classe** le portefeuille, elle ne le filtre pas : /biens continue
 * de tout montrer, et l'agence n'a aucune raison de cacher qu'elle vend aussi
 * hors Île-de-France. Trois critères, dans cet ordre :
 *
 *  1. les parkings en dernier — à 14 000 € et photographiés depuis le trottoir,
 *     ils font une vitrine d'accueil désastreuse alors qu'ils se vendent très
 *     bien depuis /biens ;
 *  2. l'Île-de-France d'abord — une agence du 8ᵉ qui ouvre sur une vue
 *     satellite de Charente-Maritime se présente mal, et c'était le cas ;
 *  3. à égalité, l'ordre d'origine, déjà trié par récence à la synchronisation
 *     (le tri de `Array.prototype.sort` est stable, la récence est préservée).
 *
 * La section disparaît si le portefeuille est vide.
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
    <section className="bg-ivoire py-20 lg:py-28">
      <div className="container mx-auto">
        <EnTeteSection
          plaque="Portefeuille"
          titre="À vendre et à louer aujourd'hui"
          chapeau="Le portefeuille est repris chaque nuit du logiciel de gestion de l'agence. Ce qui est affiché ici est disponible ce matin."
          aparte={
            <Lien
              to="/biens"
              className="lien-trait font-display text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-foreground"
            >
              Tout le portefeuille
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </Lien>
          }
        />

        <div className={`mt-16 grid grid-cols-1 gap-x-8 gap-y-12 ${classesGrille(selection.length)}`}>
          {selection.map((bien, index) => {
            const photo = bien.photos[0];
            const note = feeNote(bien);

            return (
              <Voile key={bien.id} delai={echelonner(index)}>
                <Lien to="/biens" className="rasante group block">
                  <Calage className="cadre aspect-[4/3] w-full bg-muted">
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

                    {/* Les mentions sont posées SUR la photo, donc dans un
                        champ opaque : une étiquette translucide sur un ciel
                        clair ou un mur sombre n'a pas de contraste garanti. */}
                    <div className="absolute left-3 top-3 z-[3] flex flex-wrap gap-1.5">
                      <Badge variant={bien.transaction === 'location' ? 'secondary' : 'default'}>
                        {bien.transaction === 'location' ? 'Location' : 'Vente'}
                      </Badge>
                      {isNew(bien) && (
                        <Badge className="bg-pierre text-marine shadow-[inset_0_0_0_2px_hsl(var(--pierre)),inset_0_0_0_3px_hsl(var(--marine)/0.45)]">
                          Nouveau
                        </Badge>
                      )}
                    </div>

                    {bien.photos.length > 1 && (
                      <span className="tabulaire absolute bottom-3 right-3 z-[3] flex items-center gap-1.5 rounded-[1px] bg-nuit/80 px-2 py-1 text-[0.6875rem] font-medium text-pierre">
                        <Camera aria-hidden className="h-3 w-3" />
                        {bien.photos.length}
                      </span>
                    )}
                  </Calage>

                  {/* Pas de boîte autour du texte : le cadre gravé de la photo
                      suffit à tenir la fiche, et le prix se lit mieux posé à
                      même la pierre que dans une carte de plus. */}
                  <p className="tabulaire mt-5 font-display text-[1.625rem] font-semibold leading-none tracking-[-0.01em]">
                    {prix(bien)}
                  </p>
                  {note && <p className="mt-2 text-[0.75rem] text-muted-foreground">{note}</p>}

                  <hr className="regle mt-4" />

                  <h3 className="mt-4 text-[1.0625rem] leading-snug">
                    <Ordinaux texte={bien.title} />
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
                    <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
                    {locationLabel(bien)}
                  </p>

                  {(bien.surface || bien.rooms) && (
                    <p className="tabulaire mt-1 text-[0.8125rem] text-muted-foreground">
                      {[
                        bien.surface ? `${bien.surface} m²` : null,
                        bien.rooms ? `${bien.rooms} pièces` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
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
