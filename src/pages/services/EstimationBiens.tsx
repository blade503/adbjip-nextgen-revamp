import { lazy, Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Phone, TrendingUp, FileText, Send, Building, Zap, Info, X, Calculator, Award, Users, Star } from 'lucide-react';
/**
 * TROIS LARGEURS POUR LE BANDEAU D'OUVERTURE.
 *
 * Mesuré avant : le seul fichier servi était le 1536 px, soit 141,4 Ko — envoyé
 * tel quel à un téléphone de 390 px de large, qui n'en affiche jamais plus de
 * 1170 px physiques et souvent 780. Les trois variantes sont produites depuis le
 * master PNG de `src/assets/`, qui reste en place et n'est jamais livré.
 *
 * `sizes="100vw"` est exact ici : le bandeau occupe toute la largeur de la fenêtre
 * à toutes les tailles. L'annoncer permet au navigateur de choisir AVANT de
 * connaître la mise en page, donc avant le premier rendu.
 */
import estimationBienImage from '@/assets/EstimationBien-large.webp';
import estimationBienImage1024 from '@/assets/EstimationBien-1024.webp';
import estimationBienImage700 from '@/assets/EstimationBien.webp';
const estimationBienImageSet = `${estimationBienImage700} 700w, ${estimationBienImage1024} 1024w, ${estimationBienImage} 1536w`;
import MarketDataService from '@/components/estimation/MarketDataService';
import EstimationStats from '@/components/estimation/EstimationStats';
import SEOHead from '@/components/SEOHead';
import { envoyerFormulaire } from '@/lib/forms';
import type { DemandeFormulaire, ResultatEnvoi } from '@/lib/forms';
import {
  Champ,
  Leurre,
  Liste,
  MentionRgpd,
  Rangee,
  Retour,
  ZoneTexte,
} from '@/components/formulaire';
import SEOOptimizedImage from '@/components/SEOOptimizedImage';
import { Lien } from '@/components/systeme/Lien';

/**
 * LES DEUX PLUS GROS MORCEAUX DE LA PAGE, DIFFÉRÉS.
 *
 * Relevé avant découpage : `QuickCalculator` pèse 32,9 Ko et `InteractiveMap`
 * 8,0 Ko — le premier est le plus gros fichier de tout `src/`, plus lourd que
 * n'importe quelle page.
 *
 * Le calculateur est sous le pli : rien ne justifie de le télécharger avant que
 * le visiteur ait lu l'ouverture. La carte, elle, est une boîte de dialogue :
 * elle ne se monte QUE si on l'ouvre, donc son morceau n'est demandé qu'au clic.
 * C'est le seul cas ici où le découpage évite un téléchargement au lieu de le
 * repousser.
 *
 * `MarketDataService` reste en import statique : c'est un singleton appelé
 * pendant le calcul, pas un composant. Il part dans le morceau de la page.
 */
const QuickCalculator = lazy(() => import('@/components/estimation/QuickCalculator'));
const InteractiveMap = lazy(() => import('@/components/estimation/InteractiveMap'));

