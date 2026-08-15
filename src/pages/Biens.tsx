import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  Calculator,
  Camera,
  Layers,
  Mail,
  MapPin,
  Maximize,
  Phone,
  Home,
  Search,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Bien,
  biens,
  cities,
  descriptionLines,
  eur,
  feeNote,
  isNew,
  legalLines,
  locationLabel,
  locations,
  priceDrop,
  ventes,
} from '@/lib/biens';
import { classesGrille } from '@/lib/grille';

type Filter = 'tous' | 'vente' | 'location';

const FILTERS: { value: Filter; label: string; count: number }[] = [
  { value: 'tous', label: 'Tous', count: biens.length },
  { value: 'vente', label: 'À vendre', count: ventes.length },
  { value: 'location', label: 'À louer', count: locations.length },
];

/** Les surfaces, pièces et étages absents de la source ne sont pas affichés. */
const factsOf = (bien: Bien) =>
  [
    bien.surface ? { icon: Maximize, label: `${bien.surface} m²` } : null,
    bien.rooms ? { icon: Home, label: `${bien.rooms} pièce${bien.rooms > 1 ? 's' : ''}` } : null,
    bien.bedrooms ? { icon: Bed, label: `${bien.bedrooms} ch.` } : null,
    bien.floor ? { icon: Layers, label: `${bien.floor}ᵉ étage` } : null,
  ].filter(Boolean) as { icon: typeof Maximize; label: string }[];

const priceLabel = (bien: Bien) => {
  if (bien.price == null) return 'Prix sur demande';
  return bien.transaction === 'location' ? `${eur(bien.price)} /mois` : eur(bien.price);
};

