import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Champ,
  Leurre,
  Liste,
  MentionRgpd,
  Rangee,
  Retour,
  ZoneTexte,
} from '@/components/formulaire';
import { useEnvoi } from '@/lib/formulaire';
import type { DemandeFormulaire } from '@/lib/forms';

/**
 * Formulaire de contact.
 *
 * Le balisage des champs n'est pas écrit ici : il vient de
 * `@/components/formulaire`, partagé avec le formulaire d'estimation. Les deux
 * pages avaient auparavant deux copies parallèles, qui avaient divergé — celle
 * de l'estimation n'avait ni champ leurre, ni mention RGPD, ni repli `mailto`.
 *
 * PRÉSENTATION : le champ réglé — un filet en pied de champ qui passe au laiton
 * à la saisie, pas de boîte. C'est ce que fait un registre : il règle la ligne,
 * il n'encadre pas le mot. L'anneau de focus est conservé EN PLUS du filet : le
 * filet seul ne suffit pas à signaler où l'on est au clavier.
 *
 * PRÉ-REMPLISSAGE : le service arrive par `?service=` depuis le pré-triage de la
 * page d'accueil. La valeur est VALIDÉE contre la liste — une valeur inconnue
 * dans l'URL laisserait la liste déroulante sur une option qui n'existe pas, et
 * le visiteur enverrait une demande sans service.
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

/** Les valeurs sont celles du paramètre `?service=` — ne pas les renommer. */
const SERVICES: [string, string][] = [
  ['', 'À préciser'],
  ['gestion-locative', 'Gérance locative'],
  ['gestion-copropriete', 'Syndic de copropriété'],
  ['achats-ventes', 'Achat et vente'],
  ['estimation', 'Estimation'],
  ['autre', 'Autre'],
];

const SERVICES_CONNUS = new Set(SERVICES.map(([valeur]) => valeur).filter(Boolean));

/** @param idPrefix distingue les identifiants quand deux formulaires cohabitent. */
const FormulaireContact = ({ idPrefix = 'contact' }: { idPrefix?: string }) => {
  const [parametres] = useSearchParams();
  const serviceInitial = parametres.get('service') ?? '';

  const [champs, setChamps] = useState({
    ...CHAMPS_VIDES,
    service: SERVICES_CONNUS.has(serviceInitial) ? serviceInitial : '',
  });
  const { envoiEnCours, retour, envoyer } = useEnvoi();

  const modifier =
    (nom: keyof typeof CHAMPS_VIDES) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setChamps((precedent) => ({ ...precedent, [nom]: event.target.value }));

  const demande = (): DemandeFormulaire => ({
    type: 'contact',
    nom: `${champs.firstName} ${champs.lastName}`.trim(),
    email: champs.email,
    telephone: champs.phone,
    service: champs.service,
    message: champs.message,
    website: champs.website,
  });

  const soumettre = async (event: React.FormEvent) => {
    event.preventDefault();
    const resultat = await envoyer(demande());
    if (resultat.ok) setChamps(CHAMPS_VIDES);
  };

  return (
    <form className="relative space-y-8" onSubmit={soumettre} noValidate>
      <Rangee>
        <Champ
          prefixe={idPrefix} nom="prenom" etiquette="Prénom" requis
          type="text" autoComplete="given-name"
          enErreur={retour?.champs} value={champs.firstName} onChange={modifier('firstName')}
        />
        <Champ
          prefixe={idPrefix} nom="nom" etiquette="Nom" requis
          type="text" autoComplete="family-name"
          enErreur={retour?.champs} value={champs.lastName} onChange={modifier('lastName')}
        />
        <Champ
          prefixe={idPrefix} nom="email" etiquette="Courriel" requis
          type="email" autoComplete="email"
          enErreur={retour?.champs} value={champs.email} onChange={modifier('email')}
        />
        <Champ
          prefixe={idPrefix} nom="telephone" etiquette="Téléphone"
          type="tel" autoComplete="tel"
          enErreur={retour?.champs} value={champs.phone} onChange={modifier('phone')}
        />
      </Rangee>

      <Liste
        prefixe={idPrefix} nom="service" etiquette="Votre demande"
        options={SERVICES} enErreur={retour?.champs}
        value={champs.service} onChange={modifier('service')}
      />

      <ZoneTexte
        prefixe={idPrefix} nom="message" etiquette="Message" requis
        rows={5}
        placeholder="Le bien ou l'immeuble concerné, son arrondissement, et ce que vous attendez."
        enErreur={retour?.champs} value={champs.message} onChange={modifier('message')}
      />

      <Leurre valeur={champs.website} onChange={modifier('website')} />

      <Button type="submit" size="lg" disabled={envoiEnCours} className="group w-full sm:w-auto">
        {envoiEnCours ? 'Envoi en cours…' : 'Envoyer'}
        <ArrowRight
          aria-hidden
          className="transition-transform duration-3 ease-sortie group-hover:translate-x-1"
        />
      </Button>

      <MentionRgpd />
      <Retour retour={retour} demande={demande()} />
    </form>
  );
};

export default FormulaireContact;
