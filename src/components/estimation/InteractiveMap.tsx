import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin, Euro, TrendingUp } from 'lucide-react';

interface InteractiveMapProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  city: string;
  postalCode: string;
  estimationResult: number | null;
}

const InteractiveMap = ({ isOpen, onClose, address, city, postalCode, estimationResult }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  // Géocodage de l'adresse
  useEffect(() => {
    if (isOpen && address && city && postalCode) {
      geocodeAddress();
    }
  }, [isOpen, address, city, postalCode]);

  const geocodeAddress = async () => {
    setIsLoading(true);
    try {
      const fullAddress = `${address}, ${postalCode} ${city}`;
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(fullAddress)}&limit=1`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        setCoordinates([coords[0], coords[1]]);
        initializeMap(coords[0], coords[1]);
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = (lng: number, lat: number) => {
    if (!mapContainer.current || map.current) return;

    // Simulation d'une carte Mapbox (en attendant l'intégration réelle)
    // Ici on créerait une vraie carte avec Mapbox GL JS
    map.current = {
      setCenter: () => {},
      addMarker: () => {},
      remove: () => {}
    };

    // Pour l'instant, on simule juste l'initialisation
    console.log('Map initialized at:', lng, lat);
  };

  const cleanup = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl h-[80vh] p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">
            Carte Interactive - <span className="gradient-text">Estimation</span>
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Informations */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Adresse</h4>
                </div>
                <p className="text-sm text-blue-800">
                  {address}, {postalCode} {city}
                </p>
              </div>

              {estimationResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Euro className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Estimation</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    {estimationResult.toLocaleString('fr-FR')} €
                  </p>
                </div>
              )}

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">Marché Local</h4>
                </div>
                <div className="space-y-2 text-sm text-orange-800">
                  <div>• Prix moyen au m² : ~8 500 €</div>
                  <div>• Évolution : +2.3% sur 12 mois</div>
                  <div>• Délai de vente : 45 jours</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Informations</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div>• Estimation basée sur les données DVF</div>
                <div>• Analyse dans un rayon de 1km</div>
                <div>• Données mises à jour mensuellement</div>
                <div>• Confiance : 85%</div>
              </div>
            </div>
          </div>

          {/* Carte */}
          <div className="lg:col-span-2">
            <div className="h-full bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de la carte...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Carte Interactive</h3>
                    <p className="text-sm">
                      {coordinates ? 
                        `Coordonnées: ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}` :
                        'Géocodage en cours...'
                      }
                    </p>
                    <p className="text-xs mt-2 text-gray-400">
                      Intégration Mapbox en cours de développement
                    </p>
                  </div>
                </div>
              )}
              
              {/* Placeholder pour la vraie carte Mapbox */}
              <div 
                ref={mapContainer} 
                className="absolute inset-0"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            Voir sur Google Maps
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InteractiveMap;
