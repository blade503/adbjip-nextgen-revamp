/**
 * Service de données de marché — singleton, caches de 24 h.
 *
 * Toute la logique d'estimation vit ici : géocodage via api-adresse.data.gouv.fr,
 * puis une cascade de trois sources, chacune renvoyant le même objet
 * `DonneesMarche` :
 *
 *   1. DVF (api-dvf.cerema.fr) — les transactions réelles dans un rayon d'1 km ;
 *   2. la table de prix par code postal, quand DVF ne renvoie rien ;
 *   3. l'estimation géographique, en dernier recours, sur la distance à Paris.
 *
 * Passer par ce service plutôt que refaire un `fetch` : `InteractiveMap` a
 * longtemps dupliqué le géocodage. N'afficher que les champs réellement
 * renvoyés — pas de délai de vente ni d'évolution annuelle, qui ne sont pas
 * calculés.
 *
 * TYPÉ LE 04/09/2026 : ce fichier portait douze `any`, les seules erreurs de
 * lint du dépôt hors configuration. Le comportement est inchangé — mêmes
 * appels, mêmes seuils, mêmes multiplicateurs — seules les formes sont
 * déclarées. `DonneesMarche` est exportée pour les trois consommateurs
 * (`VendreEstimer`, `QuickCalculator`, `InteractiveMap`), qui déclaraient
 * chacun leur propre copie de l'interface.
 */

/** Longitude puis latitude — l'ordre de l'API Adresse (GeoJSON). */
export type Coordonnees = [number, number];

export interface DonneesMarche {
  basePricePerM2: number;
  /** Indice de confiance, entre 0 et 1. */
  confidence: number;
  /** Nombre de transactions retenues pour le calcul. */
  sampleSize: number;
  source: 'DVF' | 'Database' | 'Geographic';
}

/** Une ligne de l'API DVF, réduite aux champs lus. */
interface TransactionDVF {
  valeur_fonciere: number | null;
  surface_reelle_bati: number | null;
  date_mutation: string;
  type_local: string;
}

/** Les critères du calculateur, tels que `calculateEstimation` les lit. */
interface CriteresEstimation {
  surface: string;
  rooms: string;
  type: string;
  floor: string;
  condition: string;
}

class MarketDataService {
  private static instance: MarketDataService;
  private geocodeCache = new Map<string, Coordonnees>();
  private marketDataCache = new Map<string, { data: DonneesMarche; timestamp: number }>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 heures

