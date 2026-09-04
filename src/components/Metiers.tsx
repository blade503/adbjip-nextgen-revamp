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
    accroche:
      "Quittances, révisions, régularisation des charges, relances, travaux, et l'interlocuteur qui décroche quand le locataire appelle.",
    route: '/services/gestion-locative',
  },
  {
    cote: 'II.',
    titre: 'Syndic de copropriété',
    accroche: "Budget, appels de fonds, assemblée générale, carnet d'entretien, suivi des travaux votés.",
    route: '/services/gestion-copropriete',
  },
  {
    cote: 'III.',
    titre: 'Estimation',
    accroche:
      'La valeur de marché établie sur pièces, à partir des ventes réellement enregistrées dans le quartier.',
    route: '/services/vendre-estimer',
  },
  {
    cote: 'IV.',
    titre: 'Achat et vente',
    accroche:
      "Vendre un lot que l'on administre déjà, c'est vendre en connaissance : rien à découvrir chez le notaire.",
    route: '/services/vendre-estimer#les-deux-sens',
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
          découlent : on estime et on vend mieux un immeuble dont on tient les comptes.
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
              <span className="text-[0.875rem] leading-[1.5] text-ardoise">{metier.accroche}</span>
              <span className="mt-2 inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground">
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
