import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';
import { sansMouvement } from '@/lib/mouvement';

/**
 * « Ouverture » — le langage de mouvement du site.
 *
 * Trois gestes, et rien d'autre :
 *
 *  - LE TRAIT  (`<Trait />`)  : le filet se tire de la gauche, 900 ms. C'est la
 *    ponctuation du site, et le seul geste qui se répète sur toutes les pages.
 *  - LE VOILE  (`<Voile />`)  : le contenu monte de 20 px pendant que son propre
 *    cadre s'ouvre par le bas (`clip-path`). Il se dévoile de derrière le trait ;
 *    il n'arrive pas en volant depuis le bord de l'écran.
 *  - LE CALAGE (`<Calage />`) : l'image se pose depuis 1,05, une fois, à
 *    l'entrée. Jamais en boucle — un travelling qui ne s'arrête pas est un
 *    écran de veille.
 *
 * La courbe est la même partout (`--sortie`, sortie exponentielle) : rapide au
 * départ, longue à l'arrivée, sans dépassement. C'est le mouvement d'une porte
 * cochère lourde qu'on relâche, et c'est aussi pourquoi il n'y a plus une seule
 * courbe à rebond dans le projet.
 *
 * Le décalage entre frères est en CSS (`animation-delay`) et non en JavaScript :
 * un `setTimeout` par élément se désynchronise du rendu, et surtout le
 * `prefers-reduced-motion` peut remettre le délai à zéro d'une seule règle.
 */

/* ------------------------------------------------------------------ */

/**
 * Un seul observateur pour toute la page.
 *
 * Un `IntersectionObserver` par élément, c'est une centaine d'observateurs sur
 * la page d'accueil, chacun avec son propre lot de calculs de position à chaque
 * défilement. Ici : un observateur, une entrée par élément, et l'élément est
 * relâché dès qu'il est passé — l'animation ne se joue qu'une fois, il n'y a
 * donc rien à surveiller ensuite.
 */
const rappels = new WeakMap<Element, () => void>();
let observateur: IntersectionObserver | null = null;

const obtenirObservateur = () => {
  if (observateur) return observateur;
  if (typeof IntersectionObserver === 'undefined') return null;

  observateur = new IntersectionObserver(
    (entrees) => {
      for (const entree of entrees) {
        if (!entree.isIntersecting) continue;
        rappels.get(entree.target)?.();
        rappels.delete(entree.target);
        observateur?.unobserve(entree.target);
      }
    },
    {
      /**
       * QUAND L'APPARITION SE DÉCLENCHE — deux réglages, et ils se cumulent.
       *
       * La marge basse retire un bandeau du bas de l'écran : l'élément doit être
       * entré d'autant avant que l'observateur ne le signale. Sans elle,
       * l'animation se jouerait pendant que l'élément affleure le bord, et le
       * visiteur ne verrait arriver qu'un contenu déjà posé.
       *
       * MESURÉ, pas estimé. Sonde : `MutationObserver` sur `data-visible`
       * pendant un défilement par pas de 24 px avec attente de deux trames — le
       * rappel de l'observateur est cadencé sur la trame, et un pas plus large
       * attribuait à l'élément une position relevée un ou deux pas APRÈS son
       * déclenchement réel. Médiane de la distance entre le HAUT de l'élément et
       * le BAS de l'écran au moment du déclenchement, sur trois pages, écran de
       * 390 × 844 :
       *
       *     −12 % / seuil 0,04 .... 103 · 93 · 104 px   (l'ancien réglage)
       *     −7 %  / seuil 0 .......  49 · 43 ·  55 px   ← retenu
       *     −2 %  / seuil 0 .......   1 ·  1 ·   8 px   (trop tôt)
       *
       * À −2 % l'élément se déclenche à l'instant où son bord touche le bas de
       * l'écran : les 800 ms d'animation sont consommées avant qu'il soit
       * vraiment visible, et le geste est perdu. −7 % divise l'attente par deux
       * sans tomber dans ce piège.
       *
       * LE SEUIL PASSE DE 0,04 À 0, et c'est la moitié du gain. Un seuil est une
       * FRACTION DE LA SURFACE de l'élément : 4 % d'un bloc de 1 200 px, c'est
       * 48 px de haut à faire entrer EN PLUS de la marge. Les blocs hauts
       * attendaient donc bien plus longtemps que les petits, sans raison — deux
       * sections voisines n'apparaissaient pas au même endroit de l'écran. À 0,
       * le déclenchement ne dépend plus que de la marge, donc de la géométrie de
       * l'écran, la même pour tous.
       */
      rootMargin: '0px 0px -7% 0px',
      threshold: 0,
    },
  );
  return observateur;
};

