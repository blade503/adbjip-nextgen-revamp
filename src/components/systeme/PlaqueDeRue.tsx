import { cn } from '@/lib/utils';

/**
 * La plaque de rue — l'élément signature du site.
 *
 * Une plaque parisienne est un objet précis : champ d'émail bleu nuit, liseré
 * clair en retrait du bord, arrondissement en petites capitales dans l'angle,
 * nom de voie en grandes capitales espacées. Elle est reproduite ici à
 * l'échelle d'un objet et non d'une étiquette — c'est l'ouverture du site.
 *
 * Deux plaques du hall sont réunies en une : celle de la rue, et celle du
 * numéro vissée sur la porte cochère. C'est la compression exacte de la
 * promesse de l'agence — « deux métiers, une seule adresse » — et la raison
 * pour laquelle le titre de la page d'accueil est une adresse et non un slogan.
 *
 * L'arrondissement est en chiffres romains, comme sur les vraies plaques, et
 * les exposants sont balisés en `<sup>` : les caractères exposants Unicode
 * (ᵉ, ᵗ) ne sont pas dans le sous-ensemble latin de Google Fonts et tombaient
 * dans une police système au milieu du mot.
 */

interface ProprietesPlaque {
  /** Rendue plus petite dans le pied de page que dans l'ouverture. */
  taille?: 'grande' | 'moyenne';
  className?: string;
}

const PlaqueDeRue = ({ taille = 'grande', className }: ProprietesPlaque) => {
  const grande = taille === 'grande';

  return (
    <div
      className={cn(
        // Le champ et son liseré en retrait de 4 px : les deux ombres
        // intérieures dessinent le bord d'émail puis le filet gravé.
        'relative inline-block rounded-[3px] bg-marine',
        'shadow-[inset_0_0_0_4px_hsl(var(--marine)),inset_0_0_0_5px_hsl(var(--laiton)/0.6)]',
        grande ? 'px-6 py-4 sm:px-8 sm:py-5' : 'px-5 py-3.5',
        className,
      )}
    >
      <div className="flex items-stretch gap-4 sm:gap-6">
        {/* Le numéro, en chiffres tabulaires : c'est un numéro de voirie, il
            se lit comme un nombre et non comme un mot. */}
        <p
          className={cn(
            "tabulaire self-center font-display font-semibold leading-none text-pierre [font-variation-settings:'wdth'_120]",
            grande ? 'text-[2.5rem] sm:text-[3.25rem]' : 'text-[1.75rem]',
          )}
        >
          27
        </p>

        {/* Le filet de séparation, en retrait haut et bas comme sur l'émail. */}
        <span aria-hidden className="my-1 w-px shrink-0 bg-laiton/45" />

        <div className="self-center">
          <p
            className={cn(
              "font-display font-semibold uppercase leading-none text-laiton [font-variation-settings:'wdth'_118]",
              grande ? 'text-[0.625rem] tracking-[0.24em] sm:text-[0.6875rem]' : 'text-[0.5625rem] tracking-[0.2em]',
            )}
          >
            VIII<sup>e</sup> Arr<sup>t</sup>
          </p>
          <p
            className={cn(
              "mt-2 font-display font-semibold uppercase text-pierre [font-variation-settings:'wdth'_116]",
              grande
                ? 'text-[1.0625rem] leading-[1.15] tracking-[0.11em] sm:text-[1.375rem]'
                : 'text-[0.8125rem] leading-tight tracking-[0.1em]',
            )}
          >
            Rue de
            <br />
            Lisbonne
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaqueDeRue;
