import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import LogoJIP from '@/components/LogoJIP';
import { ADRESSE, ESPACE_CLIENT, HORAIRES } from '@/config/legal';
import { brancherDefilement } from '@/lib/defilement';
import { etatAgence } from '@/lib/horaires';
import { cn } from '@/lib/utils';
import { Lien } from '@/components/systeme/Lien';
import { TEL } from '@/components/systeme/BoutonTelephone';

/**
 * L'en-tête — direction « La Plaque », 04/09/2026.
 *
 * Une barre de crème, un filet dessous, six entrées en petites capitales, le
 * numéro en chiffres. Elle ne se resserre plus au défilement — seul le filet
 * du bas se souligne (`data-defile`, en CSS) — et elle n'est plus de nuit :
 * l'enseigne jaune est un LOGO, elle n'a pas à être lisible comme du texte, et
 * c'est le seul jaune vif admis sur le crème.
 *
 * LE POINT VERT dit si l'agence est ouverte, à l'heure du visiteur. C'est la
 * seule information « en direct » de la page, et elle est là où l'on regarde
 * avant de composer un numéro : à côté du numéro. Le texte équivalent est
 * rendu pour les lecteurs d'écran, et dans le titre du lien au survol.
 *
 * Six entrées et non cinq : « Vendre & estimer » est la fusion des deux pages
 * Estimation et Achats/ventes, décidée avec l'arborescence de la direction.
 */

const NAVIGATION = [
  { nom: 'Gérance', nomLong: 'Gérance locative', href: '/services/gestion-locative' },
  { nom: 'Syndic', nomLong: 'Syndic de copropriété', href: '/services/gestion-copropriete' },
  { nom: 'Vendre & estimer', nomLong: 'Vendre & estimer', href: '/services/vendre-estimer' },
  { nom: 'Biens', nomLong: 'Biens à vendre', href: '/biens' },
  { nom: "L'agence", nomLong: "L'agence", href: '/agence' },
  { nom: 'Contact', nomLong: 'Contact', href: '/contact' },
];

