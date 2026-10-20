import { ArrowRight } from 'lucide-react';

import { Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { Lien } from '@/components/systeme/Lien';

/**
 * LES MÉTIERS — un registre à quatre cases, numéroté en romain.
 *
 * Sur la bande de lin, la colonne de gauche porte le propos ; la grille de
 * droite, deux cases par deux, dit les quatre métiers avec une cote (I. à IV.),
 * un titre en romain et une phrase. Pas d'illustration : les quatre images de
 * banque de la version précédente ne disaient rien de l'agence, et le duotone
 * ne les rendait pas vraies. Elles restent sur les ouvertures des pages
 * métier, où elles font une texture et non un propos.
 *
 * La hiérarchie est dans l'ordre : gérance et syndic d'abord, le fonds de la
 * maison ; estimation et transaction ensuite, qui en découlent.
 */
const METIERS = [
  {
    cote: 'I.',
    titre: 'Gérance locative',
    /* Tournée vers le propriétaire le 20/10/2026 (client) : l'ancienne phrase
       finissait sur le locataire qui appelle. Les prestations sont celles du
       mandat Sérénité (`GestionLocative.tsx`), la fin est le titre de cette
       page ; l'encaissement des loyers n'y figure pas, barré le 12/10/2026.
       Comptabilité, déclaration et conseil juridique ajoutés le même jour
       (client) ; la déclaration est nommée comme dans les options du mandat,
       « revenus fonciers ». */
    accroche:
      'Recherche du locataire et étude de sa solvabilité, bail, révision du loyer, travaux, comptabilité, préparation de la déclaration de revenus fonciers et conseil juridique : vous gardez vos revenus, nous gérons tout le reste.',
    route: '/services/gestion-locative',
  },
  {
    cote: 'II.',
    titre: 'Syndic de copropriété',
    /* Le 20/10/2026 (client), une liste de tâches devenue un argument : le
       titre de la page syndic et l'accès Gercop qu'elle décrit. Sans « depuis
       1978 », retiré à la demande du client. */
    accroche:
      'Un syndic qui connaît votre immeuble : les dossiers, les travaux votés, les comptes, consultables en ligne à toute heure.',
    route: '/services/gestion-copropriete',
  },
  {
    cote: 'III.',
    titre: 'Estimation',
    /* Deux estimations, vente et location, et « le juste prix du marché » en
       tête : 20/10/2026 (client). La mention des ventes enregistrées (DVF) est
       retirée à sa demande ; elle ne valait de toute façon que pour la vente,
       la valeur locative n'ayant pas de source publique équivalente. */
    accroche:
      "Mise en location ou vente, le juste prix du marché : ce que vaut votre bien à la vente, et ce qu'il peut vous rapporter en location.",
    route: '/services/vendre-estimer',
  },
  {
    cote: 'IV.',
    titre: 'Achat et vente',
    accroche:
      "Vendre un lot que l'on administre déjà, c'est vendre en connaissance : rien à découvrir chez le notaire.",
    route: '/services/vendre-estimer#vendre',
  },
];

const Metiers = () => (
  <section id="metiers" className="bg-lin py-16 lg:py-20">
    <div className="container mx-auto grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,23rem)_1fr]">
      <Voile>
        <p className="gravure">Nos métiers</p>
        <h2 className="mt-4 text-[clamp(2rem,3.5vw,2.75rem)]">Quatre métiers tenus sous le même toit</h2>
        <p className="mesure mt-4 text-[1rem] leading-[1.55] text-ardoise">
          Gérance et syndic sont le fonds de la maison. L'estimation et la transaction en
          découlent : on estime et on vend mieux un bien que l'on gère.
        </p>
      </Voile>

      {/* Les quatre cases : filet en haut, filets entre les cases par les
          bordures droite et basse des deux premières. Chaque case est un lien
          entier — la ligne cliquable, le lavis au survol. */}
      <ul className="grid border-t border-[hsl(var(--trait)/var(--trait-a))] sm:grid-cols-2">
        {METIERS.map((metier, index) => (
          <Voile
            as="li"
            key={metier.titre}
            delai={echelonner(index)}
            className="flex border-b border-[hsl(var(--trait)/var(--trait-a))] sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <Lien
              to={metier.route}
              className="rasante group flex w-full flex-col gap-2 py-6"
            >
              <span className="cote">{metier.cote}</span>
              <span className="mt-1 font-serif text-[clamp(1.375rem,2vw,1.625rem)] leading-[1.1]">
                {metier.titre}
              </span>
              <span className="text-[1rem] leading-[1.5] text-ardoise">{metier.accroche}</span>
              <span className="mt-2 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-foreground">
                Voir
                <ArrowRight
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-4 ease-sortie group-hover:translate-x-1"
                />
              </span>
            </Lien>
          </Voile>
        ))}
      </ul>
    </div>
  </section>
);

export default Metiers;
