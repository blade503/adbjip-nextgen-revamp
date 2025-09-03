import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Phone, TrendingUp, FileText, Send, Building, Zap, Info, X, Calculator, Award, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import estimationBienImage from '@/assets/EstimationBien.png';
import QuickCalculator from '@/components/estimation/QuickCalculator';
import InteractiveMap from '@/components/estimation/InteractiveMap';
import MarketDataService from '@/components/estimation/MarketDataService';
import EstimationStats from '@/components/estimation/EstimationStats';
import SEOHead from '@/components/SEOHead';
import SEOOptimizedImage from '@/components/SEOOptimizedImage';

const EstimationBiens = () => {
  // Service de données de marché optimisé
  const marketDataService = useMemo(() => MarketDataService.getInstance(), []);
  
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
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [weeklyDemands, setWeeklyDemands] = useState(23);
  const [monthlyEstimations, setMonthlyEstimations] = useState(127);
  const [weeklyPercentage, setWeeklyPercentage] = useState(23);

  // Fonction pour obtenir le numéro de semaine
  const getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
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
      const currentWeek = now.getFullYear() + '-' + getWeekNumber(now);
      
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

  // État formualaire détaillé
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

  // Facteurs d'ajustement optimisés
  const getTypeMultiplier = useCallback((type: string) => {
    const multipliers = {
      'appartement': 1.0,
      'maison': 1.1,
      'studio': 0.9,
      'duplex': 1.05,
    };
    return multipliers[type as keyof typeof multipliers] || 1.0;
  }, []);

  const getConditionMultiplier = useCallback((condition: string) => {
    const multipliers = {
      'excellent': 1.15,
      'tres-bon': 1.08,
      'bon': 1.0,
      'moyen': 0.92,
      'mauvais': 0.8,
    };
    return multipliers[condition as keyof typeof multipliers] || 1.0;
  }, []);

  const getFloorMultiplier = useCallback((floor: string) => {
    if (!floor) return 1.0;
    const floorNum = parseInt(floor);
    if (floorNum === 0) return 0.95;
    if (floorNum === 1) return 1.0;
    if (floorNum >= 2 && floorNum <= 4) return 1.02;
    if (floorNum >= 5) return 1.05;
    return 1.0;
  }, []);

  const getSurfaceMultiplier = useCallback((surface: number) => {
    if (surface < 30) return 1.1;
    if (surface > 100) return 0.95;
    return 1.0;
  }, []);

  const getRoomsMultiplier = useCallback((rooms: number, surface: number) => {
    const surfacePerRoom = surface / rooms;
    if (surfacePerRoom < 15) return 0.95;
    if (surfacePerRoom > 35) return 1.05;
    return 1.0;
  }, []);

  // Fonction de calcul d'estimation optimisée
  const calculateEstimation = useCallback(async () => {
    if (!quickEstimation.address || !quickEstimation.city || !quickEstimation.postalCode || !quickEstimation.surface || !quickEstimation.rooms) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    setIsCalculating(true);
    setErrorMessage(null);
    
    try {
      // 1. Géocoder l'adresse avec le service optimisé
      const coordinates = await marketDataService.geocodeAddress(
        quickEstimation.address,
        quickEstimation.city,
        quickEstimation.postalCode
      );
      
      if (!coordinates) {
        setErrorMessage('Adresse non trouvée. Veuillez vérifier votre saisie.');
        return;
      }

      // 2. Obtenir les données de marché
      const marketData = await marketDataService.getMarketData(coordinates, quickEstimation.address);
      
      if (!marketData) {
        setErrorMessage('Impossible d\'obtenir les données de marché pour cette zone.');
        return;
      }

      setEstimationData(marketData);

      // 3. Calculer l'estimation finale avec facteurs d'ajustement
      const surface = parseInt(quickEstimation.surface);
      const rooms = parseInt(quickEstimation.rooms);
      let adjustedPrice = marketData.basePricePerM2;

      // Facteurs d'ajustement
      const typeMultiplier = getTypeMultiplier(quickEstimation.type);
      const conditionMultiplier = getConditionMultiplier(quickEstimation.condition);
      const floorMultiplier = getFloorMultiplier(quickEstimation.floor);
      const surfaceMultiplier = getSurfaceMultiplier(surface);
      const roomsMultiplier = getRoomsMultiplier(rooms, surface);

      adjustedPrice *= typeMultiplier * conditionMultiplier * floorMultiplier * surfaceMultiplier * roomsMultiplier;

      const totalEstimation = Math.round(adjustedPrice * surface);
      setEstimationResult(totalEstimation);
      
      // Incrémenter les compteurs
      incrementCounters();
      
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      setErrorMessage('Une erreur est survenue lors du calcul. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  }, [quickEstimation, marketDataService, getTypeMultiplier, getConditionMultiplier, getFloorMultiplier, getSurfaceMultiplier, getRoomsMultiplier, incrementCounters]);

  // Chargement initial
  useEffect(() => {
    loadCounters();
  }, [loadCounters]);

  // Données pour les sections
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
      icon: Building,
      title: "Patrimoine",
      description: "Bilan patrimonial complet pour vos projets d'investissement et de transmission."
    }
  ];

  const handleDetailedFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis:', detailedForm);
    // Logique d'envoi du formulaire
  };

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
- Estimation rapide: ${estimationResult ? estimationResult.toLocaleString('fr-FR') + ' €' : 'Non calculée'}`
    }));
  };

  return (
    <>
      <SEOHead
        title="Estimation Immobilière Gratuite Paris & Île-de-France | ABDJIP"
        description="Estimation gratuite et précise de votre bien immobilier à Paris et en Île-de-France. Calculateur en ligne avec données DVF officielles. Expertise 15+ ans. Réponse sous 24h."
        keywords="estimation immobilière gratuite, évaluation bien immobilier, prix immobilier Paris, estimation appartement, estimation maison, calculateur estimation, données DVF, expertise immobilière Paris, ABDJIP"
        canonicalUrl="https://abdjip.fr/services/estimation-biens"
        ogImage="https://abdjip.fr/assets/EstimationBien.png"
        ogType="service"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Estimation de Biens Immobiliers Gratuite",
          "description": "Service d'estimation immobilière gratuite et professionnelle basé sur les données officielles du marché",
          "provider": {
            "@type": "RealEstateAgent",
            "name": "ABDJIP",
            "url": "https://abdjip.fr",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Paris",
              "addressRegion": "Île-de-France",
              "addressCountry": "FR"
            },
            "telephone": "+33142257824"
          },
          "serviceType": "Estimation Immobilière",
          "areaServed": {
            "@type": "Place",
            "name": "Île-de-France"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "Estimation gratuite et sans engagement"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Types d'estimation",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Estimation pour vente"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Estimation pour succession"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Bilan patrimonial"
                }
              }
            ]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
          }
        }}
      />
      
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <SEOOptimizedImage 
            src={estimationBienImage}
            alt="Estimation immobilière gratuite Paris et Île-de-France - Calculateur en ligne avec données DVF officielles"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
        </div>
        
        {/* Floating elements for visual appeal */}
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
              <Button 
                size="lg" 
                onClick={() => document.getElementById('calculateur-rapide')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover-glow"
              >
                <Calculator className="mr-2 w-5 h-5" />
                Estimation express
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="glass border-primary/30"
              >
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
      <QuickCalculator
        quickEstimation={quickEstimation}
        setQuickEstimation={setQuickEstimation}
        estimationResult={estimationResult}
        isCalculating={isCalculating}
        errorMessage={errorMessage}
        onCalculate={calculateEstimation}
        onShowMap={() => setIsMapOpen(true)}
      />

      {/* Carte Interactive */}
      <InteractiveMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        address={quickEstimation.address}
        city={quickEstimation.city}
        postalCode={quickEstimation.postalCode}
        estimationResult={estimationResult}
      />

      {/* Statistiques */}
      <EstimationStats
        weeklyDemands={weeklyDemands}
        monthlyEstimations={monthlyEstimations}
        weeklyPercentage={weeklyPercentage}
      />

      {/* Types d'estimation */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Nos Types d'Estimation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous adaptons notre expertise à vos besoins spécifiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {types.map((type, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <type.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{type.title}</h3>
                <p className="text-muted-foreground">{type.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Critères d'évaluation */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Notre Méthode d'Évaluation
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Une approche rigoureuse et complète pour une estimation précise
              </p>
              
              <div className="space-y-4">
                {criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8">
              <div className="mb-6">
                <Zap className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Pourquoi Nous Choisir ?</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Données Officielles</h4>
                    <p className="text-sm text-muted-foreground">Accès aux bases DVF et données notariales</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Expertise Locale</h4>
                    <p className="text-sm text-muted-foreground">15+ années d'expérience sur l'Île-de-France</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Rapidité</h4>
                    <p className="text-sm text-muted-foreground">Estimation en ligne immédiate</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Formulaire détaillé */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Demande d'Estimation Détaillée</h2>
              <p className="text-xl text-muted-foreground">
                Pour une évaluation complète et personnalisée de votre bien
              </p>
            </div>

            <Card className="p-8">
              {estimationResult && (
                <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Votre Estimation Rapide</h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {estimationResult.toLocaleString('fr-FR')} €
                  </p>
                  <Button
                    onClick={transferDataToDetailedForm}
                    variant="outline"
                    size="sm"
                  >
                    Utiliser ces données
                  </Button>
                </div>
              )}

              <form onSubmit={handleDetailedFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom *</label>
                    <Input
                      required
                      value={detailedForm.firstName}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom *</label>
                    <Input
                      required
                      value={detailedForm.lastName}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      required
                      value={detailedForm.email}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <Input
                      type="tel"
                      value={detailedForm.phone}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Adresse du bien *</label>
                  <Input
                    required
                    value={detailedForm.address}
                    onChange={(e) => setDetailedForm(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de bien</label>
                    <select
                      value={detailedForm.type}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="">Sélectionner</option>
                      <option value="appartement">Appartement</option>
                      <option value="maison">Maison</option>
                      <option value="studio">Studio</option>
                      <option value="duplex">Duplex</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Surface (m²)</label>
                    <Input
                      type="number"
                      value={detailedForm.surface}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, surface: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de pièces</label>
                    <Input
                      type="number"
                      value={detailedForm.rooms}
                      onChange={(e) => setDetailedForm(prev => ({ ...prev, rooms: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Objectif de l'estimation *</label>
                  <select
                    required
                    value={detailedForm.purpose}
                    onChange={(e) => setDetailedForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Sélectionner</option>
                    <option value="vente">Vente</option>
                    <option value="succession">Succession</option>
                    <option value="patrimoine">Bilan patrimonial</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message complémentaire</label>
                  <Textarea
                    rows={5}
                    value={detailedForm.message}
                    onChange={(e) => setDetailedForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Décrivez votre bien, vos attentes, ou toute information utile..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 w-5 h-5" />
                  Demander Mon Estimation Détaillée
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default EstimationBiens;
