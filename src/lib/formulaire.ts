import { useState } from 'react';

import { envoyerFormulaire, type DemandeFormulaire, type ResultatEnvoi } from '@/lib/forms';

/**
 * Mécanique d'envoi, partagée par les deux formulaires du site.
 *
 * Elle vit ici et non dans `components/formulaire.tsx` parce qu'un fichier qui
 * exporte à la fois des composants et des utilitaires casse le rafraîchissement
 * à chaud de Vite — c'est la raison qui avait déjà fait sortir `echelonner`.
 */

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

  return { envoiEnCours, retour, envoyer, reinitialiser: () => setRetour(null) };
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

  return `mailto:j.immo.p@orange.fr?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`;
}
