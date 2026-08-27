/**
 * Repli d'un chargement de route découpée.
 *
 * Contraintes de la charte respectées ici, et elles ne sont pas décoratives :
 *
 *  - `role="status"` : le changement de page est déjà annoncé par
 *    `ScrollManager`, mais entre le clic et l'arrivée du morceau il y a un
 *    silence. Sans annonce, une personne qui n'a pas d'écran ne sait pas si
 *    quelque chose se passe.
 *  - la classe `.attente` : c'est la seule animation que le mouvement réduit
 *    conserve — ralentie à 2400 ms au lieu de supprimée. Un bloc immobile SANS
 *    animation ne se lit plus comme un chargement.
 *  - une hauteur minimale posée en `min-h`, jamais animée : le repli occupe
 *    d'emblée la place de la page, ce qui évite que l'arrivée du contenu
 *    décale la mise en page. L'objectif CLS du projet est zéro.
 *
 * Le texte reste sobre : ce repli ne doit apparaître qu'une fraction de seconde
 * sur une connexion normale. S'il devient visible longtemps, c'est le découpage
 * qu'il faut revoir, pas le message.
 */
const Attente = () => (
  <div
    role="status"
    className="nuit flex min-h-[60vh] items-center justify-center bg-nuit px-6 text-pierre"
  >
    <p className="flex items-center gap-3 font-display text-[0.8125rem] uppercase tracking-[0.14em]">
      <span
        aria-hidden
        className="attente block h-4 w-4 rounded-full border-b-2 border-laiton"
      />
      Chargement de la page
    </p>
  </div>
);

export default Attente;
