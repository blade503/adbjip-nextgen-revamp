import { useState } from 'react';

import { Champ, Liste, Rangee } from '@/components/formulaire';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { DonneesMarche } from '@/components/estimation/MarketDataService';
import { AlertCircle, ArrowRight, MapPin } from 'lucide-react';

/**
 * LE CALCULATEUR EXPRESS — la carte de l'ouverture de « Vendre & estimer ».
 *
 * Planche 2d de la direction « La Plaque » : le calculateur n'est plus une
 * section sous le pli, c'est la carte blanche à droite du titre, ce que le
 * visiteur voit en arrivant. La validation, les props et les libellés sont
 * INCHANGÉS ; seule la mise en page l'est.
 *
 * LA PLANCHE MONTRAIT CINQ CHAMPS ; IL EN FAUT SEPT. Code postal et ville
 * manquaient sur la planche, mais `calculateEstimation` les exige pour le
 * géocodage et l'API DVF : les retirer casserait le calcul. L'étage reste,
 * facultatif — il pèse dans le résultat.
 *
 * Corrections de fond conservées de la version précédente : la confiance
 * affichée est celle du calcul et non « 75 % » écrit en dur ; sans donnée, le
 * bloc d'indicateurs ne s'affiche pas plutôt que d'en inventer.
 */

interface QuickEstimation {
  address: string;
  city: string;
  postalCode: string;
  surface: string;
  rooms: string;
  type: string;
  floor: string;
  condition: string;
}


interface QuickCalculatorProps {
  quickEstimation: QuickEstimation;
  setQuickEstimation: (estimation: QuickEstimation) => void;
  estimationResult: number | null;
  isCalculating: boolean;
  errorMessage: string | null;
  onCalculate: () => void;
  onShowMap: () => void;
  marketData?: DonneesMarche | null;
}

/** Les trois sources, contenu repris tel quel. */
const SOURCES = [
  {
    titre: 'API DVF officielle',
    points: [
      'Transactions immobilières réelles depuis 2014',
      'Direction Générale des Finances Publiques',
      'Analyse dans un rayon de 1 km',
      'Confiance : 60-95 % selon les données',
    ],
  },
  {
    titre: 'Base de données',
    points: [
      'Prix moyens par code postal',
      'Observatoires immobiliers locaux',
      'Données notaires et agents',
      'Confiance : 60-80 % selon la zone',
    ],
  },
  {
    titre: 'Analyse géographique',
    points: [
      'Distance et contexte urbain',
      'Données démographiques',
      'Comparaisons régionales',
      'Confiance : 40-60 % approximatif',
    ],
  },
];

const TYPES: [string, string][] = [
  ['', 'Sélectionnez'],
  ['appartement', 'Appartement'],
  ['maison', 'Maison'],
  ['studio', 'Studio'],
  ['duplex', 'Duplex'],
  ['loft', 'Loft'],
];

const ETAGES: [string, string][] = [
  ['', 'Sélectionnez'],
  ['rdc', 'Rez-de-chaussée'],
  ['1-2', '1er-2ème étage'],
  ['3-5', '3ème-5ème étage'],
  ['6+', '6ème étage et plus'],
];

const ETATS: [string, string][] = [
  ['excellent', 'Excellent'],
  ['bon', 'Bon'],
  ['moyen', 'Moyen'],
  ['mauvais', 'Mauvais'],
];

