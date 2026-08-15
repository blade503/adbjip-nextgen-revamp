import { ArrowRight, Camera, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { biens, eur, feeNote, isNew, locationLabel } from '@/lib/biens';
import { classesGrille } from '@/lib/grille';

/**
 * Trois annonces du portefeuille, sur la page d'accueil.
 *
 * Les photos sont déjà rapatriées chaque nuit pour /biens : les afficher ici ne
 * coûte rien et donne à la page d'accueil les seules images vraies dont
 * l'agence dispose — ses propres biens, et non une banque d'images.
 *
 * Les annonces les plus récentes d'abord, comme sur /biens — le portefeuille est
 * déjà classé à la synchronisation — mais sans les parkings : à 14 000 € et
 * photographiés depuis le trottoir, ils font une vitrine d'accueil désastreuse
 * alors qu'ils se vendent très bien depuis la page /biens, qui montre tout.
 *
 * La section disparaît si le portefeuille est vide.
 */
const BiensApercu = () => {
  const vitrine = biens.filter((bien) => bien.propertyType !== 'parking');
  const selection = (vitrine.length >= 3 ? vitrine : biens).slice(0, 3);
  if (selection.length === 0) return null;

  const prix = (bien: (typeof biens)[number]) => {
    if (bien.price == null) return 'Prix sur demande';
    return bien.transaction === 'location' ? `${eur(bien.price)} /mois` : eur(bien.price);
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-4xl font-bold md:text-5xl">
              Nos biens <span className="gradient-text">du moment</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Le portefeuille est repris chaque nuit de notre logiciel de gestion. Ce que vous
              voyez ici est disponible aujourd'hui.
            </p>
          </div>
          <Button variant="outline" className="shrink-0" asChild>
            <Link to="/biens">
              Voir tous nos biens
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${classesGrille(selection.length)}`}>
          {selection.map((bien) => {
            const photo = bien.photos[0];
            const note = feeNote(bien);

            return (
              <Card key={bien.id} className="group overflow-hidden border-0 shadow-card hover-lift">
                <Link to="/biens" className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {photo && (
                      <img
                        src={photo.medium}
                        srcSet={`${photo.small} 400w, ${photo.medium} 800w, ${photo.large} 1200w`}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                        alt={photo.alt}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge
                        className="uppercase"
                        variant={bien.transaction === 'location' ? 'secondary' : 'default'}
                      >
                        {bien.transaction === 'location' ? 'Location' : 'Vente'}
                      </Badge>
                      {isNew(bien) && (
                        <Badge className="bg-background uppercase text-foreground" variant="outline">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    {bien.photos.length > 1 && (
                      <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                        <Camera className="h-3.5 w-3.5" />
                        {bien.photos.length}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-2xl font-bold tracking-tight">{prix(bien)}</p>
                    {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}

                    <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary">
                      {bien.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      {locationLabel(bien)}
                    </p>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {[
                        bien.surface ? `${bien.surface} m²` : null,
                        bien.rooms ? `${bien.rooms} pièces` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BiensApercu;
