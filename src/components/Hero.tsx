import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';

import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';
import { Button } from '@/components/ui/button';
import { ADRESSE, HORAIRES } from '@/config/legal';
import { brancherDefilement, declarerHauteurOuverture } from '@/lib/defilement';
import { cn } from '@/lib/utils';
import travee800 from '@/assets/travee-lisbonne-800.webp';
import travee620 from '@/assets/travee-lisbonne-620.webp';
import travee440 from '@/assets/travee-lisbonne-440.webp';
import { Lien } from '@/components/systeme/Lien';
import { sansMouvement } from '@/lib/mouvement';

/**
 * L'OUVERTURE — « la lumière de la rue de Lisbonne ».
 *
 * Le public voit la façade ; le syndic connaît le hall. Le sujet est UNE
 * TRAVÉE à l'échelle de l'écran, pas une façade réduite en bannière : une
 * façade rétrécie est une carte postale, une travée à sa taille est une
 * présence.
 *
 * LA COMPOSITION VIENT D'UNE MESURE, pas d'un goût. Le fichier fait
 * 800 × 1080 — du portrait — et l'ouverture est en paysage. L'étirer sur toute
 * la largeur l'agrandirait de 1,8 fois (donc le rendrait mou) et le recadrage
 * vertical emporterait la porte cochère et les deux lanternes, c'est-à-dire le
 * sujet lui-même. À son format propre dans la moitié droite, il n'est pas
 * agrandi du tout. Bénéfice second, et il est décisif : le texte ne touche
 * jamais la photographie, ce qui supprime toute la classe de problèmes de
 * contraste sur image — le texte est sur la nuit pleine, 16,08:1.
 *
 * PROFONDEUR : cinq plans, budget de 2,5 rem de course cumulée sur un écran.
 * Trois sont en place (ciel, mur, ferronnerie dessinée), deux attendent un
 * détourage et ne sont pas bloquants. Voir `.travee` dans `src/index.css`.
 *
 * LUMIÈRE : cinq états dessinés à la main, choisis sur l'heure locale du
 * visiteur. L'ouverture n'est jamais deux fois la même — ce qui est la
 * définition de l'inoubliable pour un site qu'on revisite, et un propriétaire
 * revient sur le site de son agence.
 *
 * CE QUI REND LE DISPOSITIF HONNÊTE : les lanternes s'allument quand l'agence
 * est ouverte, et la plaque le dit en mots. Un effet d'atmosphère devient une
 * information utile — celle qu'on cherche avant de composer un numéro.
 */

/**
 * L'ÉTAT D'ÉCLAIRAGE N'EST PAS GÉRÉ ICI. Il est posé sur `<html>` par un script
 * synchrone en tête d'`index.html`, donc avant la première peinture. Le faire en
 * React figerait dans le HTML prérendu l'heure de la machine de build — constaté,
 * le prérendu sortait en « heure-midi » et un visiteur de 22 h voyait la façade
 * en plein soleil le temps de l'hydratation.
 */

/**
 * Horaires réels : du lundi au vendredi, 9 h – 13 h et 14 h – 17 h. C'est ce
 * calcul qui décide si les lanternes sont allumées.
 */
function etatAgence(d: Date) {
  const jour = d.getDay();
  const minutes = d.getHours() * 60 + d.getMinutes();
  const semaine = jour >= 1 && jour <= 5;
  const ouvert = semaine && ((minutes >= 540 && minutes < 780) || (minutes >= 840 && minutes < 1020));

  if (ouvert) return { ouvert: true, texte: 'Ouvert — appelez' };
  if (semaine && minutes < 540) return { ouvert: false, texte: 'Ouvre à 9 h' };
  if (semaine && minutes >= 780 && minutes < 840) return { ouvert: false, texte: 'Ouvre à 14 h' };
  if (jour >= 1 && jour <= 4) return { ouvert: false, texte: 'Ouvre demain à 9 h' };
  return { ouvert: false, texte: 'Ouvre lundi à 9 h' };
}