const Header = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { pathname } = useLocation();
  const enteteRef = useRef<HTMLElement>(null);

  // Posé après le montage : le prérendu ne connaît pas l'heure du visiteur, et
  // un point figé à l'heure de la machine de build mentirait.
  const [agence, setAgence] = useState<{ ouvert: boolean; texte: string } | null>(null);
  useEffect(() => {
    setAgence(etatAgence(new Date()));
  }, []);

  // Un panneau ouvert doit pouvoir se refermer autrement qu'en retrouvant le
  // bouton : Échap, ou un clic à côté.
  useEffect(() => {
    if (!menuOuvert) return;

    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOuvert(false);
      // Rendre le focus au bouton : sinon il reste sur un élément démonté et
      // le parcours au clavier repart du haut du document.
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
   * C'EST `<html>` QUI DÉFILE, PAS `<body>` : en mode standard l'élément de
   * défilement du document est la racine, et masquer le débordement du corps
   * n'y changeait rien (mesuré : la page glissait de 598 px derrière le
   * panneau). Le rembourrage compense la barre de défilement d'un navigateur
   * de bureau réduit sous 1024 px, sans quoi tout le contenu sauterait de
   * quinze pixels à l'ouverture.
   */
  useEffect(() => {
    if (!menuOuvert) return;

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

  // L'unique écouteur de défilement du site pose `data-defile` sur <html> ;
  // le soulignement du filet est en CSS, aucun rendu React n'a lieu.
  useEffect(brancherDefilement, []);

  // Souligner la page courante : sans repère, le visiteur ne sait pas où il
  // est dans un menu de six entrées.
  const estCourante = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Lien d'évitement : six entrées de menu et deux liens avant le
          contenu, c'est autant de tabulations imposées à chaque page. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-marine focus:px-4 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.12em] focus:text-pierre"
      >
        Aller au contenu
      </a>

      <header
        ref={enteteRef}
        className="entete entete-enseigne sticky top-0 z-50 bg-pierre text-foreground"
      >
        <nav
          aria-label="Navigation principale"
          className="container mx-auto flex items-center justify-between gap-6 py-3.5 lg:py-4"
        >
          {/* ---- L'enseigne ------------------------------------------- */}
          <Lien to="/" className="flex shrink-0 items-center gap-3.5">
            <LogoJIP className="h-9 w-auto" />
            <span className="hidden text-[0.75rem] font-medium uppercase leading-none tracking-[0.14em] sm:block">
              Jobard Immobilier Paris
            </span>
          </Lien>

          {/* ---- Les entrées ----------------------------------------- */}
          {/* Libellés COURTS à toutes les largeurs de bureau, comme sur la
              planche : les longs (« Syndic de copropriété ») faisaient neuf
              capitales de même poids sur une ligne — trop chargé, vu à l'écran.
              Le libellé long reste dans le panneau mobile, où il a la place. */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAVIGATION.map((item) => {
              const courante = estCourante(item.href);
              return (
                <li key={item.href}>
                  <Lien
                    to={item.href}
                    aria-current={courante ? 'page' : undefined}
                    className={cn(
                      // Le filet de la page courante est en ambre foncé (5,46:1 sur
                      // le crème) : un indicateur d'état doit atteindre 3:1, et le
                      // laiton vif n'en fait que 1,81.
                      'inline-block border-b-2 py-1 text-[0.75rem] font-medium uppercase tracking-[0.06em] transition-colors duration-3',
                      courante
                        ? 'border-primary-ink text-foreground'
                        : 'border-transparent text-ardoise hover:text-foreground',
                    )}
                  >
                    {item.nom}
                  </Lien>
                </li>
              );
            })}
          </ul>

          {/* ---- Espace client, le numéro, le menu ------------------- */}
          <div className="flex shrink-0 items-center gap-5">
            {/* Un filet vertical sépare l'espace client — un lien SORTANT, vers
                Gercop — des entrées du site : il ne fait pas partie du menu. */}
            {ESPACE_CLIENT.url && (
              <a
                href={ESPACE_CLIENT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lien-trait hidden text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground xl:inline-flex"
              >
                {ESPACE_CLIENT.libelle}
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            )}
            <span aria-hidden className="hidden h-5 w-px bg-[hsl(var(--trait)/0.3)] xl:block" />

            {/* Le numéro, en chiffres tabulaires. Chez une agence de gérance,
                le téléphone EST le tunnel de conversion : le propriétaire d'un
                lot appelle, il ne remplit pas un formulaire. */}
            <a
              href={TEL}
              title={agence ? `${agence.texte} · ${HORAIRES.jours}, ${HORAIRES.detail}` : undefined}
              className="hidden items-center gap-2.5 py-2 font-display text-[0.9375rem] font-semibold tabulaire transition-colors duration-3 hover:text-primary-ink min-[1140px]:inline-flex"
            >
              <span
                aria-hidden
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full transition-colors duration-3',
                  agence?.ouvert ? 'bg-[hsl(143_55%_40%)]' : 'bg-[hsl(var(--trait)/0.35)]',
                )}
              />
              {ADRESSE.telephone}
              {agence && <span className="sr-only"> — {agence.texte}</span>}
            </a>

            {/* Sur téléphone, l'appel est une cible tactile de 44 × 44. */}
            <a
              href={TEL}
              className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-[hsl(var(--lavis)/var(--lavis-a))] min-[1140px]:hidden"
              aria-label={`Appeler l'agence au ${ADRESSE.telephone}`}
            >
              <Phone aria-hidden className="h-5 w-5" />
            </a>

            <button
              data-bouton-menu
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-[hsl(var(--lavis)/var(--lavis-a))] lg:hidden"
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
            className="voile absolute inset-x-0 top-full z-50 border-t border-[hsl(var(--trait)/var(--trait-a))] bg-pierre lg:hidden"
          >
            <div className="container mx-auto py-5">
              <ul>
                {NAVIGATION.map((item) => {
                  const courante = estCourante(item.href);
                  return (
                    <li key={item.href} className="border-b border-[hsl(var(--trait)/var(--trait-a))]">
                      <Lien
                        to={item.href}
                        onClick={() => setMenuOuvert(false)}
                        aria-current={courante ? 'page' : undefined}
                        className={cn(
                          'flex min-h-[3.25rem] items-center justify-between text-[0.8125rem] font-semibold uppercase tracking-[0.1em]',
                          courante ? 'text-primary-ink' : 'text-foreground',
                        )}
                      >
                        {item.nomLong}
                        {courante && <span aria-hidden className="h-px w-8 bg-primary-ink" />}
                      </Lien>
                    </li>
                  );
                })}
                {ESPACE_CLIENT.url && (
                  <li>
                    <a
                      href={ESPACE_CLIENT.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[3.25rem] items-center justify-between text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-ardoise"
                    >
                      {ESPACE_CLIENT.libelle}
                      <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </a>
                  </li>
                )}
              </ul>

              <div className="mt-5 space-y-3">
                {/* « Prendre rendez-vous » mène au formulaire : un même mot pour
                    deux destinations, c'est un visiteur qui ne sait plus où il
                    va — « Confier un bien » mène partout ailleurs à la gérance. */}
                <Button size="lg" className="w-full" asChild>
                  <Lien to="/contact" onClick={() => setMenuOuvert(false)}>
                    Prendre rendez-vous
                  </Lien>
                </Button>
                <p className="tabulaire text-xs text-muted-foreground">
                  {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ---- Le voile derrière le panneau --------------------------
          IL EST DEHORS DE L'EN-TÊTE, ET C'EST NÉCESSAIRE : placé dedans, il
          était couvert par `enteteRef.contains(cible)` et l'écouteur le
          prenait pour un clic à l'intérieur. `z-40` : sous l'en-tête. */}
      {menuOuvert && (
        <div aria-hidden className="voile fixed inset-0 z-40 bg-marine/60 lg:hidden" />
      )}
    </>
  );
};

export default Header;
