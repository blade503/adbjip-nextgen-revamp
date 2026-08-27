import { Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';
import { ADRESSE, HORAIRES } from '@/config/legal';
import { Lien } from '@/components/systeme/Lien';

/**
 * Le pied de page ferme le mouvement sombre commencé aux avis : on est arrivé
 * devant la porte, et la plaque de rue est reprise ici en petit — l'objet
 * d'ouverture revient en signature, comme un cachet en fin de courrier.
 *
 * C'est aussi le seul endroit qui garantit qu'aucune page n'est orpheline :
 * /equipe n'était atteignable que par un bouton en milieu de page.
 */
const Footer = () => {
  const annee = new Date().getFullYear();
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  // Les six entrées d'origine pointaient toutes vers la gestion locative, et
  // deux d'entre elles — « Conseil Immobilier », « Syndic de Copropriété » — ne
  // correspondaient à aucune page. Quatre métiers, quatre destinations.
  const metiers = [
    { nom: 'Gérance locative', href: '/services/gestion-locative' },
    { nom: 'Syndic de copropriété', href: '/services/gestion-copropriete' },
    { nom: 'Estimation', href: '/services/estimation-biens' },
    { nom: 'Achat et vente', href: '/services/achats-ventes' },
  ];

  const pages = [
    { nom: 'Accueil', href: '/' },
    { nom: 'Le portefeuille', href: '/biens' },
    { nom: "L'agence", href: '/agence' },
    { nom: "L'équipe", href: '/equipe' },
    { nom: 'Contact', href: '/contact' },
  ];

  const colonnes = [
    { titre: 'Nos métiers', liens: metiers },
    { titre: 'Le site', liens: pages },
  ];

  return (
    <footer className="nuit grain relative bg-nuit text-pierre">
      <div className="container relative mx-auto border-t border-pierre/15 py-16 lg:py-20">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* ---- L'adresse --------------------------------------- */}
          <div className="lg:col-span-4">
            <PlaqueDeRue taille="moyenne" />
            <p className="mesure mt-6 text-[0.875rem] leading-relaxed text-muted-foreground">
              Agence indépendante depuis 2011. Un interlocuteur unique pour votre lot comme
              pour votre immeuble.
            </p>
            <Lien
              to="/mentions-legales"
              className="lien-trait mt-6 text-[0.8125rem] text-pierre/85"
            >
              <ShieldCheck aria-hidden className="h-4 w-4 shrink-0 text-primary" />
              Cartes professionnelles et garanties
            </Lien>
          </div>

          {/* ---- Les colonnes ------------------------------------ */}
          {colonnes.map((colonne) => (
            <nav key={colonne.titre} aria-label={colonne.titre} className="lg:col-span-2">
              <h2 className="gravure">{colonne.titre}</h2>
              <ul className="mt-5 space-y-3">
                {colonne.liens.map((lien) => (
                  <li key={lien.href}>
                    <Lien
                      to={lien.href}
                      className="lien-trait text-[0.875rem] text-pierre/85 transition-colors hover:text-pierre"
                    >
                      {lien.nom}
                    </Lien>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ---- Les coordonnées -------------------------------- */}
          <div className="lg:col-span-4">
            <h2 className="gravure">Nous joindre</h2>
            {/* UN SEUL NIVEAU DE `div` DANS UN `dl`.
                La spécification n'admet comme enfant direct de `dl` qu'un `div`
                groupant un ou plusieurs `dt` suivis d'un ou plusieurs `dd`. La
                structure précédente était `dl > div > div > dt`, avec l'icône en
                frère du groupe : deux niveaux, donc invalide, et une icône n'a de
                toute façon pas sa place entre `dl` et `dt`.
                Relevé par Lighthouse (`dlitem` et `definition-list`, 14 éléments sur
                l'accueil). Ma passe d'accessibilité l'avait manqué : je vérifiais
                les contrastes, le focus et le clavier, pas la validité du balisage.
                L'icône vit maintenant DANS le `dd`. */}
            <dl className="mt-5 space-y-4 text-[0.875rem]">
              <div>
                <dt className="sr-only">Téléphone</dt>
                <dd className="flex gap-3">
                  <Phone aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><a
                      href={tel}
                      className="tabulaire font-display text-[1.0625rem] font-semibold text-primary transition-colors hover:text-primary-glow"
                    >
                      {ADRESSE.telephone}
                    </a></span>
                </dd>
              </div>

              <div>
                <dt className="sr-only">Courriel</dt>
                <dd className="flex gap-3">
                  <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><a href={`mailto:${ADRESSE.email}`} className="lien-trait">
                      {ADRESSE.email}
                    </a>
                    <span className="mt-1 block text-muted-foreground">
                      Réponse sous 24 h ouvrées
                    </span></span>
                </dd>
              </div>

              <div>
                <dt className="sr-only">Adresse</dt>
                <dd className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{ADRESSE.rue}
                    <span className="mt-0.5 block text-muted-foreground">
                      {ADRESSE.codePostal} {ADRESSE.ville}
                    </span></span>
                </dd>
              </div>

              <div>
                <dt className="sr-only">Horaires</dt>
                <dd className="flex gap-3 tabulaire">
                  <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{HORAIRES.jours}
                    <span className="mt-0.5 block text-muted-foreground">{HORAIRES.detail}</span></span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ---- La ligne de bas de page -------------------------- */}
      <div className="border-t border-pierre/15">
        <div className="container mx-auto flex flex-col items-start justify-between gap-4 py-6 text-[0.75rem] text-muted-foreground md:flex-row md:items-center">
          <p>
            © {annee} J.I.P. — Jobard Immobilier Paris.
            <span aria-hidden className="mx-2 opacity-40">·</span>
            Réalisation{' '}
            <a
              href="https://www.linkedin.com/in/alexandre-wetzler/"
              target="_blank"
              rel="noopener noreferrer"
              className="lien-trait text-pierre/85"
            >
              Alexandre Wetzler
            </a>
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <Lien to="/mentions-legales" className="lien-trait">
              Mentions légales
            </Lien>
            <Lien to="/mentions-legales#donnees-personnelles" className="lien-trait">
              Données personnelles
            </Lien>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
