import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import BoutonTelephone from '@/components/systeme/BoutonTelephone';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Le bandeau de contact — la clôture de chaque page.
 *
 * Un bloc de marine, un titre en romain, le numéro en plaque de laiton et une
 * action écrite. C'est le même objet sur les sept pages : une seule façon de
 * dire « appelez-nous », et le visiteur la reconnaît de page en page.
 *
 * `fond="lin"` : la même composition sur la bande claire, pour les pages où
 * un bloc de marine tomberait juste après un autre (la page syndic ferme sur
 * l'accès en ligne, déjà de marine). Les jetons font le reste : le bouton
 * principal est de marine sur le lin, de laiton sur le marine.
 */
interface ProprietesBandeau {
  surtitre?: string;
  titre: ReactNode;
  texte?: ReactNode;
  action?: { libelle: string; href: string };
  fond?: 'marine' | 'lin';
  /** Le numéro d'abord, ou l'action d'abord. */
  ordre?: 'telephone' | 'action';
  className?: string;
}

const BandeauContact = ({
  surtitre,
  titre,
  texte,
  action,
  fond = 'marine',
  ordre = 'telephone',
  className,
}: ProprietesBandeau) => {
  const marine = fond === 'marine';

  const telephone = <BoutonTelephone variant={marine ? 'default' : 'secondary'} />;
  const bouton = action && (
    <Button size="lg" variant={marine ? 'secondary' : 'default'} asChild>
      <Lien to={action.href}>
        {action.libelle}
        <ArrowRight aria-hidden />
      </Lien>
    </Button>
  );

  return (
    <section
      className={cn(
        marine ? 'nuit bg-marine text-pierre' : 'bg-lin text-foreground',
        'py-14 lg:py-16',
        className,
      )}
    >
      <div className="container mx-auto grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <Voile>
          {surtitre && <p className="gravure">{surtitre}</p>}
          <h2 className={cn('text-[clamp(1.875rem,3.4vw,2.5rem)]', surtitre && 'mt-3')}>{titre}</h2>
          {texte && (
            <p className="mesure-large mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {texte}
            </p>
          )}
        </Voile>
        <Voile delai={90} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          {ordre === 'telephone' ? (
            <>
              {telephone}
              {bouton}
            </>
          ) : (
            <>
              {bouton}
              {telephone}
            </>
          )}
        </Voile>
      </div>
    </section>
  );
};

export default BandeauContact;