/**
 * Trois états, et non deux — la raison est le prérendu.
 *
 * `npm run build` écrit les dix pages en HTML statique (`scripts/prerender.mjs`).
 * Si le masquage était en CSS pur — `[data-voile] { opacity: 0 }` — ce HTML
 * partirait en production avec un contenu invisible : le visiteur verrait une
 * page vide jusqu'à ce que le bundle React arrive et déclenche l'observateur, et
 * ne verrait jamais rien du tout si le JavaScript échouait. Or c'est précisément
 * ce que le prérendu existe pour éviter.
 *
 * Le masquage est donc décidé en JavaScript, au montage, et seulement pour ce
 * qui est SOUS LE PLI :
 *
 *   'immediat'  déjà à l'écran au montage → jamais masqué, jamais animé. Rien
 *               de ce que le visiteur a déjà sous les yeux ne disparaît.
 *   'attente'   sous le pli → masqué, en attente de l'observateur.
 *   'entre'     l'observateur a signalé l'entrée → l'animation se joue.
 *
 * Sans JavaScript, aucun élément ne reçoit `data-voile` : la page prérendue est
 * lisible telle quelle. C'est aussi ce qui explique que l'ouverture (`Hero`)
 * n'utilise pas ce composant mais la classe CSS `.voile` — son animation doit
 * partir au premier rendu, avec ou sans JavaScript, et elle est au-dessus du
 * pli par définition.
 */
type Etat = 'immediat' | 'attente' | 'entre';

function useEntree<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [etat, setEtat] = useState<Etat>('immediat');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // `?mouvement=0` : on ne masque rien du tout. Le CSS force déjà l'opacité à
    // 1, mais sortir ici évite en plus d'observer une centaine d'éléments pour
    // rien — l'interrupteur sert à mesurer une page sans le système, pas à le
    // faire tourner à vide.
    if (sansMouvement()) return;

    const obs = obtenirObservateur();
    // Sans `IntersectionObserver`, on ne masque rien : renoncer à l'animation
    // vaut mieux que laisser la page définitivement vide.
    if (!obs) return;

    // 90 % de la hauteur d'écran et non 100 % : un élément qui affleure tout
    // juste le bas du pli serait masqué alors qu'il est déjà peint, et
    // l'observateur le révélerait aussitôt — ce qui produit exactement le
    // clignotement qu'on cherche à supprimer.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    setEtat('attente');
    rappels.set(element, () => setEtat('entre'));
    obs.observe(element);

    return () => {
      rappels.delete(element);
      obs.unobserve(element);
    };
    // Au montage seulement : mesurer à nouveau après un changement d'état
    // remettrait un élément déjà entré en attente.
  }, []);

  return {
    ref,
    masque: etat !== 'immediat',
    visible: etat === 'entre',
  };
}

/* ------------------------------------------------------------------ */

interface ProprietesVoile {
  children: ReactNode;
  /** Balise rendue. `div` par défaut. */
  as?: ElementType;
  /** Décalage d'entrée, en millisecondes. Voir `echelonner()`. */
  delai?: number;
  className?: string;
}

/** Le voile : le contenu se dévoile de derrière le trait. */
export const Voile = ({ children, as: Balise = 'div', delai = 0, className }: ProprietesVoile) => {
  const { ref, masque, visible } = useEntree<HTMLDivElement>();

  return (
    <Balise
      ref={ref}
      data-voile={masque ? '' : undefined}
      data-visible={visible || undefined}
      style={delai ? { animationDelay: `${delai}ms` } : undefined}
      className={className}
    >
      {children}
    </Balise>
  );
};

/* ------------------------------------------------------------------ */

/** Le trait : filet de 1 px qui se tire de la gauche. */
export const Trait = ({ className }: { className?: string }) => {
  const { ref, masque, visible } = useEntree<HTMLHRElement>();

  return (
    <hr
      ref={ref}
      data-trait={masque ? '' : undefined}
      data-visible={visible || undefined}
      className={cn('regle', className)}
    />
  );
};

/* ------------------------------------------------------------------ */

interface ProprietesCalage {
  children: ReactNode;
  className?: string;
}

/**
 * Le calage : l'image se pose depuis 1,05.
 *
 * Deux niveaux, et c'est nécessaire : le conteneur extérieur masque le
 * débordement, l'intérieur porte la transformation. Une seule boîte qui ferait
 * les deux se rognerait elle-même pendant l'agrandissement.
 *
 * La classe `calage` de l'enfant est aussi ce que `.rasante` vise au survol :
 * l'image est le seul élément du site autorisé à bouger, et de 3 % seulement.
 */
export const Calage = ({ children, className }: ProprietesCalage) => {
  const { ref, masque, visible } = useEntree<HTMLDivElement>();

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <div
        data-calage={masque ? '' : undefined}
        data-visible={visible || undefined}
        className="calage h-full w-full"
      >
        {children}
      </div>
    </div>
  );
};
