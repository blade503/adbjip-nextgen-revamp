import { Camera } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Calage } from '@/components/systeme/Ouverture';
import { Lien } from '@/components/systeme/Lien';
import Ordinaux from '@/components/systeme/Ordinaux';
import { type Bien, eur, feeNote, isNew, locationLabel, priceDrop, prixLibelle } from '@/lib/biens';
import { cn } from '@/lib/utils';

/**
 * La fiche d'annonce, en une seule écriture pour tout le site.
 *
 * Le portefeuille et la page bien (« dans le même portefeuille ») affichaient
 * les mêmes annonces avec deux compositions différentes. Ici une seule : la
 * photo en 4/3 avec ses mentions posées en aplat, le prix en chiffres à
 * gauche et la référence en cote à droite, le titre en romain, puis la ligne
 * de caractéristiques. La fiche entière est un lien vers sa page.
 *
 * LE DUOTONE NE S'APPLIQUE JAMAIS ICI : un acheteur a droit à la couleur
 * réelle du bien.
 */

/** Les deux badges DPE / GES produits par `fetch-biens.mjs` (SVG 100 × 40). */
export const DpeBadges = ({ bien, className = 'h-10' }: { bien: Bien; className?: string }) => {
  if (!bien.badges?.dpeBadge) return null;
  return (
    <div className="flex items-end gap-2" aria-label="Diagnostic de performance énergétique">
      <img
        src={bien.badges.dpeBadge}
        alt={`Classe énergie ${bien.dpe.energyClass ?? ''}`}
        width={100}
        height={40}
        className={`${className} w-auto`}
        loading="lazy"
        decoding="async"
      />
      {bien.badges.gesBadge && (
        <img
          src={bien.badges.gesBadge}
          alt={`Classe climat ${bien.dpe.gesClass ?? ''}`}
          width={100}
          height={40}
          className={`${className} w-auto`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

/** Les mentions posées sur la photo : transaction, nouveauté, baisse. */
export const MentionsPhoto = ({ bien }: { bien: Bien }) => {
  const location = bien.transaction === 'location';
  return (
    <div className="absolute left-3 top-3 z-[3] flex flex-wrap gap-1.5">
      <Badge variant={location ? 'secondary' : 'default'}>{location ? 'Location' : 'Vente'}</Badge>
      {isNew(bien) && <Badge variant="pierre">Nouveau</Badge>}
      {priceDrop(bien) && <Badge variant="destructive">Baisse de prix</Badge>}
    </div>
  );
};

const CarteBien = ({
  bien,
  index = 0,
  className,
}: {
  bien: Bien;
  /** Les trois premières photos d'une liste se chargent d'emblée. */
  index?: number;
  className?: string;
}) => {
  const photo = bien.photos[0];
  const note = feeNote(bien);
  const baisse = priceDrop(bien);
  const details = [
    locationLabel(bien),
    bien.surface ? `${bien.surface} m²` : null,
    bien.rooms ? `${bien.rooms} ${bien.rooms > 1 ? 'pièces' : 'pièce'}` : null,
    bien.bedrooms ? `${bien.bedrooms} ch.` : null,
  ].filter(Boolean) as string[];

  return (
    <Lien to={`/biens/${bien.slug}`} className={cn('rasante group flex w-full flex-col', className)}>
      <Calage className="aspect-[4/3] w-full bg-lin">
        {photo ? (
          <img
            src={photo.medium}
            srcSet={`${photo.small} 400w, ${photo.medium} 800w, ${photo.large} 1200w`}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
            alt={photo.alt}
            width={800}
            height={600}
            className="h-full w-full object-cover"
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center p-6 text-[0.8125rem] text-muted-foreground">
            Photo à venir
          </div>
        )}
        <MentionsPhoto bien={bien} />
        {bien.photos.length > 1 && (
          <span className="tabulaire absolute bottom-3 right-3 z-[3] flex items-center gap-1.5 bg-encre/80 px-2 py-1 text-[0.6875rem] font-medium text-pierre">
            <Camera aria-hidden className="h-3 w-3" />
            {bien.photos.length}
          </span>
        )}
      </Calage>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="tabulaire font-display text-[1.375rem] font-semibold leading-none tracking-[-0.01em]">
          {prixLibelle(bien)}
          {baisse && bien.previousPrice != null && (
            <span className="ml-2 text-[0.875rem] font-normal text-muted-foreground line-through">
              {eur(bien.previousPrice)}
            </span>
          )}
        </p>
        <span className="cote shrink-0 text-muted-foreground">Réf. {bien.reference}</span>
      </div>

      <h3 className="mt-2 text-[clamp(1.25rem,1.8vw,1.5rem)] leading-[1.15]">
        <Ordinaux texte={bien.title} />
      </h3>

      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
        <Ordinaux texte={details.join(' · ')} />
      </p>
      {note && <p className="mt-1 text-[0.75rem] text-muted-foreground">{note}</p>}

      {bien.badges?.dpeBadge && (
        <div className="mt-3">
          <DpeBadges bien={bien} className="h-8" />
        </div>
      )}
    </Lien>
  );
};

export default CarteBien;
