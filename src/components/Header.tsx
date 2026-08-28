import { useEffect, useRef, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import LogoJIP from '@/components/LogoJIP';
import { ADRESSE } from '@/config/legal';
import { brancherDefilement } from '@/lib/defilement';
import { cn } from '@/lib/utils';
import { Lien } from '@/components/systeme/Lien';

const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

/**
 * L'en-tête est la plaque vissée à côté de la porte.
 *
 * Il est de nuit sur toutes les pages, y compris celles dont le corps est de
 * pierre. Trois raisons, dans l'ordre :
 *
 *  1. C'est la seule matière sur laquelle le jaune de l'enseigne est lisible —
 *     8,91:1 sur la nuit, 1,81:1 sur la pierre. L'ancienne barre en verre
 *     dépoli obligeait à écrire le logo et les liens en marine sombre, c'est-à-
 *     dire à masquer la couleur de la marque en haut de chaque page.
 *  2. Un en-tête translucide posé sur un contenu clair change de contraste au
 *     défilement. Ici il ne dépend de rien : le contraste est constant.
 *  3. La barre haute des coordonnées a disparu, absorbée dans la plaque.
 *     Elle était masquée sous md — donc invisible là où un numéro sert le plus.
 *     Le téléphone est maintenant présent à toutes les largeurs.
 *
 * Au défilement, la plaque se resserre (88 → 60 px) et la ligne d'adresse
 * s'efface : c'est le seul élément du site qui réagit au défilement, et il le
 * fait par la hauteur, pas par un flou.
 */
const Header = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { pathname } = useLocation();
  const enteteRef = useRef<HTMLElement>(null);

  // Un panneau ouvert doit pouvoir se refermer autrement qu'en retrouvant le
  // bouton : Échap, ou un clic à côté. Sans ça le menu mobile piège le
  // visiteur, et il recouvre la page sans qu'aucun geste évident ne le referme.
  useEffect(() => {
    if (!menuOuvert) return;

    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOuvert(false);
      // Rendre le focus au bouton : sinon il reste sur un élément désormais
      // démonté et le parcours au clavier repart du haut du document.
      enteteRef.current?.querySelector<HTMLButtonElement>('[data-bouton-menu]')?.focus();
    };
    const surClic = (e: MouseEvent) => {
      if (!enteteRef.current?.contains(e.target as Node)) setMenuOuvert(false);
    };

    document.addEventListener('keydown', surTouche);
    document.addEventListener('pointerdown', surClic);
    return () => {
      document.removeEventListener('keydown', surTouche);
      document.removeEventListener('pointerdown', surClic);
    };
  }, [menuOuvert]);

  /**
   * LE DÉFILEMENT EST BLOQUÉ PENDANT QUE LE PANNEAU EST OUVERT.
   *
   * Mesuré avant correction : menu ouvert, un `scrollTo(0, 600)` déplaçait la
   * page de 598 px DERRIÈRE le panneau. On se retrouvait à lire le menu
   * par-dessus une tout autre section, et sur un téléphone un geste destiné au
   * menu faisait défiler la page.
   *
   * `overflow: hidden` sur le corps, et non `position: fixed` : le second
   * remettrait la page en haut à la fermeture, ce qui perdrait la position de
   * lecture. Il ne casse pas le `position: sticky` de l'en-tête.
   *
   * LE REMBOURRAGE COMPENSE LA BARRE DE DÉFILEMENT. Sur téléphone elle vaut 0
   * — les barres y sont superposées — mais sur un navigateur de bureau réduit
   * sous 1024 px elle fait une quinzaine de pixels, et la masquer élargirait la
   * page de cette largeur : tout le contenu sauterait vers la droite à
   * l'ouverture du menu. C'est le genre de décalage que le contrat de mouvement
   * interdit.
   */
  useEffect(() => {
    if (!menuOuvert) return;

    // C'EST `<html>` QUI DÉFILE, PAS `<body>`. Un premier jet ne bloquait que le
    // corps : mesuré, `scrollTo(0, 1600)` déplaçait quand même la page à 1596.
    // En mode standard l'élément de défilement du document est la racine ;
    // masquer le débordement du corps n'y change rien.
    const racine = document.documentElement;
    const corps = document.body;
    const debordementAvant = racine.style.overflow;
    const rembourrageAvant = corps.style.paddingRight;
    const barre = window.innerWidth - racine.clientWidth;

    racine.style.overflow = 'hidden';
    if (barre > 0) corps.style.paddingRight = `${barre}px`;

    return () => {
      racine.style.overflow = debordementAvant;
      corps.style.paddingRight = rembourrageAvant;
    };
  }, [menuOuvert]);

  // Refermer en changeant de page : sinon le panneau survit à la navigation.
  useEffect(() => setMenuOuvert(false), [pathname]);

  // Le resserrement ne passe plus par un état React : l'unique écouteur du site
  // pose `data-defile` sur <html>, et le CSS s'en charge. Un franchissement de
  // seuil ne provoque donc aucun rendu — le composant n'avait rien à recalculer.
  useEffect(brancherDefilement, []);

  // Souligner la page courante : sans repère, le visiteur ne sait pas où il est
  // dans un menu de cinq entrées.
  const estCourante = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navigation = [
    { nom: 'Gérance', nomLong: 'Gérance locative', href: '/services/gestion-locative' },
    { nom: 'Copropriété', nomLong: 'Syndic de copropriété', href: '/services/gestion-copropriete' },
    { nom: 'Biens', nomLong: 'Biens à vendre', href: '/biens' },
    { nom: 'Agence', nomLong: "L'agence", href: '/agence' },
    { nom: 'Contact', nomLong: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Lien d'évitement : cinq entrées de menu et deux boutons avant le
          contenu, c'est autant de tabulations imposées à chaque page.
          Invisible tant qu'il n'a pas le focus. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:bg-primary focus:px-4 focus:py-3 focus:font-display focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.12em] focus:text-primary-foreground"
      >
        Aller au contenu
      </a>

      <header
        ref={enteteRef}
        className="entete-enseigne nuit sticky top-0 z-50 bg-nuit text-pierre shadow-[0_1px_0_hsl(var(--laiton)/0.28)]"
      >
        <nav
          aria-label="Navigation principale"
          className="container mx-auto flex items-center justify-between gap-6"
        >
          {/* ---- L'enseigne ------------------------------------------- */}
          <Lien
            to="/"
            /* Rembourrage CONSTANT : l'animer, c'est animer la mise en page.
               Le resserrement vient de la ligne d'adresse qui se replie (voir
               plus bas) et de l'échelle du logo — la hauteur de l'en-tête suit,
               sans qu'aucune propriété interdite ne soit animée. */
            className="group flex shrink-0 items-center gap-3.5 py-3.5" 
          >
            {/* `transform` et non `height` : animer la hauteur d'un SVG en flux
                remet la ligne en page à chaque trame. L'échelle est composée par
                le GPU et ne touche à rien. `origin-left` pour que le logo se
                resserre vers la gauche, pas vers son centre. */}
            <LogoJIP
              className="entete-logo h-10 w-auto origin-left transition-transform duration-4 ease-sortie" 
            />
            <span className="hidden sm:block">
              <span className="block font-display text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.17em] [font-variation-settings:'wdth'_118]">
                Jobard Immobilier Paris
              </span>
              {/* L'adresse, et non un descriptif de services : c'est la
                  promesse de l'agence — deux métiers, une seule adresse. */}
              {/* `grid-template-rows: 0fr → 1fr` — la seule propriété de mise en
                  page que le contrat autorise, et seulement pour un replié.
                  Elle remplace `max-height` + `margin-top`, qui étaient deux
                  propriétés interdites animées en même temps, et elle évite de
                  mesurer une hauteur en JavaScript. */}
              <span
                className="entete-adresse grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-4 ease-sortie" 
              >
                <span className="block overflow-hidden">
                    {/* Le rembourrage vit à l'INTÉRIEUR de la boîte écrêtée, pas sur
                        l'élément de grille : `min-height: 0` annule la contribution du
                        contenu à la piste, mais jamais celle du rembourrage. Posé un cran
                        plus haut, il laissait 6 px dans le replié — mesuré. */}
                    <span className="tabulaire block pt-1.5 text-[0.6875rem] tracking-[0.04em] text-muted-foreground">
                        27, rue de Lisbonne — Paris 8<sup>e</sup>
                  </span>
                </span>
              </span>
            </span>
          </Lien>

          {/* ---- Les entrées ----------------------------------------- */}
          <ul className="hidden items-center gap-7 lg:flex min-[1400px]:gap-9">
            {navigation.map((item) => {
              const courante = estCourante(item.href);
              return (
                <li key={item.href}>
                  <Lien
                    to={item.href}
                    aria-current={courante ? 'page' : undefined}
                    className={cn(
                      // Le filet du survol se tire sous le mot ; sur la page
                      // courante il est déjà tiré et ne s'efface pas.
                      'lien-trait relative py-2 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.13em] transition-colors duration-3',
                      courante
                        ? 'text-primary before:scale-x-100'
                        : 'text-pierre/85 hover:text-pierre',
                    )}
                  >
                    <span className="hidden min-[1400px]:inline">{item.nomLong}</span>
                    <span className="min-[1400px]:hidden">{item.nom}</span>
                  </Lien>
                </li>
              );
            })}
          </ul>

          {/* ---- Le numéro ------------------------------------------
              TROIS SEUILS MESURÉS, ET ILS NE COÏNCIDENT PAS. À `xl` (1280),
              trois changements tombaient ensemble — libellés longs, gap élargi,
              plaque du numéro — et la somme demandait 1 217 px pour une boîte
              de 1 217 px. Marge nulle : le menu passait sur DEUX LIGNES, ce que
              le `scrollWidth` ne signale pas puisque le flex enroule au lieu de
              déborder. Sondé à 1 024 / 1 280 / 1 440.

              Les seuils sont donc décalés d'après la mesure :
                1 140  la plaque du numéro apparaît (il faut ~1 030 px de
                       contenu ; à 1 024 la boîte n'en offre que 961)
                1 400  les libellés longs et le gap élargi (ils demandent
                       620 px de menu contre 433 en libellés courts)
              Entre les deux, libellés courts + plaque : 187 px de marge.

              Chez une agence de gérance, le téléphone EST le tunnel de
              conversion : le propriétaire d'un lot appelle, il ne remplit pas
              un formulaire. Le numéro est donc traité comme un objet — petite
              plaque gravée, chiffres tabulaires — et non comme une ligne de
              coordonnées en corps 12. */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={tel}
              className="cadre hidden items-center gap-3 px-4 py-2.5 text-primary transition-colors duration-3 hover:bg-[hsl(var(--lavis)/var(--lavis-a))] min-[1140px]:inline-flex"
            >
              <Phone aria-hidden className="h-3.5 w-3.5" />
              <span className="tabulaire font-display text-[0.9375rem] font-semibold tracking-[0.06em] [font-variation-settings:'wdth'_110]">
                {ADRESSE.telephone}
              </span>
            </a>

            {/* Sur téléphone, l'appel est une cible tactile et non un
                libellé : 44 × 44, la taille du doigt qui la visait. */}
            <a
              href={tel}
              className="flex h-11 w-11 items-center justify-center rounded-[2px] text-primary transition-colors hover:bg-[hsl(var(--lavis)/var(--lavis-a))] min-[1140px]:hidden"
              aria-label={`Appeler l'agence au ${ADRESSE.telephone}`}
            >
              <Phone aria-hidden className="h-5 w-5" />
            </a>

            <button
              data-bouton-menu
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="flex h-11 w-11 items-center justify-center rounded-[2px] text-pierre transition-colors hover:bg-[hsl(var(--lavis)/var(--lavis-a))] lg:hidden"
              aria-expanded={menuOuvert}
              aria-controls="menu-principal"
              aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {menuOuvert ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* ---- Le panneau mobile ---------------------------------- */}
        {menuOuvert && (
          <div
            id="menu-principal"
            className="voile absolute inset-x-0 top-full z-50 border-t border-primary/25 bg-nuit lg:hidden"
          >
            <div className="container mx-auto py-6">
              <ul>
                {navigation.map((item) => {
                  const courante = estCourante(item.href);
                  return (
                    <li key={item.href} className="border-b border-pierre/10 last:border-0">
                      <Lien
                        to={item.href}
                        onClick={() => setMenuOuvert(false)}
                        aria-current={courante ? 'page' : undefined}
                        className={cn(
                          'flex min-h-[3.25rem] items-center justify-between font-display text-sm font-semibold uppercase tracking-[0.13em] transition-colors',
                          courante ? 'text-primary' : 'text-pierre',
                        )}
                      >
                        {item.nomLong}
                        {courante && <span aria-hidden className="h-px w-8 bg-primary" />}
                      </Lien>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Lien to="/contact" onClick={() => setMenuOuvert(false)}>
                    Confier un bien
                  </Lien>
                </Button>
                <p className="tabulaire text-center text-xs text-muted-foreground">
                  {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ---- Le voile derrière le panneau --------------------------
          Le panneau ne fait que 421 px sur un écran de 844 : la page restait
          visible dessous, et rien ne disait laquelle des deux surfaces était
          active. Le voile l'assombrit sans la cacher — on garde le repère de
          l'endroit où l'on était.

          IL EST DEHORS DE L'EN-TÊTE, ET C'EST NÉCESSAIRE. Placé dedans, il était
          couvert par `enteteRef.contains(cible)` : l'écouteur `pointerdown` le
          prenait pour un clic À L'INTÉRIEUR et ne refermait pas. Dehors, la
          logique de fermeture déjà en place le traite comme un clic à côté —
          une seule logique, pas deux.

          `z-40` : sous l'en-tête et le panneau, qui sont en z-50. */}
      {menuOuvert && (
        <div aria-hidden className="voile fixed inset-0 z-40 bg-nuit/75 lg:hidden" />
      )}
    </>
  );
};

export default Header;
