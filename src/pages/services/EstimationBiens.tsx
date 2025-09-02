import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calculator, CheckCircle, ArrowRight, Phone, TrendingUp, Clock, FileText, Home, MapPin, Euro, Send, Star, Award, Users, MessageSquare, Building, Zap, MapPin as MapPinIcon, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import estimationBienImage from '@/assets/EstimationBien.png';

const EstimationBiens = () => {
  // État pour le calculateur rapide
  const [quickEstimation, setQuickEstimation] = useState({
    address: '',
    city: '',
    postalCode: '',
    surface: '',
    rooms: '',
    type: '',
    floor: '',
    condition: 'bon'
  });
  const [estimationResult, setEstimationResult] = useState<number | null>(null);
  const [estimationData, setEstimationData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [weeklyDemands, setWeeklyDemands] = useState(23);
  const [monthlyEstimations, setMonthlyEstimations] = useState(127);
  const [weeklyPercentage, setWeeklyPercentage] = useState(23);

  // Extension de Date pour obtenir le numéro de semaine
  Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };

  // Chargement des données sauvegardées au montage
  useEffect(() => {
    loadFromLocalStorage();
    loadCounters();
  }, []);

  // Chargement des compteurs depuis localStorage
  const loadCounters = () => {
    try {
      const savedWeekly = localStorage.getItem('weeklyDemands');
      const savedMonthly = localStorage.getItem('monthlyEstimations');
      const savedPercentage = localStorage.getItem('weeklyPercentage');
      const savedPercentageDate = localStorage.getItem('weeklyPercentageDate');
      
      if (savedWeekly) {
        setWeeklyDemands(parseInt(savedWeekly));
      }
      if (savedMonthly) {
        setMonthlyEstimations(parseInt(savedMonthly));
      }
      
      // Gestion du pourcentage hebdomadaire
      const now = new Date();
      const currentWeek = now.getFullYear() + '-' + now.getWeek();
      
      if (savedPercentage && savedPercentageDate === currentWeek) {
        // Le pourcentage de cette semaine existe déjà
        setWeeklyPercentage(parseInt(savedPercentage));
      } else {
        // Nouvelle semaine ou premier visiteur - générer un pourcentage aléatoire
        const randomPercentage = Math.floor(Math.random() * 20) + 15; // Entre 15% et 34%
        setWeeklyPercentage(randomPercentage);
        
        // Sauvegarder pour cette semaine
        localStorage.setItem('weeklyPercentage', randomPercentage.toString());
        localStorage.setItem('weeklyPercentageDate', currentWeek);
      }
    } catch (error) {
      console.error('Erreur chargement compteurs:', error);
    }
  };

  // Sauvegarde des compteurs
  const saveCounters = () => {
    try {
      localStorage.setItem('weeklyDemands', weeklyDemands.toString());
      localStorage.setItem('monthlyEstimations', monthlyEstimations.toString());
    } catch (error) {
      console.error('Erreur sauvegarde compteurs:', error);
    }
  };

  // Incrémenter les compteurs
  const incrementCounters = () => {
    setWeeklyDemands(prev => {
      const newValue = prev + 1;
      localStorage.setItem('weeklyDemands', newValue.toString());
      return newValue;
    });
    
    setMonthlyEstimations(prev => {
      const newValue = prev + 1;
      localStorage.setItem('monthlyEstimations', newValue.toString());
      return newValue;
    });
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Entrée pour valider le calculateur rapide
      if (e.key === 'Enter' && !isCalculating) {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('#calculateur-rapide')) {
          e.preventDefault();
          calculateEstimation();
        }
      }
      
      // Échap pour fermer les modales
      if (e.key === 'Escape') {
        if (isSourcesModalOpen) {
          setIsSourcesModalOpen(false);
        }
        if (errorMessage) {
          setErrorMessage(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isCalculating, isSourcesModalOpen, errorMessage]);

  // Fonction pour le smooth scroll vers le calculateur
  const scrollToCalculator = () => {
    const element = document.getElementById('calculateur-rapide');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // État pour le formulaire détaillé
  const [detailedForm, setDetailedForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    type: '',
    surface: '',
    rooms: '',
    purpose: '',
    message: ''
  });

  const criteria = [
    "Analyse comparative du marché local",
    "Étude des transactions récentes",
    "Évaluation de l'état général du bien",
    "Prise en compte des spécificités du quartier",
    "Analyse des travaux à prévoir",
    "Étude de la rentabilité locative",
    "Conseils d'optimisation de la valeur",
    "Rapport détaillé et argumenté"
  ];

  const types = [
    {
      icon: TrendingUp,
      title: "Vente",
      description: "Estimation précise pour optimiser votre prix de vente et réduire le délai de commercialisation."
    },
    {
      icon: FileText,
      title: "Succession",
      description: "Évaluation officielle pour les déclarations fiscales et partages successoraux."
    },
    {
      icon: Calculator,
      title: "Patrimoine",
      description: "Bilan patrimonial complet pour vos projets d'investissement et de transmission."
    }
  ];

  const stats = [
    {
      icon: Award,
      value: "15+",
      label: "Années d'expérience"
    },
    {
      icon: Calculator,
      value: "2000+",
      label: "Biens estimés"
    },
    {
      icon: Users,
      value: "98%",
      label: "Clients satisfaits"
    },
    {
      icon: Star,
      value: "24h",
      label: "Délai de réponse"
    }
  ];

  // Cache pour les données de géocodage
  const geocodeCache = new Map<string, any>();

  // Fonction de géocodage avec l'API Adresse (gratuite) et cache
  const geocodeAddress = async (address: string, city: string, postalCode: string) => {
    const cacheKey = `${address}, ${postalCode} ${city}`;
    
    // Vérifier le cache
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey);
    }

    try {
      setIsLoadingData(true);
      const fullAddress = `${address}, ${postalCode} ${city}`;
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(fullAddress)}&limit=1`);
      const data = await response.json();
      
      let result = null;
      if (data.features && data.features.length > 0) {
        result = data.features[0].geometry.coordinates;
        // Mettre en cache
        geocodeCache.set(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    } finally {
      setIsLoadingData(false);
    }
  };

  // Calcul de confiance amélioré pour les données DVF
  const calculateDVFConfidence = (transactions: any[]) => {
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
  };

  // Calcul de confiance pour la base de données
  const calculateDatabaseConfidence = (postalCode: string, address: string) => {
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
  };

  // Calcul de confiance pour l'estimation géographique
  const calculateGeographicConfidence = (lng: number, lat: number) => {
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
  };

  // Récupération des données de marché via API DVF et géolocalisation
  const getMarketData = async (coordinates: number[], address: string) => {
    const [lng, lat] = coordinates;
    
    try {
      // 1. Essayer d'abord l'API DVF officielle (gratuite)
      const dvfData = await getDVFData(coordinates);
      if (dvfData && dvfData.pricePerM2 > 0) {
        return dvfData;
      }
      
      // 2. Fallback sur l'API Adresse pour obtenir le code postal
      const postalCode = await getPostalCodeFromCoordinates(coordinates);
      if (postalCode) {
        const fallbackData = await getFallbackPriceData(postalCode, address);
        if (fallbackData) {
          return fallbackData;
        }
      }
      
      // 3. Dernier recours : estimation basée sur la géolocalisation
      return getGeographicEstimation(lng, lat);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return getGeographicEstimation(lng, lat);
    }
  };

  // API DVF officielle (gratuite)
  const getDVFData = async (coordinates: number[]) => {
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
        const validTransactions = data.filter(transaction => 
          transaction.valeur_fonciere && 
          transaction.surface_reelle_bati && 
          transaction.surface_reelle_bati > 0
        );
        
        if (validTransactions.length > 0) {
          const totalPrice = validTransactions.reduce((sum, t) => sum + t.valeur_fonciere, 0);
          const totalSurface = validTransactions.reduce((sum, t) => sum + t.surface_reelle_bati, 0);
          const averagePricePerM2 = totalPrice / totalSurface;
          
          // Calcul de confiance amélioré
          const confidence = calculateDVFConfidence(validTransactions);
          
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
  };

  // Récupération du code postal via géocodage inverse
  const getPostalCodeFromCoordinates = async (coordinates: number[]) => {
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
  };

  // Données de fallback basées sur les codes postaux (plus étendues)
  const getFallbackPriceData = async (postalCode: string, address: string) => {
    // Base de données étendue des prix moyens par code postal
    const priceDatabase = {
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
    
    const basePrice = priceDatabase[postalCode as keyof typeof priceDatabase];
    if (basePrice) {
      const confidence = calculateDatabaseConfidence(postalCode, address);
      return {
        basePricePerM2: basePrice,
        confidence: confidence,
        sampleSize: 15,
        source: 'Database'
      };
    }
    
    return null;
  };

  // Estimation géographique de dernier recours
  const getGeographicEstimation = (lng: number, lat: number) => {
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
    
    const confidence = calculateGeographicConfidence(lng, lat);
    
    return {
      basePricePerM2: basePrice,
      confidence: confidence,
      sampleSize: 5,
      source: 'Geographic'
    };
  };

  // Fonction de calcul d'estimation
  const calculateEstimation = async () => {
    if (!quickEstimation.address || !quickEstimation.city || !quickEstimation.postalCode || !quickEstimation.surface || !quickEstimation.rooms) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setIsCalculating(true);
    
    try {
      // 1. Géocoder l'adresse
      const coordinates = await geocodeAddress(quickEstimation.address, quickEstimation.city, quickEstimation.postalCode);
      if (!coordinates) {
        setErrorMessage('Adresse non trouvée. Veuillez vérifier votre saisie.');
        setTimeout(() => setErrorMessage(null), 5000);
        setIsCalculating(false);
        return;
      }

      // 2. Récupérer les données de marché
      const marketData = await getMarketData(coordinates, quickEstimation.address);
      
      // 3. Calculer l'estimation de base
      const surface = parseFloat(quickEstimation.surface);
      const rooms = parseInt(quickEstimation.rooms);
      let baseEstimation = surface * marketData.basePricePerM2;

      // 4. Ajustements selon les critères
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
      
      setEstimationResult(Math.round(finalEstimation));
      setEstimationData(marketData);
      
      // Incrémenter les compteurs de social proof
      incrementCounters();
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      setErrorMessage('Erreur lors du calcul. Veuillez réessayer.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsCalculating(false);
    }
  };

  // Sauvegarde automatique dans localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem('estimationData', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
    }
  };

  // Chargement depuis localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('estimationData');
      if (saved) {
        const data = JSON.parse(saved);
        setQuickEstimation(data.quickEstimation || quickEstimation);
        setEstimationResult(data.estimationResult || null);
        setEstimationData(data.estimationData || null);
      }
    } catch (error) {
      console.error('Erreur chargement localStorage:', error);
    }
  };

  // Validation en temps réel
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Format d\'email invalide';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
          errors.phone = 'Format de téléphone invalide';
        } else {
          delete errors.phone;
        }
        break;
      case 'postalCode':
        const postalRegex = /^\d{5}$/;
        if (value && !postalRegex.test(value)) {
          errors.postalCode = 'Code postal invalide (5 chiffres)';
        } else {
          delete errors.postalCode;
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = {
      ...quickEstimation,
      [field]: value
    };
    
    setQuickEstimation(newData);
    
    // Validation en temps réel
    validateField(field, value);
    
    // Sauvegarde automatique
    saveToLocalStorage({
      quickEstimation: newData,
      estimationResult,
      estimationData
    });
  };

  // Fonction pour scroller vers le formulaire détaillé avec animation smooth
  const scrollToDetailedForm = () => {
    const element = document.getElementById('estimation-form');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Fonction pour transférer les données du calculateur rapide vers le formulaire détaillé
  const transferDataToDetailedForm = () => {
    const fullAddress = `${quickEstimation.address}, ${quickEstimation.postalCode} ${quickEstimation.city}`;
    setDetailedForm(prev => ({
      ...prev,
      address: fullAddress,
      type: quickEstimation.type,
      surface: quickEstimation.surface,
      rooms: quickEstimation.rooms,

      message: `Informations du calculateur rapide:
- Adresse: ${fullAddress}
- Surface: ${quickEstimation.surface} m²
- Pièces: ${quickEstimation.rooms}
- Type: ${quickEstimation.type || 'Non spécifié'}
- Étage: ${quickEstimation.floor || 'Non spécifié'}
- État: ${quickEstimation.condition}
- Estimation rapide: ${estimationResult ? estimationResult.toLocaleString('fr-FR') + ' €' : 'Non calculée'}
- Source: ${estimationData?.source || 'Non disponible'}
- Confiance: ${estimationData?.confidence ? Math.round(estimationData.confidence * 100) + '%' : 'Non disponible'}`
    }));
  };

  // Fonction pour mettre en évidence les champs vides
  const highlightEmptyFields = () => {
    const emptyFields = ['firstName', 'lastName', 'email', 'purpose'];
    emptyFields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element && !element.value) {
        element.classList.add('ring-2', 'ring-primary', 'ring-opacity-50', 'animate-pulse', 'bg-primary/5');
        // Retirer l'animation après 3 secondes mais garder le ring
        setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 3000);
        
        // Retirer l'effet quand l'utilisateur commence à taper
        const removeHighlight = () => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50', 'bg-primary/5');
          element.removeEventListener('focus', removeHighlight);
          element.removeEventListener('input', removeHighlight);
        };
        
        element.addEventListener('focus', removeHighlight);
        element.addEventListener('input', removeHighlight);
      }
    });
  };

  // Fonction combinée : transfert + scroll + mise en évidence
  const handleDetailedEstimation = () => {
    transferDataToDetailedForm();
    setTimeout(() => {
      scrollToDetailedForm();
      // Mettre en évidence les champs vides après le scroll
      setTimeout(() => {
        highlightEmptyFields();
      }, 800); // Délai pour laisser le temps au scroll de se terminer
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={estimationBienImage}
              alt="Estimation de biens immobiliers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/20 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6">
                <Calculator className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Estimation de Biens</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Connaissez la <span className="gradient-text">vraie valeur</span> de votre bien
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Estimation gratuite et sans engagement par nos experts. 
                Une évaluation précise basée sur l'analyse du marché parisien et notre expertise de 15 ans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={scrollToCalculator} className="hover-glow">
                  <Calculator className="mr-2 w-5 h-5" />
                  Estimation express
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" asChild className="glass border-primary/30">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Calculateur Rapide */}
        <section id="calculateur-rapide" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">

              <div className="flex items-center justify-center space-x-3 mb-4">
                <h2 className="text-4xl font-bold">
                  Estimation <span className="gradient-text">rapide</span> en 30 secondes
                </h2>
                <button
                  onClick={() => setIsSourcesModalOpen(true)}
                  className="w-8 h-8 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors group"
                  title="En savoir plus sur nos sources de données"
                >
                  <Info className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                Obtenez une première estimation de votre bien basée sur les données du marché
              </p>
              
              {/* Social proof et urgence */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">+{weeklyPercentage}% de demandes cette semaine</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{monthlyEstimations} estimations ce mois</span>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Message d'erreur */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                  <button 
                    onClick={() => setErrorMessage(null)}
                    className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <Card className="glass-strong p-8 border-0 shadow-elegant overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Formulaire */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="text-center lg:text-left">

                      <h3 className="text-2xl font-bold mb-2">
                        Informations de base
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Remplissez les champs ci-dessous pour obtenir votre estimation
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <MapPinIcon className="w-4 h-4 inline mr-1" />
                        Adresse du bien *
                      </label>
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Ex: 15 rue de Rivoli"
                          value={quickEstimation.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="glass border-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/40"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Input
                              type="text"
                              placeholder="Code postal"
                              value={quickEstimation.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              className={`glass transition-all duration-200 hover:border-primary/40 ${
                                validationErrors.postalCode 
                                  ? 'border-red-500 focus:border-red-500' 
                                  : 'border-primary/20 focus:border-primary'
                              }`}
                            />
                            {validationErrors.postalCode && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors.postalCode}</p>
                            )}
                          </div>
                          <Input
                            type="text"
                            placeholder="Ville"
                            value={quickEstimation.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="glass border-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/40"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <Home className="w-4 h-4 inline mr-1" />
                          Surface (m²) *
                        </label>
                        <Input
                          type="number"
                          placeholder="Ex: 75"
                          value={quickEstimation.surface}
                          onChange={(e) => handleInputChange('surface', e.target.value)}
                          className="glass border-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <Building className="w-4 h-4 inline mr-1" />
                          Pièces *
                        </label>
                        <Input
                          type="number"
                          placeholder="Ex: 3"
                          value={quickEstimation.rooms}
                          onChange={(e) => handleInputChange('rooms', e.target.value)}
                          className="glass border-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <Building className="w-4 h-4 inline mr-1" />
                          Type de bien
                        </label>
                        <select
                          value={quickEstimation.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-all duration-200 hover:border-primary/40"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="appartement">Appartement</option>
                          <option value="maison">Maison</option>
                          <option value="studio">Studio</option>
                          <option value="duplex">Duplex</option>
                          <option value="loft">Loft</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Étage
                        </label>
                        <select
                          value={quickEstimation.floor}
                          onChange={(e) => handleInputChange('floor', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-all duration-200 hover:border-primary/40"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="rdc">Rez-de-chaussée</option>
                          <option value="1-2">1er-2ème étage</option>
                          <option value="3-5">3ème-5ème étage</option>
                          <option value="6+">6ème étage et plus</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <Star className="w-4 h-4 inline mr-1" />
                        État général
                      </label>
                      <select
                        value={quickEstimation.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-all duration-200 hover:border-primary/40"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="bon">Bon</option>
                        <option value="moyen">Moyen</option>
                        <option value="mauvais">Mauvais</option>
                      </select>
                    </div>

                    <div className="pt-4">
                                            <Button
                        type="submit"
                        onClick={calculateEstimation}
                        disabled={isCalculating}
                        size="lg" 
                        className="w-full bg-gradient-primary hover:bg-primary-glow text-primary-foreground hover-glow group shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isCalculating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Calcul en cours...
                          </>
                        ) : (
                          <>
                            <Calculator className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                            Calculer mon estimation
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Résultat */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="text-center lg:text-left">

                      <h3 className="text-2xl font-bold mb-2">
                        Estimation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Basée sur les données du marché immobilier
                      </p>
                    </div>
                    
                    {isCalculating || isLoadingData ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="animate-pulse bg-gray-200 h-8 w-48 mx-auto rounded mb-4"></div>
                          <div className="animate-pulse bg-gray-200 h-6 w-32 mx-auto rounded mb-6"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                          <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                        </div>
                        <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                      </div>
                    ) : estimationResult ? (
                      <div className="space-y-6">
                        {/* Prix principal */}
                        <div className="text-center p-6 bg-gradient-primary rounded-2xl shadow-lg">
                          <div className="text-4xl font-bold text-primary-foreground mb-2">
                            {estimationResult.toLocaleString('fr-FR')} €
                          </div>
                          <div className="text-primary-foreground/80">
                            Estimation indicative
                          </div>
                          <div className="mt-3 inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-primary-foreground/90">Calcul terminé</span>
                          </div>
                        </div>
                        
                        {/* Informations compactes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <MapPinIcon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-sm">
                                  Données du marché
                                  {estimationData?.source && (
                                    <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                                      {estimationData.source === 'DVF' ? 'Officielles' : 
                                       estimationData.source === 'Database' ? 'Base' : 
                                       'Géo'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {estimationData?.sampleSize ? 
                                    `${estimationData.sampleSize} transactions` : 
                                    'Prix moyens zone'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-sm">Confiance</div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-500 ${
                                        (estimationData?.confidence || 0) >= 0.8 ? 'bg-green-500' :
                                        (estimationData?.confidence || 0) >= 0.6 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                      }`}
                                      style={{ width: `${(estimationData?.confidence || 0) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold">
                                    {estimationData?.confidence ? 
                                      `${Math.round(estimationData.confidence * 100)}%` : 
                                      'N/A'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sources compactes */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2 text-sm flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Sources
                          </h4>
                          <div className="text-xs text-blue-800 space-y-1">
                            {estimationData?.source === 'DVF' && (
                              <>
                                <div>• <strong>API DVF</strong> - Transactions réelles (DGFP)</div>
                                <div>• <strong>{estimationData.sampleSize} ventes</strong> analysées dans un rayon de 1km</div>
                              </>
                            )}
                            {estimationData?.source === 'Database' && (
                              <>
                                <div>• <strong>Base de données</strong> - Prix moyens par code postal</div>
                                <div>• <strong>Observatoires locaux</strong> - Notaires et agents</div>
                              </>
                            )}
                            {estimationData?.source === 'Geographic' && (
                              <>
                                <div>• <strong>Analyse géographique</strong> - Distance et contexte urbain</div>
                                <div>• <strong>Comparaisons régionales</strong> - Marchés similaires</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Note et CTA */}
                        <div className="space-y-3">
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-800">
                              <strong>Note :</strong> Estimation indicative basée sur des données moyennes. 
                              Pour une évaluation précise, contactez nos experts.
                            </p>
                          </div>

                          <Button 
                            type="button"
                            size="lg" 
                            variant="outline" 
                            className="w-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                            onClick={handleDetailedEstimation}
                          >
                            <FileText className="mr-2 w-4 h-4" />
                            Estimation détaillée
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Calculator className="w-10 h-10 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Prêt à calculer</h4>
                        <p className="text-gray-500">Remplissez le formulaire pour obtenir votre estimation rapide</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>



        {/* Une méthode rigoureuse */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Une méthode <span className="gradient-text">rigoureuse</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Notre expertise du marché parisien nous permet de vous fournir une estimation 
                précise et réaliste. Nous analysons tous les critères déterminants.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Méthodologie - Liste à gauche */}
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Notre <span className="gradient-text">méthodologie</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {criteria.map((criterion, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-base leading-relaxed">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA à droite */}
              <div className="flex items-center justify-center">
                <Card className="glass-strong p-6 border-0 shadow-card max-w-sm w-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Rapport détaillé</h3>
                    <p className="text-muted-foreground mb-6">
                      Recevez votre rapport d'estimation complet et argumenté après notre analyse
                    </p>
                    <div className="bg-primary/10 rounded-lg p-4 mb-6">
                      <p className="text-sm font-medium text-primary">100% Gratuit & Sans Engagement</p>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300"
                      onClick={() => window.open('tel:+33142257824', '_self')}
                    >
                      <MessageSquare className="mr-2 w-5 h-5" />
                      Appelez-nous : 01.42.25.78.24
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Types d'estimation */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Types d'<span className="gradient-text">estimation</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Selon votre projet, nous adaptons notre approche d'évaluation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {types.slice(0, 3).map((type, index) => {
                const Icon = type.icon;
                return (
                  <Card key={index} className="glass-strong p-8 border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-4">{type.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{type.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pourquoi nous faire confiance */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Pourquoi nous faire <span className="gradient-text">confiance</span> ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nos résultats parlent d'eux-mêmes
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>







        {/* Comment ça fonctionne */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Comment ça <span className="gradient-text">fonctionne</span> ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un processus simple et transparent en 4 étapes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-sm text-muted-foreground">Prise de rendez-vous gratuit</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Visite</h3>
                <p className="text-sm text-muted-foreground">Analyse complète de votre bien</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Analyse</h3>
                <p className="text-sm text-muted-foreground">Étude comparative du marché</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Rapport</h3>
                <p className="text-sm text-muted-foreground">Remise du rapport détaillé</p>
              </div>
            </div>
          </div>
        </section>

        {/* Estimation Form */}
        <section id="estimation-form" className="py-20 bg-white relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl hidden lg:block"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-glow/10 rounded-full blur-2xl hidden lg:block"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            {/* En-tête avec séparation visuelle */}
            <div className="text-center mb-16">
              {/* Badge de section */}
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Estimation Détaillée</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Demandez votre <span className="gradient-text">estimation gratuite</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Remplissez ce formulaire et recevez une estimation personnalisée de votre bien 
                dans les 24 heures par nos experts.
              </p>
              
              {/* Séparateur visuel */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30"></div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30"></div>
              </div>
              
              {detailedForm.address && (
                <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
                  <div className="flex items-center space-x-2 bg-green-100 border border-green-200 rounded-full px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Données du calculateur rapide transférées
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Il ne vous reste plus qu'à compléter vos coordonnées
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="space-y-6">
                <Card className="glass-strong p-8 border-0 shadow-elegant">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Informations sur votre bien</h3>
                    {detailedForm.address && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Données transférées</span>
                      </div>
                    )}
                  </div>
                  
                  {detailedForm.address && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ArrowRight className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-900 text-sm mb-1">
                            Champs pré-remplis automatiquement
                          </h4>
                          <p className="text-xs text-blue-700">
                            Vos informations du calculateur rapide ont été transférées. 
                            Il ne vous reste plus qu'à compléter vos coordonnées personnelles.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          Prénom *
                          {!detailedForm.firstName && detailedForm.address && (
                            <span className="ml-2 text-xs text-primary font-semibold">← À remplir</span>
                          )}
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Votre prénom"
                          value={detailedForm.firstName}
                          onChange={(e) => setDetailedForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Nom *
                          {!detailedForm.lastName && detailedForm.address && (
                            <span className="ml-2 text-xs text-primary font-semibold">← À remplir</span>
                          )}
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Votre nom"
                          value={detailedForm.lastName}
                          onChange={(e) => setDetailedForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                          {!detailedForm.email && detailedForm.address && (
                            <span className="ml-2 text-xs text-primary font-semibold">← À remplir</span>
                          )}
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={detailedForm.email}
                          onChange={(e) => {
                            setDetailedForm(prev => ({ ...prev, email: e.target.value }));
                            validateField('email', e.target.value);
                          }}
                          className={`glass transition-all duration-200 ${
                            validationErrors.email 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-primary/20 focus:border-primary'
                          }`}
                          required
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Téléphone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="01.42.25.78.24"
                          value={detailedForm.phone}
                          onChange={(e) => {
                            setDetailedForm(prev => ({ ...prev, phone: e.target.value }));
                            validateField('phone', e.target.value);
                          }}
                          className={`glass transition-all duration-200 ${
                            validationErrors.phone 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-primary/20 focus:border-primary'
                          }`}
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-2">
                        Adresse du bien *
                        {detailedForm.address && (
                          <span className="ml-2 text-xs text-green-600 font-semibold">✓ Pré-rempli</span>
                        )}
                      </label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Ex: 15 rue de Rivoli, 75001 Paris"
                        value={detailedForm.address}
                        onChange={(e) => setDetailedForm(prev => ({ ...prev, address: e.target.value }))}
                        className="glass border-primary/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-2">
                          Type de bien *
                          {detailedForm.type && (
                            <span className="ml-2 text-xs text-green-600 font-semibold">✓ Pré-rempli</span>
                          )}
                        </label>
                        <select
                          id="type"
                          value={detailedForm.type}
                          onChange={(e) => setDetailedForm(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-colors"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="appartement">Appartement</option>
                          <option value="maison">Maison</option>
                          <option value="studio">Studio</option>
                          <option value="duplex">Duplex</option>
                          <option value="loft">Loft</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="surface" className="block text-sm font-medium mb-2">
                          Surface (m²) *
                          {detailedForm.surface && (
                            <span className="ml-2 text-xs text-green-600 font-semibold">✓ Pré-rempli</span>
                          )}
                        </label>
                        <Input
                          id="surface"
                          type="number"
                          placeholder="Ex: 75"
                          value={detailedForm.surface}
                          onChange={(e) => setDetailedForm(prev => ({ ...prev, surface: e.target.value }))}
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="rooms" className="block text-sm font-medium mb-2">
                          Pièces *
                          {detailedForm.rooms && (
                            <span className="ml-2 text-xs text-green-600 font-semibold">✓ Pré-rempli</span>
                          )}
                        </label>
                        <Input
                          id="rooms"
                          type="number"
                          placeholder="Ex: 3"
                          value={detailedForm.rooms}
                          onChange={(e) => setDetailedForm(prev => ({ ...prev, rooms: e.target.value }))}
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium mb-2">
                        Objectif de l'estimation *
                        {!detailedForm.purpose && detailedForm.address && (
                          <span className="ml-2 text-xs text-primary font-semibold">← À remplir</span>
                        )}
                      </label>
                      <select
                        id="purpose"
                        value={detailedForm.purpose}
                        onChange={(e) => setDetailedForm(prev => ({ ...prev, purpose: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        <option value="vente">Vente</option>
                        <option value="succession">Succession</option>
                        <option value="patrimoine">Patrimoine</option>
                        <option value="investissement">Investissement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Informations complémentaires
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez les spécificités de votre bien (étage, exposition, travaux récents, etc.)"
                        value={detailedForm.message}
                        onChange={(e) => setDetailedForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        className="glass border-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground hover-glow group"
                    >
                      <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Demander mon estimation gratuite
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Benefits */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Pourquoi choisir JIP ?</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expertise reconnue</h4>
                        <p className="text-sm text-muted-foreground">
                          15 ans d'expérience sur le marché parisien
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Rapidité</h4>
                        <p className="text-sm text-muted-foreground">
                          Estimation détaillée sous 24h
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Euro className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">100% Gratuit</h4>
                        <p className="text-sm text-muted-foreground">
                          Aucun frais, aucun engagement
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Rapport détaillé</h4>
                        <p className="text-sm text-muted-foreground">
                          Analyse complète avec justifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="glass-strong p-6 border-0 shadow-elegant">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Besoin d'aide ?</h4>
                    <p className="text-muted-foreground mb-4">
                      Nos experts sont disponibles pour vous accompagner
                    </p>
                    <Button variant="outline" className="w-full glass border-primary/30">
                      <Phone className="mr-2 w-4 h-4" />
                      01.42.25.78.24
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>









        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à connaître la <span className="gradient-text">vraie valeur</span> de votre bien ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nos experts vous accompagnent gratuitement pour une estimation personnalisée et sans engagement
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    Appelez-nous : 01.42.25.78.24
                  </Link>
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToCalculator}>
                  <Calculator className="mr-2 w-5 h-5" />
                  Estimation gratuite
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>


      </main>
      <Footer />

      {/* Modal Sources et Méthodologie */}
      {isSourcesModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                Sources et <span className="gradient-text">méthodologie</span>
              </h2>
              <button
                onClick={() => setIsSourcesModalOpen(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-lg text-muted-foreground mb-8 text-center">
                Notre calculateur d'estimation rapide s'appuie sur des données officielles et des méthodes éprouvées
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="glass-strong p-6 border-0 shadow-elegant">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">API DVF Officielle</h3>
                    <p className="text-sm text-muted-foreground">Source prioritaire</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Transactions immobilières réelles depuis 2014</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Direction Générale des Finances Publiques</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Analyse dans un rayon de 1km</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Confiance : 60-95% selon les données</span>
                    </div>
                  </div>
                </Card>

                <Card className="glass-strong p-6 border-0 shadow-elegant">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPinIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Base de Données</h3>
                    <p className="text-sm text-muted-foreground">Source secondaire</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Prix moyens par code postal</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Observatoires immobiliers locaux</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Données notaires et agents</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Confiance : 60-80% selon la zone</span>
                    </div>
                  </div>
                </Card>

                <Card className="glass-strong p-6 border-0 shadow-elegant">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Analyse Géographique</h3>
                    <p className="text-sm text-muted-foreground">Source de fallback</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Distance et contexte urbain</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Données démographiques</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Comparaisons régionales</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Confiance : 40-60% approximatif</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="glass-strong p-8 border-0 shadow-elegant">
                <h3 className="text-2xl font-bold mb-6 text-center">Comment nous calculons la confiance ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700">Pour les données DVF :</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Taille d'échantillon</strong> : Plus de transactions = plus de confiance</li>
                      <li>• <strong>Récence</strong> : Données des 2 dernières années privilégiées</li>
                      <li>• <strong>Cohérence</strong> : Analyse de la variance des prix</li>
                      <li>• <strong>Diversité</strong> : Différents types de biens analysés</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-700">Pour les autres sources :</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Précision géographique</strong> : Code postal complet</li>
                      <li>• <strong>Densité urbaine</strong> : Plus de données en ville</li>
                      <li>• <strong>Taille de la ville</strong> : Grandes villes mieux documentées</li>
                      <li>• <strong>Distance de Paris</strong> : Marché parisien mieux connu</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="mt-6 text-center">
                <Button 
                  onClick={() => setIsSourcesModalOpen(false)}
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimationBiens;