// Service de données de marché optimisé avec cache
class MarketDataService {
  private static instance: MarketDataService;
  private geocodeCache = new Map<string, any>();
  private marketDataCache = new Map<string, any>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 heures

  private constructor() {}

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  // Fonction pour obtenir le numéro de semaine
  private getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  }

  // Géocodage avec cache
  async geocodeAddress(address: string, city: string, postalCode: string): Promise<number[] | null> {
    const cacheKey = `${address}, ${postalCode} ${city}`;
    
    // Vérifier le cache
    if (this.geocodeCache.has(cacheKey)) {
      return this.geocodeCache.get(cacheKey);
    }

    try {
      const fullAddress = `${address}, ${postalCode} ${city}`;
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(fullAddress)}&limit=1`);
      const data = await response.json();
      
      let result = null;
      if (data.features && data.features.length > 0) {
        result = data.features[0].geometry.coordinates;
        // Mettre en cache
        this.geocodeCache.set(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  }

  // Calcul de confiance amélioré pour les données DVF
  private calculateDVFConfidence(transactions: any[]): number {
    const sampleSize = transactions.length;
    
    // 1. Facteur de taille d'échantillon (0.3 à 0.6)
    const sampleFactor = Math.min(0.6, Math.max(0.3, sampleSize / 30));
    
    // 2. Facteur de récence des données (0.2 à 0.4)
    const currentYear = new Date().getFullYear();
    const recentTransactions = transactions.filter(t => {
      const transactionYear = new Date(t.date_mutation).getFullYear();
      return currentYear - transactionYear <= 2; // Dernières 2 années
    });
    const recencyFactor = Math.min(0.4, Math.max(0.2, recentTransactions.length / sampleSize * 0.4));
    
    // 3. Facteur de cohérence des prix (0.1 à 0.3)
    const prices = transactions.map(t => t.valeur_fonciere / t.surface_reelle_bati);
    const meanPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0) / prices.length;
    const coefficientOfVariation = Math.sqrt(variance) / meanPrice;
    const consistencyFactor = Math.max(0.1, Math.min(0.3, 0.3 - coefficientOfVariation * 0.5));
    
    // 4. Facteur de diversité des biens (0.1 à 0.2)
    const uniqueTypes = new Set(transactions.map(t => t.type_local)).size;
    const diversityFactor = Math.min(0.2, uniqueTypes / 5 * 0.2);
    
    // Confiance totale (0.1 à 0.95)
    const totalConfidence = sampleFactor + recencyFactor + consistencyFactor + diversityFactor;
    
    return Math.min(0.95, Math.max(0.1, totalConfidence));
  }

  // Calcul de confiance pour la base de données
  private calculateDatabaseConfidence(postalCode: string, address: string): number {
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
    
    if (distance < 0.05) { // Paris intra-muros
      baseConfidence += 0.1; // +10%
    } else if (distance < 0.1) { // Petite couronne
      baseConfidence += 0.05; // +5%
    }
    
    // Zone urbaine vs rurale (approximation)
    if (lat > 48.5 && lat < 49.5 && lng > 1.5 && lng < 3.5) {
      baseConfidence += 0.05; // +5% pour l'Île-de-France
    }
    
    return Math.min(0.6, baseConfidence);
  }

  // API DVF officielle (gratuite)
  private async getDVFData(coordinates: number[]): Promise<any> {
    try {
      const [lng, lat] = coordinates;
      const radius = 0.01; // ~1km de rayon
      
      // Construction de la requête DVF
      const bbox = `${lng-radius},${lat-radius},${lng+radius},${lat+radius}`;
      const url = `https://api-dvf.cerema.fr/dvf?bbox=${bbox}&limit=50`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Calcul du prix moyen au m²
        const validTransactions = data.filter((transaction: any) => 
          transaction.valeur_fonciere && 
          transaction.surface_reelle_bati && 
          transaction.surface_reelle_bati > 0
        );
        
        if (validTransactions.length > 0) {
          const totalPrice = validTransactions.reduce((sum: number, t: any) => sum + t.valeur_fonciere, 0);
          const totalSurface = validTransactions.reduce((sum: number, t: any) => sum + t.surface_reelle_bati, 0);
          const averagePricePerM2 = totalPrice / totalSurface;
          
          // Calcul de confiance amélioré
          const confidence = this.calculateDVFConfidence(validTransactions);
          
          return {
            basePricePerM2: Math.round(averagePricePerM2),
            confidence: confidence,
            sampleSize: validTransactions.length,
            source: 'DVF'
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
  private async getPostalCodeFromCoordinates(coordinates: number[]): Promise<string | null> {
    try {
      const [lng, lat] = coordinates;
      const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}&limit=1`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        return properties.postcode;
      }
      return null;
    } catch (error) {
      console.error('Erreur géocodage inverse:', error);
      return null;
    }
  }

  // Données de fallback basées sur les codes postaux (plus étendues)
  private async getFallbackPriceData(postalCode: string, address: string): Promise<any> {
    // Base de données étendue des prix moyens par code postal
    const priceDatabase: {[key: string]: number} = {
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
      '67000': 3500, '33000': 4000, '44000': 3500, '35000': 4000
    };
    
    const basePrice = priceDatabase[postalCode];
    if (basePrice) {
      const confidence = this.calculateDatabaseConfidence(postalCode, address);
      return {
        basePricePerM2: basePrice,
        confidence: confidence,
        sampleSize: 15,
        source: 'Database'
      };
    }
    
    return null;
  }

  // Estimation géographique de dernier recours
  private getGeographicEstimation(lng: number, lat: number): any {
    // Estimation basée sur la distance de Paris
    const parisLng = 2.3522;
    const parisLat = 48.8566;
    const distance = Math.sqrt(Math.pow(lng - parisLng, 2) + Math.pow(lat - parisLat, 2));
    
    let basePrice = 10000; // Prix par défaut
    
    if (distance < 0.05) { // Paris intra-muros
      basePrice = 12000;
    } else if (distance < 0.1) { // Petite couronne
      basePrice = 6000;
    } else if (distance < 0.2) { // Grande couronne
      basePrice = 4000;
    } else { // Province
      basePrice = 3000;
    }
    
    const confidence = this.calculateGeographicConfidence(lng, lat);
    
    return {
      basePricePerM2: basePrice,
      confidence: confidence,
      sampleSize: 5,
      source: 'Geographic'
    };
  }

  // Récupération des données de marché via API DVF et géolocalisation
  async getMarketData(coordinates: number[], address: string): Promise<any> {
    const [lng, lat] = coordinates;
    const cacheKey = `${lng},${lat}`;
    
    // Vérifier le cache
    const cached = this.marketDataCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    
    try {
      // 1. Essayer d'abord l'API DVF officielle (gratuite)
      const dvfData = await this.getDVFData(coordinates);
      if (dvfData && dvfData.basePricePerM2 > 0) {
        const result = dvfData;
        this.marketDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
      
      // 2. Fallback sur l'API Adresse pour obtenir le code postal
      const postalCode = await this.getPostalCodeFromCoordinates(coordinates);
      if (postalCode) {
        const fallbackData = await this.getFallbackPriceData(postalCode, address);
        if (fallbackData) {
          const result = fallbackData;
          this.marketDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
          return result;
        }
      }
      
      // 3. Dernier recours : estimation basée sur la géolocalisation
      const result = this.getGeographicEstimation(lng, lat);
      this.marketDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      const result = this.getGeographicEstimation(lng, lat);
      this.marketDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
  }

  // Calcul d'estimation avec facteurs d'ajustement
  calculateEstimation(marketData: any, quickEstimation: any): number {
    const surface = parseFloat(quickEstimation.surface);
    const rooms = parseInt(quickEstimation.rooms);
    let baseEstimation = surface * marketData.basePricePerM2;

    // Ajustements selon les critères
    const adjustments = {
      // Ajustement par type de bien
      type: {
        'appartement': 1.0,
        'maison': 0.9,
        'studio': 1.1,
        'duplex': 1.15,
        'loft': 1.2
      },
      // Ajustement par nombre de pièces
      rooms: {
        1: 1.1, 2: 1.0, 3: 0.95, 4: 0.9, 5: 0.85
      },
      // Ajustement par étage
      floor: {
        'rdc': 0.9,
        '1-2': 1.0,
        '3-5': 1.05,
        '6+': 1.1
      },
      // Ajustement par état
      condition: {
        'excellent': 1.1,
        'bon': 1.0,
        'moyen': 0.9,
        'mauvais': 0.8
      }
    };

    // Appliquer les ajustements
    const typeMultiplier = adjustments.type[quickEstimation.type as keyof typeof adjustments.type] || 1.0;
    const roomsMultiplier = adjustments.rooms[rooms as keyof typeof adjustments.rooms] || 1.0;
    const floorMultiplier = adjustments.floor[quickEstimation.floor as keyof typeof adjustments.floor] || 1.0;
    const conditionMultiplier = adjustments.condition[quickEstimation.condition as keyof typeof adjustments.condition] || 1.0;

    const finalEstimation = baseEstimation * typeMultiplier * roomsMultiplier * floorMultiplier * conditionMultiplier;
    
    return Math.round(finalEstimation);
  }
}

export default MarketDataService;
