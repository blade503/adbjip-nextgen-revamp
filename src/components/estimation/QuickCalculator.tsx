import { useState } from 'react';

import { Champ, Liste, Rangee } from '@/components/formulaire';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, ArrowRight, Calculator, MapPin } from 'lucide-react';

/**
 * LE CALCULATEUR RAPIDE — recomposé dans le langage de la charte.
 *
 * LA VALIDATION, LES PROPS ET LES LIBELLÉS SONT INCHANGÉS. Les huit champs, leurs
 * étiquettes, leurs exemples et leurs listes d'options sont repris mot pour mot ;
 * `validateField` et `handleInputChange` sont identiques.
 *
 * CE QUI A CHANGÉ EST LA FORME. Relevé avant : ce seul fichier portait 11 gélules
 * (`rounded-full`), 12 `glass`, 18 centrages, 7 ombres portées, 5 boucles
 * `animate-*` — l'essentiel des 72 vestiges de la page.
 *
 *  - les huit champs à fond de verre dépoli → les champs réglés du site
 *    (`Champ`, `Liste` de `@/components/formulaire`), ceux du formulaire de
 *    contact. Un filet sous le champ, pas une boîte.
 *  - le bouton d'information rond de 44 px → un lien à filet. C'était la
 *    dernière gélule du site, et le signe le plus reconnaissable du gabarit.
 *  - la modale à trois cartes de verre → le `Dialog` du site, contenu intact.
 *  - les six pictogrammes collés aux étiquettes → retirés : une étiquette de
 *    formulaire se lit, elle n'a pas besoin d'être illustrée.
 *  - le prix sur aplat en dégradé à coins de 16 px → une plaque de nuit.
 *  - les squelettes `animate-pulse` → l'indicateur d'attente de la charte, celui
 *    que le mouvement réduit ralentit au lieu de supprimer.
 *
 * TROIS CORRECTIONS DE FOND, trouvées en recomposant :
 *
 *  1. « Confiance : 75 % » et sa barre aux trois quarts étaient ÉCRITES EN DUR.
 *     `MarketDataService` calcule une confiance réelle, et la page parente la
 *     détient déjà dans `estimationData` — elle la passait à la carte mais pas
 *     ici. Le chiffre affiché est maintenant celui du calcul, avec la taille
 *     d'échantillon et la source. Sans donnée, le bloc ne s'affiche pas.
 *  2. `MarketDataService` était importé sans être utilisé.
 *  3. `isLoadingData` n'était jamais mis à vrai : état mort, retiré.
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

/** Ce que renvoie `MarketDataService` — voir sa cascade DVF → table → géo. */
interface DonneesMarche {
  confidence?: number;
  sampleSize?: number;
  source?: string;
  basePricePerM2?: number;
}

interface QuickCalculatorProps {
  quickEstimation: QuickEstimation;
  setQuickEstimation: (estimation: QuickEstimation) => void;
  estimationResult: number | null;
  isCalculating: boolean;
  errorMessage: string | null;
  onCalculate: () => void;
  onShowMap: () => void;
  /** Données réellement renvoyées par le calcul. Facultatif : sans elles, les
      indicateurs ne s'affichent pas — plutôt que d'en inventer. */
  marketData?: DonneesMarche | null;
}

