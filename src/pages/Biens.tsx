import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import CarteBien from '@/components/CarteBien';
import BandeauContact from '@/components/systeme/BandeauContact';
import BarreAppel from '@/components/systeme/BarreAppel';
import EnTetePage from '@/components/systeme/EnTetePage';
import { Lien } from '@/components/systeme/Lien';
import Ordinaux from '@/components/systeme/Ordinaux';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { biens, cities, locations, ventes } from '@/lib/biens';
import { echelonner } from '@/lib/echelon';
import { classesGrille } from '@/lib/grille';
import { cn } from '@/lib/utils';

/**
 * LE PORTEFEUILLE — planche 2e de la direction « La Plaque ».
 *
 * Les annonces sont les seules données dynamiques du site : reprises chaque
 * nuit du logiciel de gestion (`data/biens.json`), jamais corrigées ici. La
 * page les montre en grille de trois, chaque fiche menant à SA page
 * (`/biens/<slug>`) — la boîte de dialogue qui tenait lieu de fiche a disparu
 * avec la fiche bien de la planche 2f.
 *
 * Le filtre est un commutateur à trois positions, ferré à droite du titre.
 * L'état est porté par `aria-pressed` ET par l'aplat de marine : deux cues, dont
 * l'un ne dépend pas de la couleur.
 */

type Filter = 'tous' | 'vente' | 'location';

const FILTERS: { value: Filter; label: string; count: number }[] = [
  { value: 'tous', label: 'Tous', count: biens.length },
  { value: 'vente', label: 'À vendre', count: ventes.length },
  { value: 'location', label: 'À louer', count: locations.length },
];

const Biens = () => {
  const [filter, setFilter] = useState<Filter>('tous');

  /**
   * Le portefeuille varie : il peut tomber à une annonce, voire zéro entre deux
   * mandats. La phrase doit rester juste dans les trois cas.
   */
  const introduction = useMemo(() => {
    if (biens.length === 0) {
      return "Aucun bien n'est disponible à la vente ou à la location en ce moment. Dites-nous ce que vous cherchez : nous vous prévenons avant la mise en publication.";
    }
    if (biens.length === 1) {
      return `Un bien est actuellement proposé à ${cities.join(', ')}. Ce qui est affiché ici est disponible ce matin.`;
    }
    return `${biens.length} biens sont actuellement proposés à ${cities.join(', ')}. Ce qui est affiché ici est disponible ce matin.`;
  }, []);

  const visible = useMemo(
    () => (filter === 'tous' ? biens : biens.filter((bien) => bien.transaction === filter)),
    [filter],
  );

  // Une fiche par annonce réellement au portefeuille, avec sa vraie commune
  // et l'URL de sa page.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Biens à vendre et à louer — JIP Jobard Immobilier',
    numberOfItems: biens.length,
    itemListElement: biens.map((bien, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.adbjip.fr/biens/${bien.slug}`,
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

  const filtres = FILTERS.filter((item) => item.count > 0);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Nos biens à vendre et à louer | JIP Jobard Immobilier Paris"
        description={
          biens.length === 0
            ? 'Aucun bien disponible en ce moment chez JIP Jobard Immobilier. Dites-nous ce que vous cherchez, nous vous prévenons avant la mise en publication.'
            : `${biens.length === 1 ? 'Le bien actuellement proposé' : `Les ${biens.length} biens actuellement proposés`} par JIP Jobard Immobilier : ${cities.join(', ')}. Vente et location, mise à jour quotidienne.`
        }
        keywords="biens à vendre paris, location paris, jobard immobilier, appartement paris 16, appartement paris 20"
        canonicalUrl="https://www.adbjip.fr/biens"
        structuredData={structuredData}
      />
      <Header />

      <main id="contenu" tabIndex={-1}>
        <EnTetePage
          surtitre="Portefeuille · repris chaque nuit du logiciel de gestion"
          titre="À vendre et à louer aujourd'hui"
          chapeau={<Ordinaux texte={introduction} />}
          aparte={
            filtres.length > 1 && (
              <div
                role="group"
                aria-label="Filtrer les biens"
                className="inline-flex border border-foreground text-[0.6875rem] font-semibold uppercase tracking-[0.1em]"
              >
                {filtres.map((item) => {
                  const actif = filter === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => setFilter(item.value)}
                      className={cn(
                        'tabulaire border-l border-foreground px-4 py-3 transition-colors duration-2 first:border-l-0 sm:px-5',
                        actif ? 'bg-marine text-pierre' : 'hover:bg-[hsl(var(--lavis)/var(--lavis-a))]',
                      )}
                    >
                      {item.label} · {item.count}
                    </button>
                  );
                })}
              </div>
            )
          }
        />

        <section className="bg-pierre pb-16 lg:pb-20">
          <div className="container mx-auto">
            {visible.length > 0 ? (
              <div className={`grid grid-cols-1 gap-x-6 gap-y-10 ${classesGrille(visible.length + 1)}`}>
                {visible.map((bien, index) => (
                  <Voile key={bien.id} delai={echelonner(index)} className="flex">
                    <CarteBien bien={bien} index={index} />
                  </Voile>
                ))}

                {/* La dernière case : la recherche que le portefeuille ne
                    couvre pas encore. Cernée de pointillés — c'est une place
                    laissée libre, pas une annonce. */}
                <Voile
                  delai={echelonner(visible.length)}
                  className="flex flex-col justify-center gap-3 border border-dashed border-[hsl(var(--trait)/0.4)] p-7"
                >
                  <p className="gravure">Votre recherche</p>
                  <p className="font-serif text-[clamp(1.5rem,2vw,1.75rem)] leading-[1.1]">
                    Nos biens partent vite et ne restent pas tous en ligne.
                  </p>
                  <p className="text-[0.875rem] leading-[1.5] text-ardoise">
                    Dites-nous ce que vous cherchez, nous vous prévenons avant la mise en publication.
                  </p>
                  <Button className="mt-2 self-start" asChild>
                    <Lien to="/contact?service=achats-ventes">
                      Être prévenu
                      <ArrowRight aria-hidden />
                    </Lien>
                  </Button>
                </Voile>
              </div>
            ) : (
              <div className="border-t border-[hsl(var(--trait)/var(--trait-a))] py-16">
                <p className="flex items-center gap-3 text-muted-foreground">
                  <Search aria-hidden className="h-4 w-4 shrink-0" />
                  Aucun bien ne correspond à ce filtre.
                </p>
              </div>
            )}
          </div>
        </section>

        <BandeauContact
          titre="Un projet de vente ou de location ?"
          texte="On estime et on vend mieux un immeuble dont on tient les comptes."
          action={{ libelle: 'Estimer mon bien', href: '/services/vendre-estimer' }}
          ordre="action"
        />
      </main>

      <Footer />
      <BarreAppel action={{ libelle: 'Estimer', href: '/services/vendre-estimer' }} />
    </div>
  );
};

export default Biens;
