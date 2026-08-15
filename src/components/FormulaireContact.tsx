import { useState } from 'react';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { envoyerFormulaire } from '@/lib/forms';

/**
 * Formulaire de contact, partagé par la section d'accueil et la page /contact.
 *
 * Les deux étaient jusqu'ici deux copies du même balisage, aucune des deux
 * n'envoyait quoi que ce soit. Un seul composant évite que l'une reparte en
 * arrière pendant qu'on corrige l'autre.
 */

const CHAMPS_VIDES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  /** Champ leurre : hors écran, rempli par la plupart des robots. */
  website: '',
};

const SERVICES = [
  ['gestion-locative', 'Gestion Locative'],
  ['gestion-copropriete', 'Gestion de Copropriété'],
  ['achats-ventes', 'Achats & Ventes'],
  ['estimation', 'Estimation de Biens'],
  ['autre', 'Autre'],
];

/**
 * Repli quand le serveur ne répond pas : on ouvre le client mail du visiteur
 * avec le message déjà rédigé. C'est le seul envoi d'e-mail qu'un navigateur
 * sait faire seul — il dépend d'un client mail configuré, d'où son statut de
 * secours et non de solution principale.
 */
const lienMailto = (champs: typeof CHAMPS_VIDES) => {
  const corps = [
    `Nom : ${champs.firstName} ${champs.lastName}`.trim(),
    `E-mail : ${champs.email}`,
    champs.phone ? `Téléphone : ${champs.phone}` : '',
    champs.service ? `Service : ${champs.service}` : '',
    '',
    champs.message,
  ]
    .filter(Boolean)
    .join('\n');

  return `mailto:j.immo.p@orange.fr?subject=${encodeURIComponent(
    'Demande depuis le site',
  )}&body=${encodeURIComponent(corps)}`;
};

/** @param idPrefix distingue les identifiants quand les deux formulaires cohabitent. */
const FormulaireContact = ({ idPrefix = 'contact' }: { idPrefix?: string }) => {
  const [champs, setChamps] = useState(CHAMPS_VIDES);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [retour, setRetour] = useState<{ ok: boolean; message: string; champs?: string[] } | null>(
    null,
  );

  const id = (nom: string) => `${idPrefix}-${nom}`;

  const modifier =
    (nom: keyof typeof CHAMPS_VIDES) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setChamps((precedent) => ({ ...precedent, [nom]: event.target.value }));

  const soumettre = async (event: React.FormEvent) => {
    event.preventDefault();
    setEnvoiEnCours(true);
    setRetour(null);

    const resultat = await envoyerFormulaire({
      type: 'contact',
      nom: `${champs.firstName} ${champs.lastName}`.trim(),
      email: champs.email,
      telephone: champs.phone,
      service: champs.service,
      message: champs.message,
      website: champs.website,
    });

    setRetour(resultat);
    setEnvoiEnCours(false);
    if (resultat.ok) setChamps(CHAMPS_VIDES);
  };

  return (
    <form className="space-y-6" onSubmit={soumettre} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={id('firstName')} className="block text-sm font-medium mb-2">
            Prénom *
          </label>
          <Input
            id={id('firstName')}
            type="text"
            placeholder="Votre prénom"
            className="glass border-primary/20 focus:border-primary"
            value={champs.firstName}
            onChange={modifier('firstName')}
            required
          />
        </div>
        <div>
          <label htmlFor={id('lastName')} className="block text-sm font-medium mb-2">
            Nom *
          </label>
          <Input
            id={id('lastName')}
            type="text"
            placeholder="Votre nom"
            className="glass border-primary/20 focus:border-primary"
            value={champs.lastName}
            onChange={modifier('lastName')}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={id('email')} className="block text-sm font-medium mb-2">
            Email *
          </label>
          <Input
            id={id('email')}
            type="email"
            placeholder="votre@email.com"
            className="glass border-primary/20 focus:border-primary"
            value={champs.email}
            onChange={modifier('email')}
            required
          />
        </div>
        <div>
          <label htmlFor={id('phone')} className="block text-sm font-medium mb-2">
            Téléphone
          </label>
          <Input
            id={id('phone')}
            type="tel"
            placeholder="06 12 34 56 78"
            className="glass border-primary/20 focus:border-primary"
            value={champs.phone}
            onChange={modifier('phone')}
          />
        </div>
      </div>

      <div>
        <label htmlFor={id('service')} className="block text-sm font-medium mb-2">
          Service souhaité
        </label>
        <select
          id={id('service')}
          className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-colors"
          value={champs.service}
          onChange={modifier('service')}
        >
          <option value="">Sélectionnez un service</option>
          {SERVICES.map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={id('message')} className="block text-sm font-medium mb-2">
          Message *
        </label>
        <Textarea
          id={id('message')}
          placeholder="Décrivez votre projet ou votre demande..."
          rows={6}
          className="glass border-primary/20 focus:border-primary resize-none"
          value={champs.message}
          onChange={modifier('message')}
          required
        />
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={champs.website}
        onChange={modifier('website')}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <Button
        type="submit"
        size="lg"
        disabled={envoiEnCours}
        className="w-full bg-primary hover:bg-primary-glow text-primary-foreground hover-glow group"
      >
        <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        {envoiEnCours ? 'Envoi en cours…' : 'Envoyer le message'}
      </Button>

      {/* Obligation d'information : le visiteur doit savoir ce qu'il advient de
          ce qu'il écrit, à l'endroit où il l'écrit. */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Vos informations servent uniquement à traiter votre demande et ne sont ni cédées ni
        revendues.{' '}
        <Link to="/mentions-legales#donnees-personnelles" className="underline hover:text-primary">
          En savoir plus
        </Link>
        .
      </p>

      {retour && (
        <div
          role="status"
          className={`rounded-lg border p-3 text-sm ${
            retour.ok
              ? 'border-primary/40 bg-primary-soft text-foreground'
              : 'border-destructive/30 bg-destructive/5 text-destructive'
          }`}
        >
          <p>{retour.message}</p>
          {!retour.ok && (
            <a href={lienMailto(champs)} className="mt-2 inline-block font-medium underline">
              Ouvrir mon logiciel de messagerie avec ce message
            </a>
          )}
        </div>
      )}
    </form>
  );
};

export default FormulaireContact;