const QuickCalculator = ({
  quickEstimation,
  setQuickEstimation,
  estimationResult,
  isCalculating,
  errorMessage,
  onCalculate,
  onShowMap,
  marketData = null,
}: QuickCalculatorProps) => {
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [sourcesOuvertes, setSourcesOuvertes] = useState(false);

  // Validation en temps réel — identique à la version précédente.
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    if (field === 'postalCode') {
      const postalRegex = /^\d{5}$/;
      if (value && !postalRegex.test(value)) {
        errors.postalCode = 'Code postal invalide (5 chiffres)';
      } else {
        delete errors.postalCode;
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setQuickEstimation({ ...quickEstimation, [field]: value });
    validateField(field, value);
  };

  const enErreur = Object.keys(validationErrors);
  const confiance =
    typeof marketData?.confidence === 'number'
      ? Math.round(marketData.confidence * (marketData.confidence <= 1 ? 100 : 1))
      : null;

  return (
    <div id="calculateur-rapide" className="panneau scroll-mt-24 p-6 lg:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[clamp(1.5rem,2.2vw,1.75rem)]">Estimation rapide en 30 secondes</h2>
        <span className="cote">Express</span>
      </div>
      <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
        Une première fourchette basée sur les données du marché.
      </p>

      {errorMessage && (
        <p
          role="status"
          className="mt-5 flex items-start gap-3 border-l-2 border-destructive bg-destructive/5 py-3 pl-4 text-[0.875rem] text-destructive-ink"
        >
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </p>
      )}

      <form
        className="mt-6 space-y-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
      >
        <Champ
          nom="adresse"
          prefixe="calc"
          etiquette="Adresse du bien"
          requis
          enErreur={enErreur}
          type="text"
          placeholder="Ex : 15 rue de Rivoli"
          autoComplete="street-address"
          value={quickEstimation.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />

        {/* `nom` DOIT être la clé de `validationErrors` : c'est par elle
            qu'`enErreur` relie le message au champ (`aria-invalid`,
            `aria-describedby`). */}
        <Rangee>
          <Champ
            nom="postalCode"
            prefixe="calc"
            etiquette="Code postal"
            requis
            enErreur={enErreur}
            messageErreur={validationErrors.postalCode}
            type="text"
            inputMode="numeric"
            placeholder="75008"
            autoComplete="postal-code"
            value={quickEstimation.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
          />
          <Champ
            nom="ville"
            prefixe="calc"
            etiquette="Ville"
            requis
            enErreur={enErreur}
            type="text"
            placeholder="Paris"
            autoComplete="address-level2"
            value={quickEstimation.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </Rangee>

        <Rangee>
          <Champ
            nom="surface"
            prefixe="calc"
            etiquette="Surface (m²)"
            requis
            enErreur={enErreur}
            type="number"
            inputMode="numeric"
            placeholder="Ex : 75"
            value={quickEstimation.surface}
            onChange={(e) => handleInputChange('surface', e.target.value)}
          />
          <Champ
            nom="pieces"
            prefixe="calc"
            etiquette="Pièces"
            requis
            enErreur={enErreur}
            type="number"
            inputMode="numeric"
            placeholder="Ex : 3"
            value={quickEstimation.rooms}
            onChange={(e) => handleInputChange('rooms', e.target.value)}
          />
        </Rangee>

        <Rangee>
          <Liste
            nom="type"
            prefixe="calc"
            etiquette="Type de bien"
            enErreur={enErreur}
            options={TYPES}
            value={quickEstimation.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          />
          <Liste
            nom="etage"
            prefixe="calc"
            etiquette="Étage"
            enErreur={enErreur}
            options={ETAGES}
            value={quickEstimation.floor}
            onChange={(e) => handleInputChange('floor', e.target.value)}
          />
        </Rangee>

        <Liste
          nom="etat"
          prefixe="calc"
          etiquette="État général"
          enErreur={enErreur}
          options={ETATS}
          value={quickEstimation.condition}
          onChange={(e) => handleInputChange('condition', e.target.value)}
        />

        <Button type="submit" size="lg" disabled={isCalculating} className="w-full">
          {isCalculating ? (
            <span role="status" className="flex items-center gap-2.5">
              <span aria-hidden className="attente block h-4 w-4 rounded-full border-b-2 border-current" />
              Calcul en cours…
            </span>
          ) : (
            <>
              Calculer mon estimation
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
        <button
          type="button"
          onClick={() => setSourcesOuvertes(true)}
          className="lien-trait font-medium text-foreground"
        >
          Sources et méthodologie
        </button>
        {' · '}Une estimation détaillée sur place reste la référence.
      </p>

      {/* ---- LE RÉSULTAT ---------------------------------------------- */}
      {estimationResult && !isCalculating && (
        <div className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-6">
          <div className="nuit bg-marine p-5 text-pierre">
            <p className="gravure">Estimation indicative</p>
            <p className="tabulaire mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-none">
              {estimationResult.toLocaleString('fr-FR')} €
            </p>
          </div>

          {/* Les indicateurs RÉELS du calcul. Sans donnée, rien ne s'affiche. */}
          {(confiance !== null || marketData?.sampleSize || marketData?.source) && (
            <dl className="mt-4 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {confiance !== null && (
                <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                  <dt className="text-[0.8125rem] text-muted-foreground">Indice de confiance</dt>
                  <dd className="tabulaire font-display text-[0.875rem] font-semibold">{confiance} %</dd>
                </div>
              )}
              {typeof marketData?.sampleSize === 'number' && (
                <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                  <dt className="text-[0.8125rem] text-muted-foreground">Transactions retenues</dt>
                  <dd className="tabulaire font-display text-[0.875rem] font-semibold">{marketData.sampleSize}</dd>
                </div>
              )}
              {marketData?.source && (
                <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                  <dt className="text-[0.8125rem] text-muted-foreground">Source</dt>
                  <dd className="text-[0.8125rem] font-medium">{marketData.source}</dd>
                </div>
              )}
            </dl>
          )}

          <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
            Estimation indicative basée sur des données moyennes. Pour une évaluation précise,
            contactez nos experts.
          </p>

          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={onShowMap}>
            <MapPin aria-hidden />
            Voir sur la carte
          </Button>
        </div>
      )}

      {/* ---- SOURCES ET MÉTHODOLOGIE ------------------------------- */}
      <Dialog open={sourcesOuvertes} onOpenChange={setSourcesOuvertes}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sources et méthodologie</DialogTitle>
          </DialogHeader>

          <p className="mesure-large text-[0.9375rem] leading-relaxed text-ardoise">
            Notre calculateur d'estimation rapide s'appuie sur des données officielles et des
            méthodes éprouvées.
          </p>

          <div className="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-3">
            {SOURCES.map((s) => (
              <div key={s.titre}>
                <h3 className="text-[1.25rem]">{s.titre}</h3>
                <ul className="mt-3 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-2 text-[0.875rem] leading-relaxed text-ardoise last:border-0"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickCalculator;