  private constructor() {}

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  // Géocodage avec cache
  async geocodeAddress(address: string, city: string, postalCode: string): Promise<Coordonnees | null> {
    const cacheKey = `${address}, ${postalCode} ${city}`;

    const enCache = this.geocodeCache.get(cacheKey);
    if (enCache) return enCache;

    try {
      const fullAddress = `${address}, ${postalCode} ${city}`;
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(fullAddress)}&limit=1`,
      );
      const data: { features?: { geometry: { coordinates: Coordonnees } }[] } = await response.json();

      let result: Coordonnees | null = null;
      if (data.features && data.features.length > 0) {
        result = data.features[0].geometry.coordinates;
        this.geocodeCache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  }

  // Calcul de confiance amélioré pour les données DVF
  private calculateDVFConfidence(transactions: TransactionDVF[]): number {
    const sampleSize = transactions.length;

    // 1. Facteur de taille d'échantillon (0.3 à 0.6)
    const sampleFactor = Math.min(0.6, Math.max(0.3, sampleSize / 30));

    // 2. Facteur de récence des données (0.2 à 0.4)
    const currentYear = new Date().getFullYear();
    const recentTransactions = transactions.filter((t) => {
      const transactionYear = new Date(t.date_mutation).getFullYear();
      return currentYear - transactionYear <= 2; // Dernières 2 années
    });
    const recencyFactor = Math.min(0.4, Math.max(0.2, (recentTransactions.length / sampleSize) * 0.4));

    // 3. Facteur de cohérence des prix (0.1 à 0.3)
    const prices = transactions.map((t) => (t.valeur_fonciere ?? 0) / (t.surface_reelle_bati ?? 1));
    const meanPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0) / prices.length;
    const coefficientOfVariation = Math.sqrt(variance) / meanPrice;
    const consistencyFactor = Math.max(0.1, Math.min(0.3, 0.3 - coefficientOfVariation * 0.5));

    // 4. Facteur de diversité des biens (0.1 à 0.2)
    const uniqueTypes = new Set(transactions.map((t) => t.type_local)).size;
    const diversityFactor = Math.min(0.2, (uniqueTypes / 5) * 0.2);

    // Confiance totale (0.1 à 0.95)
    const totalConfidence = sampleFactor + recencyFactor + consistencyFactor + diversityFactor;

    return Math.min(0.95, Math.max(0.1, totalConfidence));
  }

  // Calcul de confiance pour la base de données
  private calculateDatabaseConfidence(postalCode: string): number {
    let baseConfidence = 0.6; // Base de 60%

    // Ajustement selon la précision du code postal
    if (postalCode.length === 5) {
      baseConfidence += 0.1; // +10% pour code postal complet
    }

    // Ajustement selon la densité urbaine (approximation)
    const urbanCodes = ['75001', '75002', '75003', '75004', '75005', '75006', '75007', '75008', '75009', '75010'];
    if (urbanCodes.includes(postalCode)) {
      baseConfidence += 0.1; // +10% pour Paris centre (plus de données)
    }

    // Ajustement selon la taille de la ville
    const majorCities = ['69000', '13000', '31000', '59000', '67000', '33000', '44000', '35000'];
    if (majorCities.includes(postalCode)) {
      baseConfidence += 0.05; // +5% pour grandes villes
    }

    return Math.min(0.8, baseConfidence);
  }

  // Calcul de confiance pour l'estimation géographique
  private calculateGeographicConfidence(lng: number, lat: number): number {
    let baseConfidence = 0.4; // Base de 40%

    // Distance de Paris (plus on est proche, plus c'est fiable)
    const parisLng = 2.3522;
    const parisLat = 48.8566;
    const distance = Math.sqrt(Math.pow(lng - parisLng, 2) + Math.pow(lat - parisLat, 2));

    if (distance < 0.05) {
      // Paris intra-muros
      baseConfidence += 0.1;
    } else if (distance < 0.1) {
      // Petite couronne
      baseConfidence += 0.05;
    }

    // Zone urbaine vs rurale (approximation)
    if (lat > 48.5 && lat < 49.5 && lng > 1.5 && lng < 3.5) {
      baseConfidence += 0.05; // +5% pour l'Île-de-France
    }

    return Math.min(0.6, baseConfidence);
  }

  // API DVF officielle (gratuite)
  private async getDVFData(coordinates: Coordonnees): Promise<DonneesMarche | null> {
    try {
      const [lng, lat] = coordinates;
      const radius = 0.01; // ~1km de rayon

      const bbox = `${lng - radius},${lat - radius},${lng + radius},${lat + radius}`;
      const url = `https://api-dvf.cerema.fr/dvf?bbox=${bbox}&limit=50`;

      const response = await fetch(url);
      const data: TransactionDVF[] = await response.json();

      if (data && data.length > 0) {
        const validTransactions = data.filter(
          (transaction) =>
            transaction.valeur_fonciere && transaction.surface_reelle_bati && transaction.surface_reelle_bati > 0,
        );

        if (validTransactions.length > 0) {
          const totalPrice = validTransactions.reduce((sum, t) => sum + (t.valeur_fonciere ?? 0), 0);
          const totalSurface = validTransactions.reduce((sum, t) => sum + (t.surface_reelle_bati ?? 0), 0);
          const averagePricePerM2 = totalPrice / totalSurface;

          return {
            basePricePerM2: Math.round(averagePricePerM2),
            confidence: this.calculateDVFConfidence(validTransactions),
            sampleSize: validTransactions.length,
            source: 'DVF',
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Erreur API DVF:', error);
      return null;
    }
  }

  // Récupération du code postal via géocodage inverse
  private async getPostalCodeFromCoordinates(coordinates: Coordonnees): Promise<string | null> {
    try {
      const [lng, lat] = coordinates;
      const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}&limit=1`);
      const data: { features?: { properties: { postcode?: string } }[] } = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].properties.postcode ?? null;
      }
      return null;
    } catch (error) {
      console.error('Erreur géocodage inverse:', error);
      return null;
    }
  }

  // Données de fallback basées sur les codes postaux (plus étendues)
  private getFallbackPriceData(postalCode: string): DonneesMarche | null {
    // Base de données étendue des prix moyens par code postal
    const priceDatabase: { [key: string]: number } = {
      // Paris
      '75001': 15000, '75002': 14000, '75003': 13000, '75004': 14000,
      '75005': 12000, '75006': 15000, '75007': 16000, '75008': 18000,
      '75009': 12000, '75010': 10000, '75011': 9500, '75012': 9000,
      '75013': 8500, '75014': 10000, '75015': 11000, '75016': 14000,
      '75017': 11000, '75018': 9000, '75019': 8000, '75020': 7500,

      // Petite couronne
      '92000': 6500, '92100': 6500, '92200': 6500, '92300': 6500, // Colombes, Levallois, etc.
      '92400': 6000, '92500': 6000, '92600': 6000, '92700': 6000, // Courbevoie, Asnières, etc.
      '93000': 5500, '93100': 5500, '93200': 5500, '93300': 5500, // Bobigny, Montreuil, etc.
      '94000': 7000, '94100': 7000, '94200': 7000, '94300': 7000, // Créteil, Vincennes, etc.

      // Grande couronne
      '78000': 4500, '91000': 4000, '95000': 5000, '77000': 3500,

      // Autres grandes villes
      '69000': 4500, '13000': 4000, '31000': 3500, '59000': 3000,
      '67000': 3500, '33000': 4000, '44000': 3500, '35000': 4000,
    };

    const basePrice = priceDatabase[postalCode];
    if (basePrice) {
      return {
        basePricePerM2: basePrice,
        confidence: this.calculateDatabaseConfidence(postalCode),
        sampleSize: 15,
        source: 'Database',
      };
    }

    return null;
  }

  // Estimation géographique de dernier recours
  private getGeographicEstimation(lng: number, lat: number): DonneesMarche {
    // Estimation basée sur la distance de Paris
    const parisLng = 2.3522;
    const parisLat = 48.8566;
    const distance = Math.sqrt(Math.pow(lng - parisLng, 2) + Math.pow(lat - parisLat, 2));

    let basePrice = 10000; // Prix par défaut

    if (distance < 0.05) {
      basePrice = 12000; // Paris intra-muros
    } else if (distance < 0.1) {
      basePrice = 6000; // Petite couronne
    } else if (distance < 0.2) {
      basePrice = 4000; // Grande couronne
    } else {
      basePrice = 3000; // Province
    }

    return {
      basePricePerM2: basePrice,
      confidence: this.calculateGeographicConfidence(lng, lat),
      sampleSize: 5,
      source: 'Geographic',
    };
  }

  // Récupération des données de marché via API DVF et géolocalisation
  async getMarketData(coordinates: Coordonnees, _address: string): Promise<DonneesMarche> {
    const [lng, lat] = coordinates;
    const cacheKey = `${lng},${lat}`;

    const cached = this.marketDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    const memoriser = (result: DonneesMarche) => {
      this.marketDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    };

    try {
      // 1. Essayer d'abord l'API DVF officielle (gratuite)
      const dvfData = await this.getDVFData(coordinates);
      if (dvfData && dvfData.basePricePerM2 > 0) return memoriser(dvfData);

      // 2. Fallback sur l'API Adresse pour obtenir le code postal
      const postalCode = await this.getPostalCodeFromCoordinates(coordinates);
      if (postalCode) {
        const fallbackData = this.getFallbackPriceData(postalCode);
        if (fallbackData) return memoriser(fallbackData);
      }

      // 3. Dernier recours : estimation basée sur la géolocalisation
      return memoriser(this.getGeographicEstimation(lng, lat));
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return memoriser(this.getGeographicEstimation(lng, lat));
    }
  }

  // Calcul d'estimation avec facteurs d'ajustement
  calculateEstimation(marketData: DonneesMarche, quickEstimation: CriteresEstimation): number {
    const surface = parseFloat(quickEstimation.surface);
    const rooms = parseInt(quickEstimation.rooms);
    const baseEstimation = surface * marketData.basePricePerM2;

    // Ajustements selon les critères
    const adjustments = {
      type: { appartement: 1.0, maison: 0.9, studio: 1.1, duplex: 1.15, loft: 1.2 },
      rooms: { 1: 1.1, 2: 1.0, 3: 0.95, 4: 0.9, 5: 0.85 },
      floor: { rdc: 0.9, '1-2': 1.0, '3-5': 1.05, '6+': 1.1 },
      condition: { excellent: 1.1, bon: 1.0, moyen: 0.9, mauvais: 0.8 },
    };

    const typeMultiplier = adjustments.type[quickEstimation.type as keyof typeof adjustments.type] || 1.0;
    const roomsMultiplier = adjustments.rooms[rooms as keyof typeof adjustments.rooms] || 1.0;
    const floorMultiplier = adjustments.floor[quickEstimation.floor as keyof typeof adjustments.floor] || 1.0;
    const conditionMultiplier =
      adjustments.condition[quickEstimation.condition as keyof typeof adjustments.condition] || 1.0;

    const finalEstimation = baseEstimation * typeMultiplier * roomsMultiplier * floorMultiplier * conditionMultiplier;

    return Math.round(finalEstimation);
  }
}

export default MarketDataService;
