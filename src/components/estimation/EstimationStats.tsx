import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';

/**
 * LES QUATRE REPÈRES DE L'ESTIMATION.
 *
 * Les valeurs et les libellés sont ceux d'avant, mot pour mot. Ce qui change
 * est la forme : les quatre carrés d'icônes en aplat de laiton — le décor le
 * plus daté de la page — deviennent une rangée réglée, comme les repères de
 * l'ouverture des pages services.
 *
 * Le titre était centré avec un mot en dégradé ; il passe par `EnTeteSection`,
 * donc plaque vissée, filet qui court, mesure de 46 caractères. Le laiton reste
 * sur la plaque, où son contraste est mesuré — en texte sur la pierre il ne fait
 * que 1,81:1.
 *
 * « 24 h » reste en attente d'arbitrage, comme partout ailleurs sur le site :
 * la charte interdit d'inventer un chiffre, pas de conserver celui qui y était.
 */
const REPERES = [
  { valeur: '2011', libelle: 'Agence créée en' },
  { valeur: 'DVF', libelle: 'Données publiques DGFiP' },
  { valeur: 'Gratuit', libelle: 'Sans engagement' },
  { valeur: '24 h', libelle: 'Délai de réponse' },
];

const EstimationStats = () => (
  <section className="bg-ivoire py-20 lg:py-28">
    <div className="container mx-auto">
      <EnTeteSection
        plaque="Les repères"
        titre="Pourquoi nous faire confiance ?"
        chapeau="Une estimation adossée aux transactions réellement enregistrées."
      />

      <Voile delai={120}>
        <dl className="mt-14 grid grid-cols-2 border-t border-[hsl(var(--trait)/var(--trait-a))] lg:grid-cols-4">
          {REPERES.map(({ valeur, libelle }) => (
            <div
              key={libelle}
              className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-6 lg:border-b-0 lg:border-l lg:border-[hsl(var(--trait)/var(--trait-a))] lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="font-display text-[clamp(1.5rem,2.6vw,2.125rem)] font-semibold text-primary-display">
                {valeur}
              </dt>
              <dd className="mt-1.5 text-[0.875rem] text-muted-foreground">{libelle}</dd>
            </div>
          ))}
        </dl>
      </Voile>
    </div>
  </section>
);

export default EstimationStats;
