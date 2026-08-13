/**
 * Envoi des formulaires vers public/contact.php.
 *
 * En développement, Vite ne sait pas exécuter PHP : l'appel retombe sur la page
 * HTML de l'application et le message le dit explicitement, plutôt que
 * d'afficher un faux succès. Le test réel se fait sur l'hébergement.
 */

export interface DemandeFormulaire {
  type: 'contact' | 'estimation';
  nom: string;
  email: string;
  telephone?: string;
  service?: string;
  message?: string;
  /** Champs libres affichés tels quels dans l'e-mail (surface, pièces…). */
  details?: Record<string, string>;
  /** Champ leurre anti-robot : doit rester vide. */
  website?: string;
}

export interface ResultatEnvoi {
  ok: boolean;
  message: string;
  /** Noms des champs à corriger, renvoyés par le serveur. */
  champs?: string[];
}

const SUCCES = 'Message envoyé. Nous vous répondons sous 24 heures ouvrées.';
const INJOIGNABLE =
  "Le serveur n'a pas répondu. Écrivez-nous à j.immo.p@orange.fr ou appelez le 01 42 25 78 24.";
const SANS_PHP =
  "Le point d'entrée PHP n'est pas disponible ici : en développement, Vite ne l'exécute pas. À tester sur l'hébergement.";

export async function envoyerFormulaire(demande: DemandeFormulaire): Promise<ResultatEnvoi> {
  try {
    const reponse = await fetch('/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demande),
    });

    // Vite renvoie index.html pour toute route inconnue : sans ce garde-fou, on
    // annoncerait un envoi réussi alors que rien n'est parti.
    const typeContenu = reponse.headers.get('content-type') ?? '';
    if (!typeContenu.includes('application/json')) {
      return { ok: false, message: SANS_PHP };
    }

    const corps = await reponse.json();
    if (reponse.ok && corps.ok) {
      return { ok: true, message: SUCCES };
    }
    return {
      ok: false,
      message: corps.erreur ?? INJOIGNABLE,
      champs: corps.champs,
    };
  } catch {
    return { ok: false, message: INJOIGNABLE };
  }
}
