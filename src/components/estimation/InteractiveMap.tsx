import { useEffect, useState } from 'react';
import { Euro, ExternalLink, MapPin, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MarketDataService from '@/components/estimation/MarketDataService';

interface MarketData {
  basePricePerM2: number;
  /** Indice de confiance du service, entre 0 et 1. */
  confidence: number;
  /** Nombre de transactions retenues pour le calcul. */
  sampleSize: number;
  source: 'DVF' | 'Database' | 'Geographic' | string;
}

interface InteractiveMapProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  city: string;
  postalCode: string;
  estimationResult: number | null;
  /** Données renvoyées par MarketDataService lors du calcul. */
  marketData?: MarketData | null;
}

const SOURCE_LABELS: Record<string, string> = {
  DVF: 'Demandes de valeurs foncières (DGFiP)',
  Database: 'Références internes par code postal',
  Geographic: 'Estimation géographique — aucune transaction proche',
};

const InteractiveMap = ({
  isOpen,
  onClose,
  address,
  city,
  postalCode,
  estimationResult,
  marketData = null,
}: InteractiveMapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const fullAddress = `${address}, ${postalCode} ${city}`;

  // Le géocodage passe par MarketDataService : même appel, même cache que le
  // calculateur, plutôt qu'un second aller-retour vers l'API Adresse.
  useEffect(() => {
    if (!isOpen || !address || !city || !postalCode) return;

    let cancelled = false;
    setIsLoading(true);
    setFailed(false);

    MarketDataService.getInstance()
      .geocodeAddress(address, city, postalCode)
      .then((coords) => {
        if (cancelled) return;
        if (coords) setCoordinates([coords[0], coords[1]]);
        else setFailed(true);
      })
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [isOpen, address, city, postalCode]);

  const [lng, lat] = coordinates ?? [];

  // Embed Google en tuiles raster : pas de clé d'API, et surtout pas de WebGL
  // requis — l'embed OpenStreetMap, lui, refuse de s'afficher sans.
  const mapSrc = coordinates
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=fr&output=embed`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8 text-2xl">
            Situation du bien — <span className="gradient-text">estimation</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-2 flex items-center space-x-3">
                <MapPin aria-hidden className="h-5 w-5 text-primary-ink" />
                <h3 className="font-semibold">Adresse</h3>
              </div>
              <p className="text-sm text-muted-foreground">{fullAddress}</p>
            </div>

            {estimationResult !== null && (
              <div className="rounded-lg border border-primary/30 bg-primary-soft p-4">
                <div className="mb-2 flex items-center space-x-3">
                  <Euro aria-hidden className="h-5 w-5 text-primary-ink" />
                  <h3 className="font-semibold">Estimation</h3>
                </div>
                <p className="text-2xl font-bold">
                  {estimationResult.toLocaleString('fr-FR')} €
                </p>
              </div>
            )}

            {/* Uniquement ce que le service renvoie réellement : pas de délai de
                vente ni d'évolution annuelle, que nous ne calculons pas. */}
            {marketData && (
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="mb-2 flex items-center space-x-3">
                  <TrendingUp aria-hidden className="h-5 w-5 text-primary-ink" />
                  <h3 className="font-semibold">Marché local</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    Prix moyen au m² :{' '}
                    <span className="font-medium text-foreground">
                      {Math.round(marketData.basePricePerM2).toLocaleString('fr-FR')} €
                    </span>
                  </li>
                  <li>
                    Transactions analysées :{' '}
                    <span className="font-medium text-foreground">{marketData.sampleSize}</span>
                  </li>
                  <li>
                    Indice de confiance :{' '}
                    <span className="font-medium text-foreground">
                      {Math.round(marketData.confidence * 100)} %
                    </span>
                  </li>
                  <li className="pt-1 text-xs">
                    Source : {SOURCE_LABELS[marketData.source] ?? marketData.source}
                  </li>
                </ul>
              </div>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              Estimation indicative, calculée à partir des transactions publiques du secteur.
              Elle ne remplace pas une visite : la configuration, l'état et l'exposition du bien
              peuvent la faire varier sensiblement.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted lg:aspect-[16/10]">
              {mapSrc ? (
                <iframe
                  key={mapSrc}
                  src={mapSrc}
                  title={`Carte — ${fullAddress}`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  {isLoading ? (
                    <div>
                      {/* `role="status"` : l'anneau se voit, le texte se lit, mais
                          sans région vocale rien n'est annoncé. Le mouvement
                          réduit conserve la rotation (voir `.attente`) ET
                          l'annonce : deux canaux pour une même information. */}
                      <div role="status">
                        <div className="attente mx-auto mb-4 h-10 w-10 rounded-full border-b-2 border-primary" />
                        <p className="text-sm text-muted-foreground">Localisation en cours…</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <MapPin aria-hidden className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {failed
                          ? "Adresse introuvable : vérifiez le numéro, la voie et le code postal."
                          : 'Renseignez une adresse pour afficher la carte.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden className="mr-2 h-4 w-4" />
                  Ouvrir dans Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveMap;
