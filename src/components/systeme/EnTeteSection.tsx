import type { ReactNode } from 'react';

import { Trait, Voile } from '@/components/systeme/Ouverture';
import { cn } from '@/lib/utils';

/**
 * L'en-tête de section — la composition signature du site.
 *
 * La plaque est vissée SUR le bandeau : le filet traverse toute la largeur du
 * conteneur, la plaque l'interrompt à gauche parce que son champ est opaque.
 * C'est exactement ce qu'on voit dans un hall parisien — une plaque de laiton
 * fixée sur la cimaise, pas une étiquette flottant au-dessus.
 *
 * Deux règles de composition, et elles valent pour tout le site :
 *
 *  1. RIEN N'EST CENTRÉ. La version précédente centrait les six en-têtes de la
 *     page d'accueil, ce qui est le réglage par défaut de tous les gabarits et
 *     la raison pour laquelle ils se ressemblent tous. Ici tout est ferré à
 *     gauche, sur la travée. Seuls les témoignages restent centrés, parce
 *     qu'une citation courte l'est légitimement.
 *  2. LA MESURE EST COURTE. Le titre tient dans 46 caractères, le chapeau dans
 *     46 également. Un titre qui court sur 1 200 px n'est pas grand, il est
 *     long — et il devient illisible bien avant d'être impressionnant.
 */

interface ProprietesEnTete {
  /** Texte de la plaque. En capitales, court : deux ou trois mots. */
  plaque: string;
  /** Le titre. Rendu en `h2` par défaut. */
  titre: ReactNode;
  /** Chapeau facultatif, sous le titre. */
  chapeau?: ReactNode;
  /** `h1` pour l'ouverture d'une page, `h2` pour une section. */
  niveau?: 'h1' | 'h2';
  /**
   * Sur un fond de nuit, la plaque s'inverse : champ de pierre, liseré marine.
   * La plaque d'émail marine sur la boiserie marine ne se verrait pas.
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
  fond = 'pierre',
  aparte,
  className,
}: ProprietesEnTete) => {
  const Titre = niveau;

  return (
    <div className={cn('relative', className)}>
      {/* Le bandeau : plaque — trait — aparté, sur une seule rangée. Le trait
          prend toute la place restante, donc il court jusqu'au bord droit quand
          il n'y a pas d'aparté, et s'arrête juste avant sinon.

          Il a d'abord été posé en `absolute … -z-10` par-dessus toute la
          largeur : un z-index négatif l'envoyait derrière le fond peint de la
          section, où il était invisible, et il fallait rapiécer un fond derrière
          l'aparté pour l'interrompre — rapiéçage qui se voyait dès que la
          section n'était pas sur `--background`. Une rangée flex règle les deux
          problèmes et supprime le rapiéçage.

          Le trait est masqué sous sm : à 480 px de large il ne reste pas de
          place entre la plaque et l'aparté, et un filet de 12 px n'est plus une
          ponctuation, c'est un défaut. */}
      {/* `flex-wrap` : l'aparté passe à la ligne quand il n'y a plus la place.
          Sans lui, un aparté de 196 px (« Sources et méthodologie » sur la page
          d'estimation) poussait le document à 448 px de large sur un téléphone
          de 390 — mesuré, et c'était le seul débordement horizontal du site.
          Le filet reste masqué sous sm : à 480 px il ne reste pas de place entre
          la plaque et l'aparté, et un filet de 12 px n'est plus une ponctuation,
          c'est un défaut. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6">
        <p className={cn('plaque shrink-0', fond === 'nuit' && 'plaque-pierre')}>{plaque}</p>
        <Trait className="hidden min-w-0 flex-1 sm:block" />
        {aparte && <div className="min-w-0 shrink-0">{aparte}</div>}
      </div>

      <Voile delai={90} className="mt-7">
        <Titre
          className={cn(
            'mesure',
            niveau === 'h1'
              ? 'text-[clamp(2.5rem,6.4vw,5rem)]'
              : 'text-[clamp(2rem,3.8vw,3.25rem)]',
          )}
        >
          {titre}
        </Titre>

        {chapeau && (
          <p className="mesure mt-5 text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-lg">
            {chapeau}
          </p>
        )}
      </Voile>
    </div>
  );
};

export default EnTeteSection;
