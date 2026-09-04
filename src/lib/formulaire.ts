import { useState } from 'react';

import { ADRESSE } from '@/config/legal';
import { envoyerFormulaire, type DemandeFormulaire, type ResultatEnvoi } from '@/lib/forms';

/**
 * Mécanique d'envoi, partagée par les deux formulaires du site.
 *
 * Elle vit ici et non dans `components/formulaire.tsx` parce qu'un fichier qui
 * exporte à la fois des composants et des utilitaires casse le rafraîchissement
 * à chaud de Vite — c'est la raison qui avait déjà fait sortir `echelonner`.
 */

/**
 * VALIDATION CÔTÉ CLIENT, AJOUTÉE LE 28/08/2026.
 *
 * Le formulaire porte `noValidate` — la validation native du navigateur est donc
 * désactivée — et rien ne la remplaçait : les erreurs venaient uniquement de la
 * réponse de `contact.php`. Deux conséquences relevées à l'essai :
 *
 *  1. TOUTE ERREUR COÛTAIT UN ALLER-RETOUR RÉSEAU. Un champ oublié, et il fallait
 *     attendre le serveur pour l'apprendre. Sur un lien lent, c'est du temps mort
 *     pendant lequel rien ne bouge à l'écran.
 *  2. « PRÉNOM * » ÉTAIT ANNONCÉ OBLIGATOIRE SANS QUE RIEN NE L'APPLIQUE. Le
 *     serveur ne signale que `nom`, `email` et `message` — il reçoit d'ailleurs
 *     un seul champ « nom », prénom et nom concaténés. L'astérisque promettait
 *     donc une contrainte inexistante. `contact.php` ne se réécrit pas : c'est le
 *     client qui tient la promesse.
 *
 * La fonction est pure et ne connaît pas le DOM : elle prend des règles, elle
 * rend des noms de champs. Les noms sont ceux des props `nom` des composants de
 * `components/formulaire.tsx`, donc exactement ce que `enErreur` sait relire —
 * y compris quand c'est le serveur qui les renvoie.
 */
export interface RegleChamp {
  nom: string;
  valeur: string;
  requis?: boolean;
  /** Contrôle de forme. `email` reste volontairement permissif : voir plus bas. */
  format?: 'email';
}

/**
 * Le motif d'adresse est DÉLIBÉRÉMENT LARGE : « quelque chose, un @, quelque
 * chose, un point, deux lettres au moins ». Une expression rationnelle stricte
 * rejette des adresses valides — apostrophes, signes plus, domaines longs — et
 * refuser un client qui a raison coûte plus cher que d'accepter une faute de
 * frappe, que le serveur attrapera de toute façon.
 */
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function champsInvalides(regles: RegleChamp[]): string[] {
  const fautifs: string[] = [];
  for (const regle of regles) {
    const valeur = regle.valeur.trim();
    if (regle.requis && !valeur) {
      fautifs.push(regle.nom);
      continue;
    }
    // Un champ facultatif laissé vide n'a pas de forme à respecter.
    if (regle.format === 'email' && valeur && !FORME_EMAIL.test(valeur)) {
      fautifs.push(regle.nom);
    }
  }
  return fautifs;
}

/**
 * Emmène le visiteur au premier champ à corriger.
 *
 * Relevé avant correction, sur la préversion : l'envoi partait, le serveur
 * répondait 422, les champs recevaient bien `aria-invalid` et le message
 * s'affichait — mais le focus restait sur `<body>` et la page ne bougeait pas.
 * Sur téléphone le message était hors écran : on voyait qu'il ne se passait
 * rien.
 *
 * `focus()` sans `preventScroll` amènerait la vue au ras du champ ; on préfère
 * le centrer, parce qu'un champ collé au bord haut passe sous l'en-tête collant.
 */
export function focaliserChamp(prefixe: string, nom: string): void {
  const champ = document.getElementById(`${prefixe}-${nom}`);
  if (!champ) return;
  champ.focus({ preventScroll: true });
  champ.scrollIntoView({ block: 'center', behavior: 'auto' });
}

/** État d'envoi et action, identiques pour le contact et l'estimation. */
export function useEnvoi() {
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [retour, setRetour] = useState<ResultatEnvoi | null>(null);

  const envoyer = async (demande: DemandeFormulaire) => {
    setEnvoiEnCours(true);
    setRetour(null);
    const resultat = await envoyerFormulaire(demande);
    setRetour(resultat);
    setEnvoiEnCours(false);
    return resultat;
  };

  return {
    envoiEnCours,
    retour,
    envoyer,
    /** Signale une erreur SANS appel réseau — la validation côté client. */
    signaler: setRetour,
    reinitialiser: () => setRetour(null),
  };
}

/**
 * Repli quand le serveur est muet : on ouvre le client mail du visiteur avec le
 * message déjà rédigé. C'est le seul envoi qu'un navigateur sache faire seul, et
 * il dépend d'un client configuré — d'où son statut de secours et non de
 * solution.
 *
 * Construit depuis la `DemandeFormulaire` et non depuis les champs bruts : les
 * deux formulaires n'ont pas les mêmes champs, mais tous deux produisent cette
 * structure. Le formulaire d'estimation n'avait aucun repli avant.
 */
export function lienMailto(demande: DemandeFormulaire): string {
  const corps = [
    `Nom : ${demande.nom}`.trim(),
    `E-mail : ${demande.email}`,
    demande.telephone ? `Téléphone : ${demande.telephone}` : '',
    demande.service ? `Service : ${demande.service}` : '',
    ...Object.entries(demande.details ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k} : ${v}`),
    '',
    demande.message ?? '',
  ]
    .filter(Boolean)
    .join('\n');

  const objet =
    demande.type === 'estimation' ? "Demande d'estimation depuis le site" : 'Demande depuis le site';

  return `mailto:${ADRESSE.email}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`;
}
