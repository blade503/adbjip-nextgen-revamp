import type { ReactNode } from 'react';

import { Calage, Voile } from '@/components/systeme/Ouverture';
import { cn } from '@/lib/utils';

/**
 * L'ouverture d'une page intérieure — direction « La Plaque ».
 *
 * Sur le crème, comme le reste : un surtitre, le titre en romain, le chapeau,
 * les actions, et à droite une photographie au format 4/3 quand la page en a
 * une. C'est la même planche sur les sept pages, et c'est ce qui les fait
 * reconnaître comme les pages d'un même dossier.
 *
 * `reperes` : trois valeurs en romain sous le chapeau (« DVF », « Gratuit »,
 * « 24 h ») — des faits, jamais des chiffres de performance.
 *
 * `duotone` : SEULEMENT pour les images de banque des pages métier, qui
 * viennent de sources différentes et juraient entre elles. Jamais sur une
 * photographie de l'agence ni sur une photo d'annonce.
 */
interface Image {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  duotone?: boolean;
}

interface ProprietesEnTetePage {
  surtitre: ReactNode;
  titre: ReactNode;
  chapeau?: ReactNode;
  actions?: ReactNode;
  reperes?: { valeur: ReactNode; libelle: string }[];
  image?: Image;
  /**
   * Un visuel DESSINÉ à la place de la photographie (voir `Ferronnerie`) : les
   * images de banque générées des ouvertures ont été retirées le 04/09/2026
   * parce qu'elles faisaient fausses. Occupe la même colonne, le même cadre.
   */
  visuel?: ReactNode;
  /** Contenu ferré à droite, à la place de l'image : les filtres du portefeuille. */
  aparte?: ReactNode;
  className?: string;
}

const EnTetePage = ({
  surtitre,
  titre,
  chapeau,
  actions,
  reperes,
  image,
  visuel,
  aparte,
  className,
}: ProprietesEnTetePage) => (
  <section className={cn('bg-pierre pb-14 pt-10 lg:pb-16 lg:pt-16', className)}>
    <div
      className={cn(
        'container mx-auto grid gap-x-16 gap-y-10',
        (image || visuel) && 'lg:grid-cols-2 lg:items-center',
        !image && !visuel && aparte && 'lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end',
      )}
    >
      <div className={cn(!image && !visuel && !aparte && 'max-w-[52rem]')}>
        <p className="voile gravure">{surtitre}</p>
        <h1 className="voile mesure mt-5 text-[clamp(2.625rem,6vw,4.5rem)] [animation-delay:90ms]">{titre}</h1>
        {chapeau && (
          <p className="voile mesure-large mt-6 text-[1.0625rem] leading-[1.55] text-ardoise [animation-delay:180ms] sm:text-[1.125rem]">
            {chapeau}
          </p>
        )}
        {actions && (
          <div className="voile mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:270ms]">{actions}</div>
        )}
        {reperes && (
          <dl className="voile mt-9 flex flex-wrap gap-x-8 gap-y-4 [animation-delay:270ms]">
            {reperes.map(({ valeur, libelle }) => (
              <div key={libelle}>
                <dt className="font-serif text-[1.75rem] leading-none">{valeur}</dt>
                <dd className="mt-1.5 text-[0.8125rem] text-muted-foreground">{libelle}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {image && (
        <Voile delai={120}>
          <Calage className="aspect-[3/2] w-full bg-lin lg:aspect-[4/3]">
            <div className={cn('h-full w-full', image.duotone && 'photo-editoriale')}>
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={image.sizes ?? '(min-width: 64rem) 45vw, 100vw'}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="h-full w-full object-cover"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </div>
          </Calage>
        </Voile>
      )}

      {visuel && !image && (
        <Voile delai={120} className="aspect-[3/2] w-full lg:aspect-[4/3]">
          {visuel}
        </Voile>
      )}

      {!image && !visuel && aparte && <div className="voile [animation-delay:270ms]">{aparte}</div>}
    </div>
  </section>
);

export default EnTetePage;
