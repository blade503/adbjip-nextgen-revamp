import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  FileText, 
  Home, 
  MapPin, 
  Building, 
  Star, 
  Info, 
  X,
  MapPin as MapPinIcon,
  Users
} from 'lucide-react';
import MarketDataService from './MarketDataService';

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
}

const QuickCalculator = ({
  quickEstimation,
  setQuickEstimation,
  estimationResult,
  isCalculating,
  errorMessage,
  onCalculate,
  onShowMap
}: QuickCalculatorProps) => {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Validation en temps réel
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (field) {
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
  };

  return (
    <section id="calculateur-rapide" className="py-16 bg-muted/40">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Obtenez une première estimation de votre bien basée sur les données du marché
          </p>
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
                onClick={() => {/* onClearError */}}
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
                  <label className="block text-sm font-semibold text-foreground mb-1">
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
                    <label className="block text-sm font-semibold text-foreground mb-1">
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
                    <label className="block text-sm font-semibold text-foreground mb-1">
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
                    <label className="block text-sm font-semibold text-foreground mb-1">
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
                    <label className="block text-sm font-semibold text-foreground mb-1">
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
                  <label className="block text-sm font-semibold text-foreground mb-1">
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
                    onClick={onCalculate}
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
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <span className="text-xs text-primary-foreground/90">Calcul terminé</span>
                      </div>
                    </div>
                    
                    {/* Informations compactes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-secondary to-indigo-50 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary-soft rounded-full flex items-center justify-center">
                            <MapPinIcon className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">
                              Données du marché
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Prix moyens zone
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-secondary to-emerald-50 rounded-lg border border-primary/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-soft rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-primary-ink" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">Confiance</div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-3/4"></div>
                              </div>
                              <span className="text-xs font-bold">75%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sources compactes */}
                    <div className="p-4 bg-secondary-soft border border-secondary/20 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2 text-sm flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Sources
                      </h4>
                      <div className="text-xs text-foreground space-y-1">
                        <div>• <strong>Base de données</strong> - Prix moyens par code postal</div>
                        <div>• <strong>Observatoires locaux</strong> - Notaires et agents</div>
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
                        onClick={onShowMap}
                      >
                        <MapPin className="mr-2 w-4 h-4" />
                        Voir sur la carte
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calculator className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Prêt à calculer</h4>
                    <p className="text-gray-500">Remplissez le formulaire pour obtenir votre estimation rapide</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Sources */}
      {isSourcesModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                Sources et <span className="gradient-text">méthodologie</span>
              </h2>
              <button
                onClick={() => setIsSourcesModalOpen(false)}
                className="w-8 h-8 bg-muted hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
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
                    <div className="w-16 h-16 bg-primary-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-primary-ink" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">API DVF Officielle</h3>
                    <p className="text-sm text-muted-foreground">Source prioritaire</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-primary-ink flex-shrink-0 mt-0.5">✓</div>
                      <span>Transactions immobilières réelles depuis 2014</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-primary-ink flex-shrink-0 mt-0.5">✓</div>
                      <span>Direction Générale des Finances Publiques</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-primary-ink flex-shrink-0 mt-0.5">✓</div>
                      <span>Analyse dans un rayon de 1km</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-primary-ink flex-shrink-0 mt-0.5">✓</div>
                      <span>Confiance : 60-95% selon les données</span>
                    </div>
                  </div>
                </Card>

                <Card className="glass-strong p-6 border-0 shadow-elegant">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-secondary-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPinIcon className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Base de Données</h3>
                    <p className="text-sm text-muted-foreground">Source secondaire</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5">✓</div>
                      <span>Prix moyens par code postal</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5">✓</div>
                      <span>Observatoires immobiliers locaux</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5">✓</div>
                      <span>Données notaires et agents</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5">✓</div>
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
                      <div className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5">✓</div>
                      <span>Distance et contexte urbain</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5">✓</div>
                      <span>Données démographiques</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5">✓</div>
                      <span>Comparaisons régionales</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5">✓</div>
                      <span>Confiance : 40-60% approximatif</span>
                    </div>
                  </div>
                </Card>
              </div>

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
    </section>
  );
};

export default QuickCalculator;
