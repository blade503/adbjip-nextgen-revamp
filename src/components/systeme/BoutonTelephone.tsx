import { Phone } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';

/** Le numéro en `tel:`, sans espaces — une seule écriture pour tout le site. */
export const TEL = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

/**
 * Le bouton d'appel — le numéro de l'agence, composé en chiffres.
 *
 * Chez une agence de gérance, le téléphone EST le tunnel de conversion : le
 * propriétaire d'un lot appelle, il ne remplit pas un formulaire. Le numéro est
 * donc partout un bouton, jamais une ligne de coordonnées, et il est composé
 * en Archivo (`registre="chiffre"`) parce qu'un numéro en capitales espacées
 * n'existe pas.
 *
 * Sur le crème il est cerné (`secondary`) ; sur les blocs de marine il est la
 * plaque de laiton (`default`), et c'est l'appelant qui choisit.
 */
const BoutonTelephone = ({
  variant = 'secondary',
  size = 'lg',
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'className'>) => (
  <Button variant={variant} size={size} registre="chiffre" className={className} asChild>
    <a href={TEL}>
      <Phone aria-hidden />
      {ADRESSE.telephone}
    </a>
  </Button>
);

export default BoutonTelephone;
