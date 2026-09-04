import type { ReactNode } from 'react';

import { Trait, Voile } from '@/components/systeme/Ouverture';
import { cn } from '@/lib/utils';

/**
 * L'en-tête de section — la composition signature du site.
 *
 * Un surtitre en petites capitales ambre (« Les mandats »), le filet qui court
 * jusqu'au bord droit, puis le titre en romain et son chapeau. C'est la
 * planche de la direction « La Plaque » : le surtitre est une cote de dossier,
 * le trait une réglure, le titre une manchette.
 *
 * Deux règles de composition, et elles valent pour tout le site :
 *
 *  1. RIEN N'EST CENTRÉ. Tout est ferré à gauche. Seuls les témoignages
 *     restent centrés, parce qu'une citation courte l'est légitimement.
 *  2. LA MESURE EST COURTE. Le titre tient dans 46 caractères, le chapeau dans
 *     68. Un titre qui court sur 1 200 px n'est pas grand, il est long.
 */

interface ProprietesEnTete {
  /** Le surtitre. En capitales, court : deux ou trois mots. */
  plaque: string;
  /** Le titre. Rendu en `h2` par défaut. */
  titre: ReactNode;
  /** Chapeau facultatif, sous le titre. */
  chapeau?: ReactNode;
  /** `h1` pour l'ouverture d'une page, `h2` pour une section. */
  niveau?: 'h1' | 'h2';
  /**
   * Conservé pour les appelants : le surtitre et le trait lisent désormais les
   * jetons de la portée (`.nuit` les rebascule), la prop n'a plus d'effet.
   */
  fond?: 'pierre' | 'nuit';
  /** Contenu ferré à droite du bandeau : un lien « voir tout », un bouton. */
  aparte?: ReactNode;
  className?: string;
}

const EnTeteSection = ({
  plaque,
  titre,
  chapeau,
  niveau = 'h2',
  aparte,
  className,
}: ProprietesEnTete) => {
  const Titre = niveau;

  return (
    <div className={cn('relative', className)}>
      {/* Le bandeau : surtitre — trait — aparté, sur une seule rangée.
          `flex-wrap` : l'aparté passe à la ligne quand il n'y a plus la place
          (un aparté de 196 px poussait le document à 448 px de large sur un
          téléphone de 390 — mesuré). Le filet est masqué sous sm : à 480 px il
          ne reste pas de place entre le surtitre et l'aparté. */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3 sm:gap-x-6">
        <p className="gravure shrink-0">{plaque}</p>
        <Trait className="hidden min-w-0 flex-1 self-center sm:block" />
        {aparte && <div className="min-w-0 shrink-0">{aparte}</div>}
      </div>

      <Voile delai={90} className="mt-4">
        <Titre
          className={cn(
            'mesure',
            niveau === 'h1'
              ? 'text-[clamp(2.625rem,6vw,4.5rem)]'
              : 'text-[clamp(2rem,3.5vw,2.75rem)]',
          )}
        >
          {titre}
        </Titre>

        {chapeau && (
          <p className="mesure-large mt-4 text-[1rem] leading-[1.55] text-ardoise sm:text-[1.0625rem]">
            {chapeau}
          </p>
        )}
      </Voile>
    </div>
  );
};

export default EnTeteSection;
