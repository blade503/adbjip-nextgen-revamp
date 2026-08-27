/**
 * Les questions posées avant de confier un immeuble.
 *
 * RÈGLE, la même que pour `avis.ts` : **rien d'inventé devant le visiteur.**
 * Les questions sont verrouillées — elles viennent de ce que l'agence entend
 * réellement — mais les réponses, elles, ne se déduisent pas. Un délai de
 * résiliation, un taux d'honoraires, l'existence d'un extranet : chacune de ces
 * valeurs n'existe que dans la tête de l'agence. Les écrire « au plausible »
 * serait refaire la faute des trois faux témoignages de 2026.
 *
 * Une question dont `reponse` est `null` ne s'affiche pas. Si aucune n'est
 * renseignée, la section entière disparaît — c'est le comportement de la
 * section Avis, et c'est le seul qui garantisse qu'on ne publie jamais un
 * « à compléter ».
 *
 * L'ORDRE N'EST PAS ARBITRAIRE : le conseil syndical d'abord. Un mandat de
 * syndic est le contrat le plus rentable de la maison, et « comment change-t-on
 * de syndic » est la requête qui amène ce visiteur-là.
 *
 * Le balisage `FAQPage` (données structurées) ne se pose que sur des réponses
 * réellement écrites — voir `src/pages/Index.tsx`. Baliser du vide vaut moins
 * que ne rien baliser.
 */

export interface Question {
  /** Formulée comme le visiteur la pose, pas comme l'agence la classe. */
  question: string;
  /**
   * Réponse littérale, fournie par l'agence. `null` tant qu'elle ne l'a pas
   * été : la question ne s'affiche alors pas du tout.
   */
  reponse: string | null;
  /**
   * Provenance de la réponse, pour qu'on sache dix mois plus tard sur quoi elle
   * s'appuie. Obligatoire dès que `reponse` est renseignée.
   */
  source?: string;
  /**
   * Action au pied de la réponse. C'est ce qui fait d'une FAQ une surface de
   * conversion plutôt qu'une page d'aide : le visiteur vient d'obtenir sa
   * réponse, c'est le meilleur moment pour lui proposer la suite. Les valeurs
   * de `service` sont celles que `FormulaireContact` sait présélectionner.
   */
  action?: { libelle: string; href: string };
}

export const QUESTIONS: Question[] = [
  {
    question: "Comment change-t-on de syndic, et en combien de temps ?",
    reponse: null,
    action: {
      libelle: 'Demander une mise en concurrence',
      href: '/contact?service=gestion-copropriete',
    },
  },
  {
    question: "Reprenez-vous un immeuble en cours d'exercice ?",
    reponse: null,
    action: { libelle: 'Parler de notre immeuble', href: '/contact?service=gestion-copropriete' },
  },
  {
    question: "Quels sont vos honoraires, et qu'est-ce qui est compris ?",
    reponse: null,
    action: { libelle: 'Demander une proposition', href: '/contact' },
  },
  {
    question: "Que se passe-t-il si mon locataire ne paie pas ?",
    reponse: null,
    action: { libelle: 'Confier un bien en gérance', href: '/contact?service=gestion-locative' },
  },
  {
    question: "Puis-je suivre mes comptes et mes documents en ligne ?",
    reponse: null,
  },
  {
    question: "Gérez-vous aussi la vente de mon lot ?",
    reponse: null,
    action: { libelle: 'Vendre ou faire estimer', href: '/contact?service=achats-ventes' },
  },
  {
    question: "Sur quel secteur intervenez-vous ?",
    reponse: null,
  },
];

/** Les seules affichables : celles qui ont une réponse. */
export const questionsRepondues = QUESTIONS.filter(
  (q): q is Question & { reponse: string } => !!q.reponse?.trim(),
);

/**
 * Vrai tant qu'une question attend sa réponse. Rendu visible dans l'atelier
 * (`/atelier`, développement seulement) pour que l'attente ne s'oublie pas —
 * une section absente ne réclame rien d'elle-même.
 */
export const questionsIncompletes = questionsRepondues.length < QUESTIONS.length;
