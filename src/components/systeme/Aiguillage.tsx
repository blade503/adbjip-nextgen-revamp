import { ArrowRight } from 'lucide-react';

import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { cn } from '@/lib/utils';

/**
 * L'AIGUILLAGE PAR PROFIL — trois cartes, trois visiteurs.
 *
 * Le constat des planches : « Confier un bien » et « Changer de syndic » côte à
 * côte, sans savoir à qui l'on parle. Le site s'adresse à trois personnes qui
 * ne se ressemblent pas — un propriétaire bailleur, un conseil syndical, un
 * vendeur ou acquéreur — et chacune doit se reconnaître en une phrase écrite à
 * la première personne, puis trouver sa porte.
 *
 * Les `cle` sont les valeurs du paramètre `?service=` et de la liste du
 * formulaire de contact : ne pas les renommer, `contact.php` route les
 * courriels dessus (`gerance@`, `copro@`).
 *
 * La première carte est de marine, les deux autres blanches : la gérance est
 * le fonds de commerce, et l'ordre dit la hiérarchie sans l'écrire.
 */
export const PROFILS = [
  {
    cle: 'gestion-locative',
    libelle: 'Propriétaire bailleur',
    phrase: 'Je veux confier un lot ou un immeuble en gérance.',
    action: 'Confier un bien',
    href: '/services/gestion-locative',
    court: 'Bailleur',
  },
  {
    cle: 'gestion-copropriete',
    libelle: 'Conseil syndical',
    phrase: 'Nous cherchons un syndic pour notre copropriété.',
    action: 'Changer de syndic',
    href: '/services/gestion-copropriete',
    court: 'Copro',
  },
  {
    cle: 'achats-ventes',
    libelle: 'Vendeur ou acquéreur',
    phrase: 'Je veux vendre, acheter ou faire estimer un bien.',
    action: 'Faire estimer',
    href: '/services/vendre-estimer',
    court: 'Vendeur',
  },
] as const;

export type CleProfil = (typeof PROFILS)[number]['cle'];

/** Les trois cartes en liens vers les pages métier — la page d'accueil. */
const Aiguillage = () => (
  <ul className="grid gap-4 md:grid-cols-3">
    {PROFILS.map((profil, index) => {
      const marine = index === 0;
      return (
        <Voile as="li" key={profil.cle} delai={echelonner(index)} className="flex">
          <Lien
            to={profil.href}
            className={cn(
              'rasante group flex min-h-[12.5rem] w-full flex-col gap-3.5 p-7',
              marine ? 'nuit bg-marine text-pierre' : 'panneau',
            )}
          >
            <span className="gravure">{profil.libelle}</span>
            <span className="font-serif text-[clamp(1.5rem,2.2vw,1.875rem)] leading-[1.1]">
              {profil.phrase}
            </span>
            <span className="mt-auto flex items-center justify-between gap-4 pt-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em]">
              {profil.action}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 shrink-0 transition-transform duration-4 ease-sortie group-hover:translate-x-1.5"
              />
            </span>
          </Lien>
        </Voile>
      );
    })}
  </ul>
);

export default Aiguillage;
