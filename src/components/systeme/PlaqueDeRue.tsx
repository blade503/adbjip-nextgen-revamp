import { cn } from '@/lib/utils';

/**
 * La plaque de rue — l'objet signature du site.
 *
 * Une plaque parisienne : champ d'émail marine, arrondissement en petites
 * capitales de laiton, nom de voie en capitales espacées. Deux plaques du hall
 * réunies en une — celle de la rue, et le numéro vissé sur la porte cochère.
 * C'est la compression exacte de la promesse de l'agence, « deux métiers, une
 * seule adresse », et la raison pour laquelle le titre de la page d'accueil est
 * une adresse et non un slogan.
 *
 * L'arrondissement est en chiffres romains, comme sur les vraies plaques, et
 * les exposants sont balisés en `<sup>` : `ᵉ` et `ᵗ` ne sont pas dans le
 * sous-ensemble latin de Google Fonts et tombaient dans une police système.
 *
 * Trois tailles : `grande` pour l'ouverture, `moyenne` pour le pied de page,
 * `petite` — un cerné sans émail, « 27 | RUE DE LISBONNE » — pour les coins de
 * page où un aplat de marine pèserait trop.
 */

interface ProprietesPlaque {
  taille?: 'grande' | 'moyenne' | 'petite';
  className?: string;
}

const PlaqueDeRue = ({ taille = 'grande', className }: ProprietesPlaque) => {
  if (taille === 'petite') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2.5 border border-foreground px-2.5 py-1.5 text-foreground',
          className,
        )}
      >
        <span className="tabulaire font-display text-[1rem] font-semibold leading-none">27</span>
        <span className="font-sans text-[0.5625rem] font-semibold uppercase leading-none tracking-[0.14em]">
          Rue de Lisbonne
        </span>
      </div>
    );
  }

  const grande = taille === 'grande';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-4 bg-marine text-pierre sm:gap-5',
        grande ? 'px-5 py-3 sm:px-6 sm:py-3.5' : 'px-4 py-2.5',
        className,
      )}
    >
      {/* Le numéro, en chiffres tabulaires : c'est un numéro de voirie, il
          se lit comme un nombre et non comme un mot. */}
      <p
        className={cn(
          'tabulaire font-display font-semibold leading-none',
          grande ? 'text-[1.875rem] sm:text-[2.25rem]' : 'text-[1.375rem]',
        )}
      >
        27
      </p>

      <span aria-hidden className="h-7 w-px shrink-0 bg-pierre/30" />

      <p
        className={cn(
          'font-sans font-semibold uppercase leading-[1.25]',
          grande ? 'text-[0.6875rem] tracking-[0.16em]' : 'text-[0.5625rem] tracking-[0.14em]',
        )}
      >
        <span className={cn('block text-laiton', grande ? 'text-[0.5625rem]' : 'text-[0.5rem]')}>
          VIII<sup>e</sup> arr<sup>t</sup>
        </span>
        Rue de Lisbonne
      </p>
    </div>
  );
};

export default PlaqueDeRue;