const Hero = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;
  const ouverture = useRef<HTMLElement>(null);
  const panneau = useRef<HTMLDivElement>(null);
  const facade = useRef<HTMLImageElement>(null);

  const [agence, setAgence] = useState(() => ({ ouvert: false, texte: '' }));
  const [coupee, setCoupee] = useState(false);

  useEffect(() => {
    setAgence(etatAgence(new Date()));
  }, []);

  /**
   * La copie de relief réutilise EXACTEMENT le même fichier que le plan du
   * mur : le navigateur le sert depuis son cache, il n'y a pas de second
   * téléchargement. `currentSrc` et non `src` — pour prendre la variante que
   * le navigateur a réellement choisie dans le `srcSet`.
   */
  useEffect(() => {
    const img = facade.current;
    const el = ouverture.current;
    if (!img || !el) return;
    /**
     * L'URL EST RENDUE RELATIVE, ET C'EST UN CORRECTIF DE PRODUCTION.
     *
     * `currentSrc` et `src` renvoient toujours une URL ABSOLUE — le DOM les
     * résout. Or ce style en ligne est écrit dans le HTML que `prerender.mjs`
     * capture, et ce script sert le site sur `http://localhost:8799`. Le
     * `dist/index.html` livré contenait donc :
     *
     *     --facade: url("http://localhost:8799/assets/travee-lisbonne-800-….webp")
     *
     * En production, cette requête échoue (constaté : `ERR_CONNECTION_REFUSED`
     * dans la console, relevé par Lighthouse en « bonnes pratiques »), et les
     * calques de lumière du héros restent nus jusqu'à ce que React s'hydrate et
     * réécrive la variable.
     *
     * On retire donc l'origine. Le chemin de base de Vite (`VITE_BASE`) est déjà
     * inclus dans `currentSrc`, il survit à l'opération.
     */
    const poser = () => {
      const url = img.currentSrc || img.src;
      const relative = url.startsWith(location.origin) ? url.slice(location.origin.length) : url;
      el.style.setProperty('--facade', `url("${relative}")`);
    };
    if (img.complete) poser();
    else img.addEventListener('load', poser, { once: true });
  }, []);

  /**
   * LA RASANTE. Le pointeur est *à* l'endroit de la lumière, sans
   * amortissement : une lampe qu'on déplace n'a pas d'inertie. Deux variables
   * écrites au plus une fois par trame, aucune remise en page.
   * L'ombre est au point diamétralement opposé.
   */
  useEffect(() => {
    const pan = panneau.current;
    if (!pan) return;

    // `(hover: hover) and (pointer: fine)` — et non `(hover: fine)`, qui est une
    // requête INVALIDE : `fine` est une valeur de `pointer`, jamais de `hover`.
    // Elle ne correspondait donc nulle part, et la rasante était morte sur tous
    // les appareils. Trouvé en sondant `matchMedia` dans le navigateur, pas en
    // relisant le code : une requête média fausse ne lève aucune erreur.
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (sansMouvement()) return;

    let x = 0;
    let y = 0;
    let attend = false;

    const surPointeur = (ev: PointerEvent) => {
      const r = pan.getBoundingClientRect();
      x = ev.clientX - r.left;
      y = ev.clientY - r.top;
      if (attend) return;
      attend = true;
      requestAnimationFrame(() => {
        pan.style.setProperty('--mx', `${x}px`);
        pan.style.setProperty('--my', `${y}px`);
        pan.style.setProperty('--sx', `${pan.clientWidth - x}px`);
        pan.style.setProperty('--sy', `${pan.clientHeight - y}px`);
        attend = false;
      });
    };

    /**
     * `will-change` POSÉE SUR INTENTION, RETIRÉE ENSUITE.
     *
     * Les deux copies masquées de la rasante déplacent un `mask-image` à chaque
     * frame : c'est un repeint, pas une composition. Promouvoir les copies en
     * couches propres confine ce repeint au lieu de le propager à tout le héros.
     *
     * Mais `will-change` coûte de la mémoire vidéo en permanence, et une couche
     * posée pour toujours est une fuite silencieuse — c'est exactement pourquoi
     * le contrat l'interdit en global. Ici elle est posée à l'entrée du pointeur
     * dans le panneau et retirée à sa sortie. L'entrée est le bon moment : elle
     * précède le premier `pointermove` significatif, donc la couche existe avant
     * que la lumière ne commence à bouger.
     *
     * HONNÊTETÉ : le gain n'est pas mesuré. Le repeint d'un dégradé masqué n'est
     * pas compositable, `will-change` ne le rend pas gratuit. Ce qui est certain,
     * c'est le cadrage du repeint et le fait que le coût est borné à la durée du
     * survol au lieu de courir sur toute la vie de la page.
     */
    const copies = () => pan.querySelectorAll<HTMLElement>('.lum, .omb');
    const poser = () => copies().forEach((c) => (c.style.willChange = 'mask-image'));
    const retirer = () => copies().forEach((c) => (c.style.willChange = ''));

    pan.addEventListener('pointerenter', poser);
    pan.addEventListener('pointerleave', retirer);
    pan.addEventListener('pointermove', surPointeur, { passive: true });
    return () => {
      pan.removeEventListener('pointerenter', poser);
      pan.removeEventListener('pointerleave', retirer);
      pan.removeEventListener('pointermove', surPointeur);
      retirer();
    };
  }, []);

  /**
   * LA FERMETURE. L'ouverture ne défile pas, elle se referme : la lumière
   * s'éteint, le relief s'aplatit, le seuil se trace.
   *
   * L'écouteur n'est plus ici — il est unique pour tout le site
   * (`src/lib/defilement.ts`) et écrit `--descente` sur `<html>`. L'ouverture ne
   * fait que lui déclarer sa hauteur, et la redéclarer si la fenêtre change de
   * taille : sans cela, `--descente` resterait calée sur l'ancienne hauteur
   * après une rotation d'écran.
   *
   * État lié à la POSITION et non déclenché : donc réversible. On remonte, la
   * lumière revient. C'est le seul endroit du site où un mouvement se rejoue,
   * et justement parce qu'il ne se joue pas — il est.
   */
  useEffect(() => {
    const el = ouverture.current;
    if (!el) return;

    const mesurer = () => declarerHauteurOuverture(el.offsetHeight);
    mesurer();
    brancherDefilement();

    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Toute interaction porte la chorégraphie à son état final, sans délai. */
  useEffect(() => {
    const couper = () => setCoupee(true);
    const types = ['wheel', 'pointerdown', 'keydown', 'touchstart'] as const;
    types.forEach((t) => window.addEventListener(t, couper, { passive: true, once: true }));
    return () => types.forEach((t) => window.removeEventListener(t, couper));
  }, []);

  return (
    <header
      ref={ouverture}
      id="ouverture"
      className={cn(
        'nuit relative grid min-h-[min(52rem,94svh)] grid-cols-1 bg-nuit text-pierre lg:grid-cols-[minmax(0,1fr)_52%]',
        'sequence',
        coupee && 'coupee',
      )}
      /* Les lanternes s'allument quand l'agence est ouverte, et non selon
         l'heure du soleil : c'est ce qui fait porter une information au seul
         effet de l'ouverture. Posé en ligne parce que cela dépend de l'horloge
         du visiteur, donc de rien que le prérendu puisse savoir. */
      style={{ '--lanternes': agence.ouvert ? 1 : 0 } as React.CSSProperties}
    >
      {/* ---- Le texte, sur la nuit pleine ------------------------- */}
      <div className="relative z-10 flex flex-col justify-end px-[var(--marge-page,1.5rem)] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(3rem,7vw,5.5rem)] lg:pl-[max(1.5rem,calc((100vw-76rem)/2))] lg:pr-[clamp(2rem,4vw,4rem)]">
        <div className="max-w-[35rem]">
          <PlaqueDeRue />

          <h1 className="mt-10 text-[clamp(1.875rem,4.4vw,3.25rem)]">
            <span className="h-l1 block">Votre immeuble a une adresse.</span>
            <span className="h-l2 block">Votre syndic aussi.</span>
          </h1>

          <p className="h-chapeau mesure mt-7 text-[1.0625rem] leading-relaxed text-pierre/80 sm:text-lg">
            Gérance locative et syndic de copropriété au 27, rue de Lisbonne. Depuis 2011,{' '}
            <strong className="font-semibold text-pierre">
              les mêmes personnes dans le même bureau
            </strong>{' '}
            — pas un standard, pas un numéro de dossier.
          </p>

          <hr className="h-trait regle mt-10 max-w-[24rem] origin-left" />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-p1" asChild>
              <Lien to="/services/gestion-locative">
                Confier un bien
                <ArrowRight aria-hidden />
              </Lien>
            </Button>
            <Button size="lg" variant="secondary" className="h-p2" asChild>
              <Lien to="/services/gestion-copropriete">Changer de syndic</Lien>
            </Button>
          </div>

          {/* La plaque d'ouverture, en dernier : l'identité d'abord, le
              « maintenant » ensuite. C'est aussi ce qui empêche les lanternes
              d'être un ornement — elles disent la même chose en lumière. */}
          <a
            href={tel}
            className={cn(
              'h-ouvert cadre cadre-discret mt-8 inline-flex items-center gap-3 px-4 py-2.5 transition-colors duration-2 ease-etat hover:bg-[hsl(var(--lavis)/var(--lavis-a))]',
              agence.ouvert && 'text-primary',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'h-2 w-2 shrink-0 rounded-full',
                agence.ouvert ? 'bg-primary shadow-[0_0_0_3px_hsl(var(--laiton)/0.2)]' : 'bg-muted-foreground',
              )}
            />
            <span className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {agence.texte || HORAIRES.jours}
            </span>
            <span className="tabulaire font-display text-[1.0625rem] font-semibold text-pierre">
              {ADRESSE.telephone}
            </span>
          </a>
        </div>
      </div>

      {/* ---- Le panneau : la travée à son format propre -----------
          SUR TÉLÉPHONE, LE CADRE EST BORNÉ, ET C'EST UNE MESURE.
          En `aspect-[4/5]`, la photo prenait 488 px sur un écran de 390 (58 %
          du pli) et 469 sur un 375 (70 %) : sur un iPhone SE le titre passait
          ENTIÈREMENT sous le pli, et l'on arrivait sur un immeuble sans un mot.
          Relevé au protocole de débogage, pas estimé.
          `aspect-[7/5]` ramène la photo à 268 px (40 %) et fait remonter la
          plaque et les trois lignes du titre au-dessus du pli. Le fronton
          reste centré et lisible : on ne perd que la répétition des étages.
          `max-h-[42svh]` prend le relais sur tablette, où le seul ratio
          redonnerait une bannière de 548 px. Les deux sont remis à zéro en
          `lg:`, où la travée retrouve son format portrait dans la demi-page
          droite — c'est là qu'elle n'est pas agrandie du tout. */}
      <div
        ref={panneau}
        className="travee order-first aspect-[7/5] max-h-[42svh] lg:order-none lg:aspect-auto lg:max-h-none"
      >
        <div className="plan-mur">
          <img
            ref={facade}
            src={travee800}
            srcSet={`${travee440} 440w, ${travee620} 620w, ${travee800} 800w`}
            sizes="(min-width: 64rem) 52vw, 100vw"
            alt="La travée d'entrée d'un immeuble haussmannien : porte cochère à fronton, deux lanternes, balcons en fonte ouvragée"
            width={800}
            height={1080}
            loading="eager"
            /* EN MINUSCULES, ET C'EST OBLIGATOIRE EN REACT 18. `fetchPriority`
               en camelCase n'est reconnu qu'à partir de React 19 : sur 18.3.1 il
               déclenche « React does not recognize the `fetchPriority` prop »
               à CHAQUE chargement, avec la consigne explicite de l'écrire en
               minuscules. L'attribut finissait bien dans le HTML (React sert les
               props inconnues telles quelles, en bas de casse), donc la priorité
               était appliquée — mais au prix d'une erreur de console permanente.
               Relevé le 27/08/2026 en lisant la console du serveur de dev. */
            fetchpriority="high"
            decoding="sync"
          />
        </div>

        <div className="plan-ciel" aria-hidden />
        <div className="relief" aria-hidden>
          <span className="lum" />
          <span className="omb" />
        </div>
        <div className="rai" aria-hidden />
        <div className="lanterne lanterne-g" aria-hidden />
        <div className="lanterne lanterne-d" aria-hidden />

        <div className="plan-fer" aria-hidden>
          <svg viewBox="0 0 240 60" preserveAspectRatio="none" role="presentation">
            <defs>
              {/* Une unité de garde-corps haussmannien : deux balustres, un
                  cercle, deux rinceaux en miroir. Répétée par `pattern` — un
                  garde-corps est un motif, donc il se dessine au lieu de se
                  détourer. */}
              <pattern id="fer-travee" width="30" height="60" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M6 60V18M24 60V18" />
                  <circle cx="15" cy="30" r="6.5" />
                  <path d="M6 30c0-7 4-11 9-11s9 4 9 11" />
                  <path d="M6 44c3.5 0 6-2.6 6-6M24 44c-3.5 0-6-2.6-6-6" />
                </g>
              </pattern>
            </defs>
            <rect x="0" y="14" width="240" height="46" fill="url(#fer-travee)" />
            <rect x="0" y="10" width="240" height="4.5" fill="currentColor" />
            <rect x="0" y="17" width="240" height="2" fill="currentColor" />
          </svg>
        </div>

        <div className="raccord" aria-hidden />
        <div className="grain absolute inset-0 z-[7]" aria-hidden />
      </div>

      <div className="seuil" aria-hidden />
    </header>
  );
};

export default Hero;
