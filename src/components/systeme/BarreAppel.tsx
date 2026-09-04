import { Phone } from 'lucide-react';

import { TEL } from '@/components/systeme/BoutonTelephone';
import { Lien } from '@/components/systeme/Lien';
import { Button } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';

/**
 * La barre d'appel — téléphone seulement.
 *
 * Fixée au bas de l'écran, elle porte le numéro de l'agence en plaque de
 * laiton et UNE action contextuelle : « Confier » sur la gérance, « Estimer »
 * sur le portefeuille, « Demander une visite » sur une fiche. C'est la réponse
 * de la direction « La Plaque » au constat des planches : sur téléphone, le
 * numéro était à 3 000 px du haut de page, dans le pied de page.
 *
 * Deux choix qui ne sont pas de goût :
 *  - fond OPAQUE et non verre dépoli : le `backdrop-filter` de la planche
 *    coûte un repeint à chaque trame de défilement et n'apporte rien à la
 *    lecture. Un filet d'encre sépare la barre du contenu.
 *  - un ESPACEUR de la hauteur de la barre est rendu à côté : sans lui, la
 *    barre recouvrirait les derniers liens du pied de page, qui deviendraient
 *    inatteignables au doigt. Il est `aria-hidden` : il n'existe que pour la
 *    mise en page.
 *
 * `env(safe-area-inset-bottom)` : sur un iPhone sans bouton, la barre remonte
 * au-dessus de l'indicateur d'accueil au lieu de passer dessous.
 */
const BarreAppel = ({ action }: { action?: { libelle: string; href: string } }) => (
  <>
    <div aria-hidden className="h-[4.75rem] lg:hidden" />
    <nav
      aria-label="Appeler ou écrire à l'agence"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2.5 border-t border-[hsl(var(--trait)/var(--trait-a))] bg-pierre px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden"
    >
      <Button
        registre="chiffre"
        className="flex-1 bg-laiton text-encre hover:bg-primary-glow"
        asChild
      >
        <a href={TEL}>
          <Phone aria-hidden />
          {ADRESSE.telephone}
        </a>
      </Button>
      {action && (
        <Button variant="secondary" asChild>
          <Lien to={action.href}>{action.libelle}</Lien>
        </Button>
      )}
    </nav>
  </>
);

export default BarreAppel;
