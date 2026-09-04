import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { BienPhoto } from '@/lib/biens';
import { cn } from '@/lib/utils';

/**
 * La galerie d'une annonce — une photo à la fois.
 *
 * La première version empilait les onze photos dans la boîte de dialogue : il
 * fallait faire défiler un long rouleau, et rien ne disait où l'on en était.
 * Ici une seule photo à l'écran, un compteur, et trois façons d'avancer :
 *
 *  - les BOUTONS précédent / suivant, cibles de 44 px, toujours visibles ;
 *  - les FLÈCHES DU CLAVIER, gauche et droite, écoutées sur la boîte entière
 *    (Radix y garde le focus) — Début et Fin vont aux extrémités ;
 *  - le GLISSEMENT au doigt, par `pointerdown` / `pointerup` : 40 px de course
 *    horizontale, sans bibliothèque.
 *
 * Le compteur est une région `aria-live` : un lecteur d'écran entend « 3 sur
 * 11 » à chaque changement, et l'alt de la photo courante suit. Les vignettes
 * en pied sont des boutons `aria-current` : elles disent où l'on est et
 * permettent de sauter.
 *
 * Aucune animation entre deux photos : un changement d'image n'est pas un
 * geste du système de mouvement, et un fondu retarderait la photo suivante.
 * Les deux voisines sont préchargées pour que le passage soit immédiat.
 *
 * Le duotone ne s'applique pas : ce sont des photos d'annonce, l'acheteur a
 * droit à la couleur réelle du bien.
 */
interface ProprietesGalerie {
  photos: BienPhoto[];
  titre: React.ReactNode;
  ouverte: boolean;
  /** Photo affichée à l'ouverture. */
  depart: number;
  onFermer: () => void;
}

const Galerie = ({ photos, titre, ouverte, depart, onFermer }: ProprietesGalerie) => {
  const [index, setIndex] = useState(depart);
  const total = photos.length;
  const debutGeste = useRef<number | null>(null);

  // Repartir de la photo demandée à chaque ouverture.
  useEffect(() => {
    if (ouverte) setIndex(Math.min(Math.max(depart, 0), total - 1));
  }, [ouverte, depart, total]);

  const aller = useCallback(
    (i: number) => setIndex(((i % total) + total) % total),
    [total],
  );

  // Les deux voisines, préchargées dès que l'index change.
  useEffect(() => {
    if (!ouverte || total < 2) return;
    for (const i of [index + 1, index - 1]) {
      const voisine = photos[((i % total) + total) % total];
      const img = new Image();
      img.src = voisine.large;
    }
  }, [index, ouverte, photos, total]);

  const surTouche = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); aller(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); aller(index - 1); }
    else if (e.key === 'Home') { e.preventDefault(); aller(0); }
    else if (e.key === 'End') { e.preventDefault(); aller(total - 1); }
  };

  const surPointeurBas = (e: React.PointerEvent) => {
    debutGeste.current = e.clientX;
  };
  const surPointeurHaut = (e: React.PointerEvent) => {
    if (debutGeste.current === null) return;
    const dx = e.clientX - debutGeste.current;
    debutGeste.current = null;
    if (Math.abs(dx) < 40) return;
    aller(dx < 0 ? index + 1 : index - 1);
  };

  const photo = photos[index];
  if (!photo) return null;

  return (
    <Dialog open={ouverte} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto" onKeyDown={surTouche}>
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span>{titre}</span>
            {/* Le compteur : annoncé à chaque changement, lu sans regarder. */}
            <span aria-live="polite" aria-atomic="true" className="cote">
              {index + 1} / {total}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* Le cadre garde un ratio fixe : la photo suivante n'a pas le même
              format, et sans cela la boîte changerait de hauteur à chaque
              passage — les boutons sous le pouce bougeraient. */}
          <figure
            className="m-0 flex aspect-[3/2] w-full items-center justify-center bg-encre"
            onPointerDown={surPointeurBas}
            onPointerUp={surPointeurHaut}
            onPointerCancel={() => (debutGeste.current = null)}
          >
            <img
              key={photo.large}
              src={photo.large}
              srcSet={`${photo.medium} 800w, ${photo.large} 1200w`}
              sizes="(min-width: 64rem) 60rem, 92vw"
              alt={photo.alt}
              className="max-h-full max-w-full select-none object-contain"
              draggable={false}
              decoding="async"
            />
          </figure>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => aller(index - 1)}
                aria-label="Photo précédente"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-pierre/90 text-encre transition-colors duration-2 hover:bg-pierre"
              >
                <ChevronLeft aria-hidden className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => aller(index + 1)}
                aria-label="Photo suivante"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-pierre/90 text-encre transition-colors duration-2 hover:bg-pierre"
              >
                <ChevronRight aria-hidden className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {total > 1 && (
          <ol className="flex gap-2 overflow-x-auto pb-1" aria-label="Toutes les photos">
            {photos.map((p, i) => (
              <li key={p.small} className="shrink-0">
                <button
                  type="button"
                  onClick={() => aller(i)}
                  aria-label={`Photo ${i + 1} sur ${total}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn(
                    'block h-14 w-[4.6667rem] overflow-hidden border-2 transition-colors duration-2',
                    i === index ? 'border-encre' : 'border-transparent opacity-70 hover:opacity-100',
                  )}
                >
                  <img src={p.small} alt="" width={400} height={300} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ol>
        )}

        <p className="text-[0.75rem] text-muted-foreground">
          Flèches ← → du clavier pour passer d'une photo à l'autre, Échap pour fermer.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default Galerie;