/** Les trois sources, contenu repris tel quel de la version précédente. */
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
    <section id="calculateur-rapide" className="scroll-mt-24 bg-background py-20 lg:py-28">
      <div className="container mx-auto">
        <EnTeteSection
          plaque="Estimation express"
          titre="Estimation rapide en 30 secondes"
          chapeau="Obtenez une première estimation de votre bien basée sur les données du marché."
          aparte={
            <button
              type="button"
              onClick={() => setSourcesOuvertes(true)}
              className="lien-trait inline-flex min-h-[24px] items-center font-display text-[0.6875rem] font-semibold uppercase tracking-[0.13em]"
            >
              Sources et méthodologie
            </button>
          }
        />

        {errorMessage && (
          <Voile delai={60}>
            <p
              role="status"
              className="mt-10 flex items-start gap-3 border-l-2 border-destructive bg-destructive/5 py-3 pl-4 text-[0.875rem] text-destructive-ink"
            >
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              {errorMessage}
            </p>
          </Voile>
        )}

        <Voile delai={120}>
          <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-12">
            {/* ---- LE FORMULAIRE ------------------------------------- */}
            <div className="lg:col-span-7">
              <h3 className="text-[clamp(1.25rem,2vw,1.5rem)]">Informations de base</h3>
              <p className="mesure mt-2 text-[0.9375rem] text-muted-foreground">
                Remplissez les champs ci-dessous pour obtenir votre estimation.
              </p>

              <form
                className="mt-8 space-y-6"
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
                  placeholder="Ex: 15 rue de Rivoli"
                  autoComplete="street-address"
                  value={quickEstimation.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />

                <Rangee>
                  <Champ
                    nom="cp"
                    prefixe="calc"
                    etiquette="Code postal"
                    enErreur={enErreur}
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
                    enErreur={enErreur}
                    type="text"
                    placeholder="Paris"
                    autoComplete="address-level2"
                    value={quickEstimation.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </Rangee>

                {validationErrors.postalCode && (
                  <p className="text-[0.8125rem] text-destructive-ink">
                    {validationErrors.postalCode}
                  </p>
                )}

                <Rangee>
                  <Champ
                    nom="surface"
                    prefixe="calc"
                    etiquette="Surface (m²)"
                    requis
                    enErreur={enErreur}
                    type="number"
                    inputMode="numeric"
                    placeholder="Ex: 75"
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
                    placeholder="Ex: 3"
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

                <Button type="submit" size="lg" disabled={isCalculating} className="w-full sm:w-auto">
                  {isCalculating ? (
                    <span role="status" className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="attente block h-4 w-4 rounded-full border-b-2 border-current"
                      />
                      Calcul en cours…
                    </span>
                  ) : (
                    <>
                      <Calculator aria-hidden />
                      Calculer mon estimation
                      <ArrowRight aria-hidden />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* ---- LE RÉSULTAT --------------------------------------- */}
            <div className="lg:col-span-5">
              <h3 className="text-[clamp(1.25rem,2vw,1.5rem)]">Estimation</h3>
              <p className="mesure mt-2 text-[0.9375rem] text-muted-foreground">
                Basée sur les données du marché immobilier.
              </p>

              {isCalculating ? (
                <div
                  role="status"
                  className="mt-8 flex items-center gap-3 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-8 text-[0.9375rem] text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="attente block h-4 w-4 rounded-full border-b-2 border-primary"
                  />
                  Calcul en cours…
                </div>
              ) : estimationResult ? (
                <div className="mt-8">
                  {/* Le prix sur une plaque de nuit : c'est le chiffre de la
                      page, il mérite le champ d'émail. */}
                  <div className="nuit cadre bg-nuit p-6 text-pierre">
                    <p className="tabulaire font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
                      Estimation indicative
                    </p>
                    <p className="tabulaire mt-2 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold">
                      {estimationResult.toLocaleString('fr-FR')} €
                    </p>
                  </div>

                  {/* Les indicateurs RÉELS du calcul. Sans donnée, rien ne
                      s'affiche — la version précédente écrivait « 75 % » en dur. */}
                  {(confiance !== null || marketData?.sampleSize || marketData?.source) && (
                    <dl className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                      {confiance !== null && (
                        <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3">
                          <dt className="text-[0.875rem] text-muted-foreground">Indice de confiance</dt>
                          <dd className="tabulaire font-display text-[0.9375rem] font-semibold">
                            {confiance} %
                          </dd>
                        </div>
                      )}
                      {typeof marketData?.sampleSize === 'number' && (
                        <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3">
                          <dt className="text-[0.875rem] text-muted-foreground">Transactions retenues</dt>
                          <dd className="tabulaire font-display text-[0.9375rem] font-semibold">
                            {marketData.sampleSize}
                          </dd>
                        </div>
                      )}
                      {marketData?.source && (
                        <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3">
                          <dt className="text-[0.875rem] text-muted-foreground">Source</dt>
                          <dd className="text-[0.875rem] font-medium">{marketData.source}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <p className="mesure mt-6 border-l-2 border-primary py-2 pl-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    <strong className="font-semibold text-foreground">Note :</strong> estimation
                    indicative basée sur des données moyennes. Pour une évaluation précise,
                    contactez nos experts.
                  </p>

                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-6 w-full"
                    onClick={onShowMap}
                  >
                    <MapPin aria-hidden />
                    Voir sur la carte
                    <ArrowRight aria-hidden />
                  </Button>
                </div>
              ) : (
                /* État vide, ferré à gauche : rien n'est centré sur ce site,
                   pas même une attente. Le cercle gris de 80 px a disparu. */
                <div className="mt-8 border-t border-[hsl(var(--trait)/var(--trait-a))] pt-8">
                  <p className="font-display text-[1.0625rem]">Prêt à calculer</p>
                  <p className="mesure mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                    Remplissez le formulaire pour obtenir votre estimation rapide.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Voile>
      </div>

      {/* ---- SOURCES ET MÉTHODOLOGIE -------------------------------
          Le `Dialog` du site remplace la modale maison : il apporte le piège du
          focus, la fermeture par Échap et l'inertie de l'arrière-plan, qu'il
          fallait sinon réécrire. Contenu repris tel quel. */}
      <Dialog open={sourcesOuvertes} onOpenChange={setSourcesOuvertes}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pr-8 text-[clamp(1.375rem,2.6vw,1.875rem)]">
              Sources et méthodologie
            </DialogTitle>
          </DialogHeader>

          <p className="mesure-large text-[0.9375rem] leading-relaxed text-muted-foreground">
            Notre calculateur d'estimation rapide s'appuie sur des données officielles et des
            méthodes éprouvées.
          </p>

          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-3">
            {SOURCES.map((s) => (
              <div key={s.titre}>
                <h3 className="text-[1.0625rem]">{s.titre}</h3>
                <ul className="mt-4 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="flex gap-3 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5 last:border-0"
                    >
                      <span aria-hidden className="mt-[0.6rem] h-px w-3 shrink-0 bg-primary-ink" />
                      <span className="text-[0.875rem] leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default QuickCalculator;
