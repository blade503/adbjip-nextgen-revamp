import Header from '@/components/Header';
import { cn } from '@/lib/utils';

/**
 * Repli d'un chargement de route découpée — la page qui arrive, esquissée.
 *
 * LA VERSION PRÉCÉDENTE ÉTAIT UN BLOC MARINE DE 60 VH AVEC UN ANNEAU AU MILIEU.
 * Sur un site clair partout, c'était une coupure de courant : l'en-tête
 * disparaissait, la page devenait sombre, puis tout revenait — « plutôt moche »,
 * dit le client le 09/09/2026, et il avait raison. Depuis le préchargement de
 * `main.tsx`, ce repli ne se voit plus qu'en navigation interne, mais il se voit.
 *
 * Ici : l'en-tête reste en place (même composant, même `view-transition-name`,
 * la plaque ne clignote pas), et dessous la géométrie de l'ouverture d'une page
 * intérieure — surtitre, deux lignes de titre, chapeau, un bouton, l'image à
 * droite — en aplats de lin sur le crème. Pas de squelette qui scintille : une
 * seule boucle infinie est permise sur ce site (`@keyframes attente`), c'est
 * l'anneau, discret, à côté du mot.
 *
 * Contraintes conservées, et elles ne sont pas décoratives :
 *
 *  - `role="status"` sur la ligne de texte : entre le clic et l'arrivée du
 *    morceau il y a un silence ; sans annonce, une personne qui n'a pas
 *    d'écran ne sait pas si quelque chose se passe.
 *  - la classe `.attente` : la seule animation que le mouvement réduit
 *    conserve — ralentie à 2400 ms au lieu de supprimée. Un anneau immobile
 *    ne se lit plus comme un chargement.
 *  - la place est prise d'emblée, aux dimensions de l'ouverture réelle :
 *    l'arrivée du contenu ne décale pas la mise en page.
 *  - les aplats sont `aria-hidden` : ce sont des formes, pas du contenu.
 */
const Aplat = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn('block bg-lin', className)} />
);

const Attente = () => (
  <div className="min-h-screen bg-pierre">
    <Header />
    <main className="bg-pierre pb-14 pt-10 lg:pb-16 lg:pt-16">
      <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Aplat className="h-3 w-36" />
          <Aplat className="mt-7 h-11 w-[92%] sm:h-14 lg:h-16" />
          <Aplat className="mt-3 h-11 w-[68%] sm:h-14 lg:h-16" />
          <Aplat className="mt-8 h-4 w-[96%]" />
          <Aplat className="mt-2.5 h-4 w-[88%]" />
          <Aplat className="mt-2.5 h-4 w-[57%]" />
          <Aplat className="mt-9 h-12 w-48" />
          <p role="status" className="gravure mt-10 flex items-center gap-3">
            <span
              aria-hidden
              className="attente block h-3.5 w-3.5 rounded-full border-b-2 border-primary-ink"
            />
            Chargement de la page
          </p>
        </div>
        <Aplat className="aspect-[3/2] w-full lg:aspect-[4/3]" />
      </div>
    </main>
  </div>
);

export default Attente;
