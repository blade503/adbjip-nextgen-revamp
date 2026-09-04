import { useEffect, useState } from 'react';
import { Euro, ExternalLink, MapPin, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MarketDataService, { type DonneesMarche } from '@/components/estimation/MarketDataService';

interface InteractiveMapProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  city: string;
  postalCode: string;
  estimationResult: number | null;
  /** Données renvoyées par MarketDataService lors du calcul. */
  marketData?: DonneesMarche | null;
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
          {/* Plus de mot en dégradé : le laiton ne fait que 1,81:1 sur la
              pierre en texte, il reste sur les plaques où il est mesuré. */}
          <DialogTitle>Situation du bien — estimation</DialogTitle>
        </DialogHeader>

        {/* MÊMES OBJETS QUE LE CALCULATEUR. Cette boîte reprend le chiffre et les
            indicateurs que `QuickCalculator` affiche déjà : ils sont donc composés
            de la même façon — le prix sur une plaque de nuit, les indicateurs en
            liste réglée. Les trois cartes grises à coins de 8 px et le prix en
            `font-bold` étaient les derniers restes du gabarit dans cette page. */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5">
            <div className="panneau p-4">
              <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
                Adresse
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">{fullAddress}</p>
            </div>

            {estimationResult !== null && (
              <div className="nuit cadre bg-nuit p-4 text-pierre">
                <p className="tabulaire flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
                  <Euro aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  Estimation indicative
                </p>
                <p className="tabulaire mt-2 font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-none">
                  {estimationResult.toLocaleString('fr-FR')} €
                </p>
              </div>
            )}

            {/* Uniquement ce que le service renvoie réellement : pas de délai de
                vente ni d'évolution annuelle, que nous ne calculons pas. */}
            {marketData && (
              <div>
                <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                  <TrendingUp aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  Marché local
                </p>
                <dl className="mt-3 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                    <dt className="text-[0.875rem] text-muted-foreground">Prix moyen au m²</dt>
                    <dd className="tabulaire font-display text-[0.9375rem] font-semibold">
                      {Math.round(marketData.basePricePerM2).toLocaleString('fr-FR')} €
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                    <dt className="text-[0.875rem] text-muted-foreground">Transactions analysées</dt>
                    <dd className="tabulaire font-display text-[0.9375rem] font-semibold">
                      {marketData.sampleSize}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                    <dt className="text-[0.875rem] text-muted-foreground">Indice de confiance</dt>
                    <dd className="tabulaire font-display text-[0.9375rem] font-semibold">
                      {Math.round(marketData.confidence * 100)} %
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-2.5">
                    <dt className="text-[0.875rem] text-muted-foreground">Source</dt>
                    <dd className="text-right text-[0.8125rem] font-medium">
                      {SOURCE_LABELS[marketData.source] ?? marketData.source}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <p className="mesure border-l-2 border-primary py-2 pl-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Estimation indicative, calculée à partir des transactions publiques du secteur.
              Elle ne remplace pas une visite : la configuration, l'état et l'exposition du bien
              peuvent la faire varier sensiblement.
            </p>
          </div>

          <div className="lg:col-span-2">
            {/* Le cadre gravé de la charte autour de la carte, rayon de 2 px.
                Les états d'attente et d'échec sont ferrés à gauche : rien n'est
                centré sur ce site, pas même une attente. */}
            <div className="cadre relative aspect-[4/3] overflow-hidden rounded-[2px] bg-muted lg:aspect-[16/10]">
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
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                  {isLoading ? (
                    /* `role="status"` : l'anneau se voit, le texte se lit, mais
                       sans région vocale rien n'est annoncé. Le mouvement réduit
                       conserve la rotation (voir `.attente`) ET l'annonce : deux
                       canaux pour une même information. */
                    <p
                      role="status"
                      className="flex items-center gap-3 text-[0.9375rem] text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="attente block h-4 w-4 shrink-0 rounded-full border-b-2 border-primary"
                      />
                      Localisation en cours…
                    </p>
                  ) : (
                    <p className="mesure flex items-start gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                      <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                      {failed
                        ? "Adresse introuvable : vérifiez le numéro, la voie et le code postal."
                        : 'Renseignez une adresse pour afficher la carte.'}
                    </p>
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
                  Ouvrir dans Google Maps
                  <ExternalLink aria-hidden />
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
