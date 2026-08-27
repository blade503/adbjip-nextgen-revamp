import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { lienMailto } from '@/lib/formulaire';
import type { DemandeFormulaire, ResultatEnvoi } from '@/lib/forms';
import { cn } from '@/lib/utils';
import { Lien } from '@/components/systeme/Lien';

/**
 * Les briques des formulaires — UNE SEULE implémentation du balisage.
 *
 * Le site avait deux formulaires avec deux balisages parallèles : celui de
 * contact et celui d'estimation. Ils avaient déjà divergé — le second n'avait ni
 * champ leurre, ni mention RGPD, ni repli `mailto`, et ses étiquettes étaient
 * restées à l'ancien style. Deux copies d'un même balisage divergent toujours,
 * et c'est la copie oubliée qui perd les demandes.
 *
 * Les champs des deux formulaires ne sont pas les mêmes — l'estimation demande
 * une adresse, une surface, un objectif. Ce qui est mutualisé, c'est donc la
 * BRIQUE et non le formulaire : chaque champ, le leurre, la mention, le retour.
 */

/** Identifiant stable, préfixé pour que deux formulaires puissent cohabiter. */
const idChamp = (prefixe: string, nom: string) => `${prefixe}-${nom}`;

interface BaseChamp {
  /** Clé côté serveur : c'est elle que `contact.php` renvoie dans `champs`. */
  nom: string;
  etiquette: string;
  prefixe: string;
  /** Champs signalés par le serveur, pour `aria-describedby` et `aria-invalid`. */
  enErreur?: string[];
  requis?: boolean;
  className?: string;
}

/** Le message d'erreur d'un champ, relié par `aria-describedby`. */
const Erreur = ({ id, visible }: { id: string; visible: boolean }) =>
  visible ? (
    <p id={id} className="mt-1.5 text-[0.75rem] text-destructive-ink">
      Ce champ est à vérifier.
    </p>
  ) : null;

export const Champ = ({
  nom,
  etiquette,
  prefixe,
  enErreur,
  requis,
  className,
  ...props
}: BaseChamp & React.ComponentProps<'input'>) => {
  const id = idChamp(prefixe, nom);
  const faute = !!enErreur?.includes(nom);
  return (
    <div className={className}>
      <label htmlFor={id} className="etiquette-champ">
        {etiquette}
        {requis && ' *'}
      </label>
      <Input
        id={id}
        aria-invalid={faute || undefined}
        aria-describedby={faute ? `${id}-erreur` : undefined}
        required={requis}
        {...props}
      />
      <Erreur id={`${id}-erreur`} visible={faute} />
    </div>
  );
};

export const ZoneTexte = ({
  nom,
  etiquette,
  prefixe,
  enErreur,
  requis,
  className,
  ...props
}: BaseChamp & React.ComponentProps<'textarea'>) => {
  const id = idChamp(prefixe, nom);
  const faute = !!enErreur?.includes(nom);
  return (
    <div className={className}>
      <label htmlFor={id} className="etiquette-champ">
        {etiquette}
        {requis && ' *'}
      </label>
      <Textarea
        id={id}
        aria-invalid={faute || undefined}
        aria-describedby={faute ? `${id}-erreur` : undefined}
        required={requis}
        {...props}
      />
      <Erreur id={`${id}-erreur`} visible={faute} />
    </div>
  );
};

/**
 * La liste déroulante. `appearance: none` retire le fond et le cadre du
 * navigateur, mais emporte aussi le chevron : il est redessiné par la classe
 * `.champ-liste` (un SVG en data-URI, une seule règle CSS). Ne pas empiler
 * d'utilitaires de fond en ligne — quatre déclarations `bg-[…]` se
 * contredisaient et Chrome affichait un carré noir à la place du chevron.
 */
export const Liste = ({
  nom,
  etiquette,
  prefixe,
  enErreur,
  requis,
  className,
  options,
  ...props
}: BaseChamp & { options: [string, string][] } & React.ComponentProps<'select'>) => {
  const id = idChamp(prefixe, nom);
  const faute = !!enErreur?.includes(nom);
  return (
    <div className={className}>
      <label htmlFor={id} className="etiquette-champ">
        {etiquette}
        {requis && ' *'}
      </label>
      <select
        id={id}
        className="champ-regle champ-liste"
        aria-invalid={faute || undefined}
        aria-describedby={faute ? `${id}-erreur` : undefined}
        required={requis}
        {...props}
      >
        {options.map(([valeur, libelle]) => (
          <option key={valeur} value={valeur}>
            {libelle}
          </option>
        ))}
      </select>
      <Erreur id={`${id}-erreur`} visible={faute} />
    </div>
  );
};

/**
 * Champ leurre. Hors écran plutôt que `display: none` : certains robots ignorent
 * les champs masqués, aucun n'ignore un champ positionné loin. `tabIndex={-1}`
 * le sort du parcours clavier, `aria-hidden` le sort de l'arbre d'accessibilité.
 * `contact.php` répond 200 sans rien envoyer s'il est rempli — un robot qui
 * reçoit une erreur réessaie, un robot qui reçoit un succès s'en va.
 */
export const Leurre = ({
  valeur,
  onChange,
}: {
  valeur: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <input
    type="text"
    name="website"
    tabIndex={-1}
    autoComplete="off"
    aria-hidden="true"
    value={valeur}
    onChange={onChange}
    className="absolute left-[-9999px] h-0 w-0 opacity-0"
  />
);

/**
 * Obligation d'information : le visiteur doit savoir ce qu'il advient de ce
 * qu'il écrit, À L'ENDROIT où il l'écrit. Une mention en pied de page ne
 * satisfait pas cette exigence — elle est hors du champ de vision au moment du
 * consentement.
 */
export const MentionRgpd = () => (
  <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
    Vos informations servent uniquement à traiter votre demande et ne sont ni cédées ni
    revendues.{' '}
    <Lien to="/mentions-legales#donnees-personnelles" className="lien-trait">
      En savoir plus
    </Lien>
  </p>
);

/**
 * Le retour d'envoi. `role="status"` et non `role="alert"` : l'annonce doit
 * attendre la fin de la lecture en cours plutôt que l'interrompre. Le repli
 * `mailto` n'apparaît qu'en cas d'échec, avec le message déjà rédigé.
 */
export const Retour = ({
  retour,
  demande,
}: {
  retour: ResultatEnvoi | null;
  demande: DemandeFormulaire;
}) => {
  if (!retour) return null;
  return (
    <div
      role="status"
      className={cn(
        'border-l-2 py-3 pl-4 text-[0.875rem]',
        retour.ok
          ? 'border-primary bg-[hsl(var(--laiton)/0.08)]'
          : 'border-destructive bg-destructive/5 text-destructive-ink',
      )}
    >
      <p>{retour.message}</p>
      {!retour.ok && (
        <a href={lienMailto(demande)} className="lien-trait mt-2 inline-flex font-medium">
          Ouvrir mon logiciel de messagerie avec ce message
        </a>
      )}
    </div>
  );
};

/** Rangée de champs : deux colonnes au-delà de sm, une en dessous. */
export const Rangee = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">{children}</div>
);
