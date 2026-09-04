import { ArrowUpRight, ShieldCheck } from 'lucide-react';

import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';
import { TEL } from '@/components/systeme/BoutonTelephone';
import { ADRESSE, ESPACE_CLIENT, HORAIRES } from '@/config/legal';
import { Lien } from '@/components/systeme/Lien';

/**
 * Le pied de page — un filet, quatre colonnes, la plaque en signature.
 *
 * Il est sur le crème comme le reste de la page : la direction « La Plaque »
 * n'a qu'un fond, et les blocs de marine sont réservés aux appels. La plaque de
 * rue revient ici en petit, cernée et non émaillée — l'objet d'ouverture en
 * cachet de fin de courrier.
 *
 * C'est aussi le seul endroit qui garantit qu'aucune page n'est orpheline :
 * les six pages, l'espace client et les mentions légales y sont tous liés.
 */
const Footer = () => {
  const annee = new Date().getFullYear();

  const metiers = [
    { nom: 'Gérance locative', href: '/services/gestion-locative' },
    { nom: 'Syndic de copropriété', href: '/services/gestion-copropriete' },
    { nom: 'Vendre & estimer', href: '/services/vendre-estimer' },
    { nom: 'Biens à vendre et à louer', href: '/biens' },
  ];

  const pages = [
    { nom: "L'agence", href: '/agence' },
    { nom: 'Contact', href: '/contact' },
    { nom: 'Mentions légales', href: '/mentions-legales' },
    { nom: 'Données personnelles', href: '/mentions-legales#donnees-personnelles' },
  ];

  const colonne = (titre: string, liens: { nom: string; href: string }[], externe?: { nom: string; href: string }) => (
    <nav aria-label={titre} className="lg:col-span-2">
      <h2 className="gravure">{titre}</h2>
      <ul className="mt-5 space-y-2.5 text-[0.875rem]">
        {liens.map((lien) => (
          <li key={lien.href}>
            <Lien to={lien.href} className="lien-trait text-ardoise hover:text-foreground">
              {lien.nom}
            </Lien>
          </li>
        ))}
        {externe && (
          <li>
            <a
              href={externe.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lien-trait text-ardoise hover:text-foreground"
            >
              {externe.nom}
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </a>
          </li>
        )}
      </ul>
    </nav>
  );

  return (
    <footer className="bg-pierre text-foreground">
      <div className="container mx-auto border-t border-[hsl(var(--trait)/var(--trait-a))] py-14 lg:py-16">
        {/* Deux colonnes dès le téléphone pour les listes de liens : quinze
            liens en une colonne faisaient un pied de page d'une fois et demie
            l'écran. L'adresse et les coordonnées gardent toute la largeur. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-x-12 lg:grid-cols-12">
          {/* ---- La signature ------------------------------------ */}
          <div className="col-span-2 lg:col-span-4">
            <PlaqueDeRue taille="petite" />
            <p className="mesure mt-5 text-[0.875rem] leading-relaxed text-ardoise">
              Agence indépendante depuis 2011. Un interlocuteur unique pour votre lot comme
              pour votre immeuble.
            </p>
            <Lien
              to="/mentions-legales"
              className="lien-trait mt-5 text-[0.8125rem] text-ardoise hover:text-foreground"
            >
              <ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-primary-ink" />
              Cartes professionnelles et garanties
            </Lien>
          </div>

          {colonne('Nos métiers', metiers)}
          {colonne(
            'Le site',
            pages,
            ESPACE_CLIENT.url ? { nom: ESPACE_CLIENT.libelle, href: ESPACE_CLIENT.url } : undefined,
          )}

          {/* ---- Les coordonnées -------------------------------- */}
          <div className="col-span-2 lg:col-span-4">
            <h2 className="gravure">Nous joindre</h2>
            {/* UN SEUL NIVEAU DE `div` DANS UN `dl` : la spécification n'admet
                comme enfant direct qu'un `div` groupant `dt` et `dd`. Relevé
                par Lighthouse sur une version précédente. */}
            <dl className="mt-5 space-y-3.5 text-[0.875rem] text-ardoise">
              <div>
                <dt className="sr-only">Téléphone</dt>
                <dd>
                  <a
                    href={TEL}
                    className="tabulaire font-display text-[1.0625rem] font-semibold text-foreground transition-colors hover:text-primary-ink"
                  >
                    {ADRESSE.telephone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Courriel</dt>
                <dd>
                  <a href={`mailto:${ADRESSE.email}`} className="lien-trait hover:text-foreground">
                    {ADRESSE.email}
                  </a>
                  <span className="mt-0.5 block text-muted-foreground">Réponse sous 24 heures ouvrées</span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Adresse</dt>
                <dd>
                  {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
                  <span className="mt-0.5 block text-muted-foreground">{ADRESSE.metro}</span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Horaires</dt>
                <dd className="tabulaire">
                  {HORAIRES.jours}
                  <span className="mt-0.5 block text-muted-foreground">{HORAIRES.detail}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ---- La ligne de bas de page -------------------------- */}
      <div className="border-t border-[hsl(var(--trait)/var(--trait-a))]">
        <div className="container mx-auto flex flex-col items-start justify-between gap-3 py-5 text-[0.75rem] text-muted-foreground md:flex-row md:items-center">
          <p>
            © {annee} J.I.P. — Jobard Immobilier Paris · SIREN 529 339 665
            <span aria-hidden className="mx-2 opacity-50">·</span>
            Réalisation{' '}
            <a
              href="https://www.linkedin.com/in/alexandre-wetzler/"
              target="_blank"
              rel="noopener noreferrer"
              className="lien-trait text-ardoise hover:text-foreground"
            >
              Alexandre Wetzler
            </a>
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <Lien to="/mentions-legales" className="lien-trait hover:text-foreground">
              Mentions légales
            </Lien>
            <Lien to="/mentions-legales#donnees-personnelles" className="lien-trait hover:text-foreground">
              Données personnelles
            </Lien>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