const DpeBadges = ({ bien, className = 'h-11' }: { bien: Bien; className?: string }) => {
  if (!bien.badges?.dpeBadge) return null;
  return (
    <div className="flex items-end gap-3" aria-label="Diagnostic de performance énergétique">
      <img
        src={bien.badges.dpeBadge}
        alt={`Classe énergie ${bien.dpe.energyClass ?? ''}`}
        className={`${className} w-auto`}
        loading="lazy"
        decoding="async"
      />
      {bien.badges.gesBadge && (
        <img
          src={bien.badges.gesBadge}
          alt={`Classe climat ${bien.dpe.gesClass ?? ''}`}
          className={`${className} w-auto`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

const BienCard = ({ bien, index, onOpen }: { bien: Bien; index: number; onOpen: () => void }) => {
  const cover = bien.photos[0];
  const isRent = bien.transaction === 'location';
  const note = feeNote(bien);
  const drop = priceDrop(bien);

  return (
    <Card className="group flex flex-col overflow-hidden border-0 shadow-card hover-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover.medium}
            srcSet={`${cover.small} 400w, ${cover.medium} 800w, ${cover.large} 1200w`}
            sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
            alt={cover.alt}
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Photo à venir
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className="uppercase" variant={isRent ? 'secondary' : 'default'}>
            {isRent ? 'Location' : 'Vente'}
          </Badge>
          {isNew(bien) && (
            <Badge className="bg-background uppercase text-foreground" variant="outline">
              Nouveau
            </Badge>
          )}
          {drop && (
            <Badge className="uppercase" variant="destructive">
              Baisse de prix
            </Badge>
          )}
        </div>

        {bien.photos.length > 1 && (
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Camera className="h-3.5 w-3.5" />
            {bien.photos.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-2xl font-bold tracking-tight">
              {priceLabel(bien)}
              {drop && (
                <span className="ml-2 text-base font-normal text-muted-foreground line-through">
                  {eur(bien.previousPrice!)}
                </span>
              )}
            </p>
            <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Réf. {bien.reference}
            </span>
          </div>
          {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
        </div>

        <div>
          <h2 className="text-lg font-semibold leading-snug">{bien.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            {locationLabel(bien)}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 border-y border-border/60 py-3">
          {factsOf(bien).map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-sm">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </li>
          ))}
        </ul>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {descriptionLines(bien).join(' ')}
        </p>

        <div className="mt-auto space-y-4 pt-2">
          <DpeBadges bien={bien} />
          <Button className="w-full" onClick={onOpen}>
            Voir le bien
          </Button>
        </div>
      </div>
    </Card>
  );
};

const BienDetail = ({ bien }: { bien: Bien }) => {
  const mentions = legalLines(bien);

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
      <div className="grid gap-3">
        {bien.photos.map((photo) => (
          <figure key={photo.medium} className="overflow-hidden rounded-xl bg-muted">
            <img
              src={photo.medium}
              srcSet={`${photo.small} 400w, ${photo.medium} 800w, ${photo.large} 1200w`}
              sizes="(min-width: 768px) 45vw, 90vw"
              alt={photo.alt}
              className="h-auto w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>

      <div className="flex flex-col gap-6 md:sticky md:top-6 md:self-start">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <span>
              {bien.transaction === 'location' ? 'Location' : 'Vente'} · Réf. {bien.reference}
            </span>
            {isNew(bien) && <Badge variant="outline">Nouveau</Badge>}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {locationLabel(bien)}
          </p>
          <p className="mt-4 text-3xl font-bold">{priceLabel(bien)}</p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border/60 py-4">
          {factsOf(bien).map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-sm">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </li>
          ))}
        </ul>

        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {descriptionLines(bien).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <DpeBadges bien={bien} className="h-16" />

        {mentions.length > 0 && (
          <div className="rounded-xl bg-muted/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide">
              Informations réglementaires
            </p>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
              {mentions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="tel:+33142257824">
              <Phone className="mr-2 h-4 w-4" />
              01.42.25.78.24
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`mailto:j.immo.p@orange.fr?subject=${encodeURIComponent(
                `Bien réf. ${bien.reference} — ${bien.title}`,
              )}`}
            >
              <Mail className="mr-2 h-4 w-4" />
              Écrire à l'agence
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Biens = () => {
  const [filter, setFilter] = useState<Filter>('tous');
  const [selected, setSelected] = useState<Bien | null>(null);

  /**
   * Le portefeuille varie : il peut tomber à une annonce, voire zéro entre deux
   * mandats. La phrase doit rester juste dans les trois cas — accords compris,
   * et sans annoncer des villes quand la liste est vide.
   */
  const introduction = useMemo(() => {
    const suite =
      ' Chaque annonce est reprise directement de notre logiciel de gestion et mise à jour quotidiennement.';
    if (biens.length === 0) {
      return (
        "Aucun bien n'est disponible à la vente ou à la location en ce moment. " +
        'Dites-nous ce que vous cherchez : nous vous prévenons avant la mise en publication.'
      );
    }
    if (biens.length === 1) {
      return `Un bien est actuellement proposé à ${cities.join(', ')}.${suite}`;
    }
    return `${biens.length} biens sont actuellement proposés à ${cities.join(', ')}.${suite}`;
  }, []);

  const visible = useMemo(
    () => (filter === 'tous' ? biens : biens.filter((bien) => bien.transaction === filter)),
    [filter],
  );

  // Une fiche par annonce réellement au portefeuille, avec sa vraie commune.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Biens à vendre et à louer — JIP Jobard Immobilier',
    numberOfItems: biens.length,
    itemListElement: biens.map((bien, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: bien.title,
        ...(bien.price != null ? { price: bien.price, priceCurrency: 'EUR' } : {}),
        availableAtOrFrom: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: bien.city,
            postalCode: bien.postalCode,
            addressCountry: 'FR',
          },
        },
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Nos biens à vendre et à louer | JIP Jobard Immobilier Paris"
        description={
          biens.length === 0
            ? "Aucun bien disponible en ce moment chez JIP Jobard Immobilier. Dites-nous ce que vous cherchez, nous vous prévenons avant la mise en publication."
            : `${biens.length === 1 ? 'Le bien actuellement proposé' : `Les ${biens.length} biens actuellement proposés`} par JIP Jobard Immobilier : ${cities.join(', ')}. Vente et location, mise à jour quotidienne.`
        }
        keywords="biens à vendre paris, location paris, jobard immobilier, appartement paris 16, appartement paris 20"
        canonicalUrl="https://www.adbjip.fr/biens"
        structuredData={structuredData}
      />
      <Header />

      <main role="main">
        <section className="border-b border-border/60 bg-gradient-subtle pt-24 md:pt-28">
          <div className="container mx-auto px-6 pb-14">
            <Badge className="glass mb-6 px-4 py-2 text-primary" variant="outline">
              Portefeuille
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Nos biens <span className="gradient-text">à vendre et à louer</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {introduction}
            </p>

            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrer les biens">
              {FILTERS.filter((item) => item.count > 0).map((item) => (
                <Button
                  key={item.value}
                  variant={filter === item.value ? 'default' : 'outline'}
                  className="rounded-full"
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label} ({item.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-14">
          {visible.length > 0 ? (
            <div className={`grid grid-cols-1 gap-8 ${classesGrille(visible.length)}`}>
              {visible.map((bien, index) => (
                <BienCard
                  key={bien.id}
                  bien={bien}
                  index={index}
                  onOpen={() => setSelected(bien)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun bien ne correspond à ce filtre.</p>
            </div>
          )}
        </section>

        <section className="border-t border-border/60 bg-muted/40">
          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold">Un projet de vente ou de location ?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Nos biens partent vite et ne restent pas tous en ligne. Dites-nous ce que vous
              cherchez, nous vous prévenons avant la mise en publication.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Nous contacter
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/services/estimation-biens">
                  <Calculator className="mr-2 h-5 w-5" />
                  Estimer mon bien
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <BienDetail bien={selected} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Biens;