/** Réserve la hauteur d'un bloc différé : l'arrivée du morceau ne décale rien. */
const Reserve = ({ hauteur }: { hauteur: string }) => (
  <div role="status" className={`flex items-center justify-center ${hauteur}`}>
    <span aria-hidden className="attente block h-5 w-5 rounded-full border-b-2 border-primary" />
    <span className="sr-only">Chargement…</span>
  </div>
);

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
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [retourFormulaire, setRetourFormulaire] = useState<ResultatEnvoi | null>(
    null,
  );
  // Chargement des données sauvegardées au montage
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

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
    message: '',
    /** Champ leurre anti-robot : il manquait ici, seul le contact en avait un. */
    website: '',
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
        
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      setErrorMessage('Une erreur est survenue lors du calcul. Veuillez réessayer.');
    } finally {
      setIsCalculating(false);
    }
  }, [quickEstimation, marketDataService, getTypeMultiplier, getConditionMultiplier, getFloorMultiplier, getSurfaceMultiplier, getRoomsMultiplier]);

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

  /**
   * La demande, construite à part : le repli `mailto` de `<Retour>` la relit
   * pour préremplir le client mail. Ce formulaire n'avait aucun repli — si le
   * serveur ne répondait pas, la demande d'estimation était simplement perdue.
   */
  const demandeEstimation = (): DemandeFormulaire => ({
    type: 'estimation',
    nom: `${detailedForm.firstName} ${detailedForm.lastName}`.trim(),
    email: detailedForm.email,
    telephone: detailedForm.phone,
    service: 'estimation',
    message: detailedForm.message,
    website: detailedForm.website,
    details: {
      'Adresse du bien': detailedForm.address,
      'Type de bien': detailedForm.type,
      'Surface': detailedForm.surface ? `${detailedForm.surface} m²` : '',
      'Pièces': detailedForm.rooms,
      'Objectif': detailedForm.purpose,
      // L'estimation en ligne, si le visiteur l'a lancée avant d'écrire.
      'Estimation en ligne': estimationResult
        ? `${estimationResult.toLocaleString('fr-FR')} €`
        : '',
    },
  });

  // La demande partait dans la console du navigateur : personne ne la recevait.
  const handleDetailedFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoiEnCours(true);
    setRetourFormulaire(null);

    const resultat = await envoyerFormulaire(demandeEstimation());

    setRetourFormulaire(resultat);
    setEnvoiEnCours(false);
    if (resultat.ok) {
      setDetailedForm({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', type: '', surface: '', rooms: '', purpose: '', message: '',
        website: '',
      });
    }
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
        title="Estimation immobilière gratuite à Paris et en Île-de-France | JIP"
        description="Estimation gratuite et précise de votre bien immobilier à Paris et en Île-de-France. Calculateur en ligne avec données DVF officielles. Expertise 15+ ans. Réponse sous 24h."
        keywords="estimation immobilière gratuite, évaluation bien immobilier, prix immobilier Paris, estimation appartement, estimation maison, calculateur estimation, données DVF, expertise immobilière Paris, JIP"
        canonicalUrl="https://www.adbjip.fr/services/estimation-biens"
        ogType="service"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Estimation de Biens Immobiliers Gratuite",
          "description": "Service d'estimation immobilière gratuite et professionnelle basé sur les données officielles du marché",
          "provider": {
            "@type": "RealEstateAgent",
            "name": "JIP",
            "url": "https://www.adbjip.fr",
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
          }
        }}
      />
      
      <Header />

      <main id="contenu" tabIndex={-1}>

      {/* Hero Section */}
      {/* `nuit` — INDISPENSABLE, et pas décoratif. Cette ouverture est sombre
        depuis toujours, mais elle n'avait aucune portée de jetons : le fond
        passait au marine tandis que `--foreground` restait l'encre. Résultat
        mesuré après l'inversion de la charte : le bouton « outline » du
        numéro s'affichait en encre sur marine, et les mots mis en accent par
        `gradient-text` en ocre foncé sur marine — deux textes illisibles.
        La classe rebascule tout le sous-arbre, et les composants suivent
        sans le savoir. Toute section sombre du site doit la porter. */}
      <section className="nuit bg-nuit pt-32 pb-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <SEOOptimizedImage 
            src={estimationBienImage}
            srcSet={estimationBienImageSet}
            sizes="100vw"
            /* Bandeau d'ouverture, purement atmosphérique : le h1 et la plaque
               disent déjà de quoi parle la page. L'alt portait la description SEO
               de la page, que le lecteur d'écran venait d'entendre dans le titre —
               du bruit. Les trois autres ouvertures de pages services sont déjà
               en alt="". */
            alt=""
            className="w-full h-full object-cover"
            width={1536}
            height={1024}
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-nuit/[0.90] via-nuit/[0.86] to-nuit/[0.92]"></div>
        </div>
        
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="plaque mb-6">Estimation de biens</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Connaissez la <span className="gradient-text-light">vraie valeur</span> de votre bien
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Estimation gratuite et sans engagement par nos experts. 
              Une évaluation appuyée sur les transactions réellement enregistrées dans le secteur, et sur notre connaissance du marché parisien depuis 2011.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('calculateur-rapide')?.scrollIntoView({ behavior: 'smooth' })}
                className="hover-glow"
              >
                <Calculator aria-hidden className="mr-2 w-5 h-5" />
                Estimation express
                <ArrowRight aria-hidden className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="glass border-primary/30"
              >
                <Lien to="/contact">
                  <Phone aria-hidden className="mr-2 w-5 h-5" />
                  01.42.25.78.24
                </Lien>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Calculateur Rapide — morceau différé, cf. le commentaire en tête. */}
      <Suspense fallback={<Reserve hauteur="min-h-[42rem]" />}>
      <QuickCalculator
        quickEstimation={quickEstimation}
        setQuickEstimation={setQuickEstimation}
        estimationResult={estimationResult}
        isCalculating={isCalculating}
        errorMessage={errorMessage}
        onCalculate={calculateEstimation}
        onShowMap={() => setIsMapOpen(true)}
      />
      </Suspense>

      {/* Carte interactive : montée SEULEMENT à l'ouverture, donc son morceau
          n'est jamais téléchargé par qui ne l'ouvre pas.

          Le composant rend un `<Dialog open={isOpen}>` de Radix, qui ne place
          rien dans le document tant qu'il est fermé — vérifié : aucun nœud de
          dialogue dans le HTML prérendu. Le monter conditionnellement est donc
          équivalent à l'état fermé, à une nuance près : l'animation de SORTIE
          disparaît, puisque le composant est démonté dès la fermeture. Sur une
          boîte de dialogue de consultation, c'est sans conséquence. */}
      {isMapOpen && (
        <Suspense fallback={<Reserve hauteur="min-h-[20rem]" />}>
          <InteractiveMap
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            address={quickEstimation.address}
            city={quickEstimation.city}
            postalCode={quickEstimation.postalCode}
            estimationResult={estimationResult}
            marketData={estimationData}
          />
        </Suspense>
      )}

      {/* Statistiques */}
      <EstimationStats />

      {/* Types d'estimation */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Nos types d'estimation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous adaptons notre expertise à vos besoins spécifiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {types.map((type, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <type.icon aria-hidden className="w-8 h-8 text-primary-ink" />
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
                Notre méthode d'évaluation
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Une approche rigoureuse et complète pour une estimation précise
              </p>
              
              <div className="space-y-4">
                {criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle aria-hidden className="w-6 h-6 text-primary-ink flex-shrink-0" />
                    <span className="text-lg">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8">
              <div className="mb-6">
                <Zap aria-hidden className="w-12 h-12 text-primary-ink mb-4" />
                <h3 className="text-2xl font-bold mb-2">Pourquoi nous choisir ?</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info aria-hidden className="w-5 h-5 text-primary-ink mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Données Officielles</h4>
                    <p className="text-sm text-muted-foreground">Accès aux bases DVF et données notariales</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info aria-hidden className="w-5 h-5 text-primary-ink mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Expertise Locale</h4>
                    <p className="text-sm text-muted-foreground">15+ années d'expérience sur l'Île-de-France</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info aria-hidden className="w-5 h-5 text-primary-ink mt-1 flex-shrink-0" />
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
              <h2 className="text-4xl font-bold mb-6">Demande d'estimation détaillée</h2>
              <p className="text-xl text-muted-foreground">
                Pour une évaluation complète et personnalisée de votre bien
              </p>
            </div>

            <Card className="p-8">
              {estimationResult && (
                <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Votre estimation rapide</h3>
                  <p className="text-2xl font-bold text-primary-ink mb-4">
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

              {/* Le balisage vient de `@/components/formulaire`, partagé avec le
                  formulaire de contact. Ce formulaire-ci en avait une copie
                  parallèle, restée en arrière : étiquettes à l'ancien style,
                  aucun champ leurre, aucune mention RGPD, aucun repli si le
                  serveur se tait, et pas d'`aria-describedby` sur les champs
                  que le serveur signale. */}
              <form onSubmit={handleDetailedFormSubmit} className="relative space-y-8" noValidate>
                <Rangee>
                  <Champ
                    prefixe="est" nom="prenom" etiquette="Prénom" requis
                    type="text" autoComplete="given-name"
                    enErreur={retourFormulaire?.champs}
                    value={detailedForm.firstName} onChange={(e) => setDetailedForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Champ
                    prefixe="est" nom="nom" etiquette="Nom" requis
                    type="text" autoComplete="family-name"
                    enErreur={retourFormulaire?.champs}
                    value={detailedForm.lastName} onChange={(e) => setDetailedForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                  <Champ
                    prefixe="est" nom="email" etiquette="Courriel" requis
                    type="email" autoComplete="email"
                    enErreur={retourFormulaire?.champs}
                    value={detailedForm.email} onChange={(e) => setDetailedForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  <Champ
                    prefixe="est" nom="telephone" etiquette="Téléphone"
                    type="tel" autoComplete="tel"
                    enErreur={retourFormulaire?.champs}
                    value={detailedForm.phone} onChange={(e) => setDetailedForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </Rangee>

                <Champ
                  prefixe="est" nom="adresse" etiquette="Adresse du bien" requis
                  type="text" autoComplete="street-address"
                  placeholder="27 rue de Lisbonne, 75008 Paris"
                  enErreur={retourFormulaire?.champs}
                  value={detailedForm.address} onChange={(e) => setDetailedForm((prev) => ({ ...prev, address: e.target.value }))}
                />

                <Rangee>
                  <Liste
                    prefixe="est" nom="type" etiquette="Type de bien"
                    options={[
                      ['', 'À préciser'],
                      ['appartement', 'Appartement'],
                      ['maison', 'Maison'],
                      ['studio', 'Studio'],
                      ['duplex', 'Duplex'],
                    ]}
                    value={detailedForm.type} onChange={(e) => setDetailedForm((prev) => ({ ...prev, type: e.target.value }))}
                  />
                  <Liste
                    prefixe="est" nom="objectif" etiquette="Objectif de l'estimation" requis
                    options={[
                      ['', 'À préciser'],
                      ['vente', 'Vente'],
                      ['succession', 'Succession'],
                      ['patrimoine', 'Bilan patrimonial'],
                      ['autre', 'Autre'],
                    ]}
                    value={detailedForm.purpose} onChange={(e) => setDetailedForm((prev) => ({ ...prev, purpose: e.target.value }))}
                  />
                  <Champ
                    prefixe="est" nom="surface" etiquette="Surface (m²)"
                    type="number" min={1} inputMode="numeric"
                    value={detailedForm.surface} onChange={(e) => setDetailedForm((prev) => ({ ...prev, surface: e.target.value }))}
                  />
                  <Champ
                    prefixe="est" nom="pieces" etiquette="Nombre de pièces"
                    type="number" min={1} inputMode="numeric"
                    value={detailedForm.rooms} onChange={(e) => setDetailedForm((prev) => ({ ...prev, rooms: e.target.value }))}
                  />
                </Rangee>

                <ZoneTexte
                  prefixe="est" nom="message" etiquette="Message complémentaire"
                  rows={4}
                  placeholder="Étage, état général, travaux récents, exposition — tout ce qui compte."
                  enErreur={retourFormulaire?.champs}
                  value={detailedForm.message} onChange={(e) => setDetailedForm((prev) => ({ ...prev, message: e.target.value }))}
                />

                <Leurre valeur={detailedForm.website} onChange={(e) => setDetailedForm((prev) => ({ ...prev, website: e.target.value }))} />

                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={envoiEnCours}>
                  {envoiEnCours ? 'Envoi en cours…' : "Demander l'estimation"}
                  <ArrowRight aria-hidden />
                </Button>

                <MentionRgpd />
                <Retour retour={retourFormulaire} demande={demandeEstimation()} />
              </form>
            </Card>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  );
};

export default EstimationBiens;
