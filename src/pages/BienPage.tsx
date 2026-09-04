import { useState } from 'react';
import { ArrowLeft, ArrowRight, Images } from 'lucide-react';
import { useParams } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import NotFound from '@/pages/NotFound';
import CarteBien, { DpeBadges, MentionsPhoto } from '@/components/CarteBien';
import { caracteristiques } from '@/components/biens/caracteristiques';
import BarreAppel from '@/components/systeme/BarreAppel';
import BoutonTelephone from '@/components/systeme/BoutonTelephone';
import { Lien } from '@/components/systeme/Lien';
import Ordinaux from '@/components/systeme/Ordinaux';
import { Calage, Trait, Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ADRESSE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';
import { biens, descriptionLines, eur, feeNote, legalLines, locationLabel, priceDrop, prixLibelle } from '@/lib/biens';

/**
 * LA FICHE BIEN — planche 2f de la direction « La Plaque », nouvelle page.
 *
 * Une page par annonce, à l'adresse `/biens/<slug>`, prérendue comme les
 * autres (le `:slug` est résolu par `scripts/routes.mjs` depuis
 * `data/biens.json`). La boîte de dialogue qui servait de fiche est retirée :
 * une annonce a droit à une URL qu'on partage, qu'on indexe et qu'on retrouve.
 *
 * TOUT VIENT DE LA DONNÉE, et rien d'autre. La planche montrait un encart « le
 * syndic de cet immeuble, c'est nous » avec charges, lots et travaux votés, et
 * une mention « SYNDIC : JIP » : la source ne dit pas quels immeubles l'agence
 * administre. Ce qui est affiché est ce que `data/biens.json` contient — lots
 * et charges annuelles de copropriété quand ils y sont, rien sinon. Même
 * règle pour l'interlocuteur : la planche nommait une personne et son
 * portable ; la fiche donne le numéro de l'agence, celui que `contact.php`
 * relaie au bon métier.
 *
 * LE DUOTONE NE S'APPLIQUE JAMAIS AUX PHOTOS : l'acheteur a droit à la couleur
 * réelle du bien.
 *
 * Un slug inconnu rend la page 404 telle quelle : le prérendu ne produit pas
 * ce cas (il n'écrit que les slugs du portefeuille), il n'arrive qu'en
 * navigation interne ou sur un lien périmé.
 */
const BienPage = () => {
  const { slug } = useParams();
  const bien = biens.find((b) => b.slug === slug);
  const [galerie, setGalerie] = useState(false);

  if (!bien) return <NotFound />;

  const location = bien.transaction === 'location';
  const note = feeNote(bien);
  const baisse = priceDrop(bien);
  const mentions = legalLines(bien);
  const stats = caracteristiques(bien);
  const [principale, ...autres] = bien.photos;
  const secondaires = autres.slice(0, 2);
  const autresBiens = biens.filter((b) => b.id !== bien.id).slice(0, 3);
  const service = location ? 'gestion-locative' : 'achats-ventes';
  const versContact = `/contact?service=${service}&bien=${encodeURIComponent(`Réf. ${bien.reference} — ${bien.title}`)}`;
  const copropriete = bien.features.inCondominium || bien.annualCondominiumFees != null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: bien.title,
    url: `https://www.adbjip.fr/biens/${bien.slug}`,
    description: descriptionLines(bien).join(' '),
    ...(principale ? { image: `https://www.adbjip.fr${principale.large.replace(/^\/?/, '/')}` } : {}),
    datePosted: bien.publicationDate ?? bien.firstSeenAt ?? undefined,
    offers:
      bien.price != null
        ? {
            '@type': 'Offer',
            price: bien.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            businessFunction: location
              ? 'http://purl.org/goodrelations/v1#LeaseOut'
              : 'http://purl.org/goodrelations/v1#Sell',
          }
        : undefined,
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${bien.title} — ${prixLibelle(bien)} | JIP Jobard Immobilier Paris`}
        description={`${location ? 'À louer' : 'À vendre'} : ${bien.title}, ${locationLabel(bien)}. ${prixLibelle(bien)}${note ? ` — ${note}` : ''}. Réf. ${bien.reference}.`}
        canonicalUrl={`https://www.adbjip.fr/biens/${bien.slug}`}
        structuredData={structuredData}
      />
      <Header />

      <main id="contenu" tabIndex={-1}>
        <section className="bg-pierre pb-16 pt-7 lg:pb-20 lg:pt-9">
          <div className="container mx-auto">
            {/* ---- Le fil d'Ariane ---------------------------------- */}
            <nav aria-label="Vous êtes ici" className="voile flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted-foreground">
              <Lien to="/biens" className="lien-trait inline-flex items-center gap-1.5 text-foreground">
                <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
                Tous les biens
              </Lien>
              <span aria-hidden>·</span>
              <span>{location ? 'Location' : 'Vente'}</span>
              <span aria-hidden>·</span>
              <span>
                <Ordinaux texte={bien.city} />
              </span>
            </nav>

            {/* ---- La galerie : une grande, deux petites ---------------- */}
            {principale && (
              <div className="voile mt-5 grid gap-3 lg:grid-cols-[2fr_1fr] [animation-delay:90ms]">
                <Calage className="relative aspect-[3/2] w-full bg-lin">
                  <img
                    src={principale.large}
                    srcSet={`${principale.medium} 800w, ${principale.large} 1200w`}
                    sizes="(min-width: 64rem) 60vw, 100vw"
                    alt={principale.alt}
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                  />
                  <MentionsPhoto bien={bien} />
                  {bien.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setGalerie(true)}
                      className="absolute bottom-3.5 right-3.5 z-[3] inline-flex items-center gap-2 bg-encre px-3 py-2 text-[0.6875rem] font-semibold text-pierre transition-colors duration-2 hover:bg-marine"
                    >
                      <Images aria-hidden className="h-3.5 w-3.5" />
                      Voir les {bien.photos.length} photos
                    </button>
                  )}
                </Calage>
                {secondaires.length > 0 && (
                  <div className="hidden grid-rows-2 gap-3 lg:grid">
                    {secondaires.map((photo) => (
                      <button
                        key={photo.medium}
                        type="button"
                        onClick={() => setGalerie(true)}
                        className="relative block overflow-hidden bg-lin"
                        aria-label="Ouvrir la galerie de photos"
                      >
                        <img
                          src={photo.medium}
                          alt={photo.alt}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---- Le propos et la carte de contact -------------------- */}
            <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
              <Voile delai={150}>
                <p className="flex flex-wrap items-center gap-2.5">
                  <span className="plaque">{location ? 'Location' : 'Vente'}</span>
                  <span className="cote text-muted-foreground">Réf. {bien.reference}</span>
                </p>
                <h1 className="mt-4 text-[clamp(2.25rem,4.4vw,3.5rem)]">
                  <Ordinaux texte={bien.title} />
                </h1>
                <p className="mt-2.5 text-[1rem] text-muted-foreground">
                  <Ordinaux texte={locationLabel(bien)} />
                </p>

                {stats.length > 0 && (
                  <dl className="mt-7 grid grid-cols-2 border-b border-[hsl(var(--trait)/var(--trait-a))] border-t border-t-foreground sm:grid-cols-4">
                    {stats.map((c, i) => (
                      <div
                        key={c.cle}
                        className={i > 0 ? 'border-l border-[hsl(var(--trait)/var(--trait-a))] py-4 pl-5' : 'py-4'}
                      >
                        <dd className="tabulaire font-serif text-[1.875rem] leading-none">{c.rendu}</dd>
                        <dt className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                          {c.libelle}
                        </dt>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mesure-large mt-7 space-y-4 text-[1rem] leading-[1.6] text-ardoise">
                  {descriptionLines(bien).map((line) => (
                    <p key={line}>
                      <Ordinaux texte={line} />
                    </p>
                  ))}
                </div>

                {copropriete && (
                  <div className="mt-7 bg-lin p-6">
                    <p className="gravure">Copropriété</p>
                    <dl className="mt-3 grid gap-x-8 gap-y-2 text-[0.875rem] sm:grid-cols-2">
                      {bien.condominiumParts != null && (
                        <div className="flex justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-1.5">
                          <dt className="text-muted-foreground">Lots</dt>
                          <dd className="tabulaire font-medium">{bien.condominiumParts}</dd>
                        </div>
                      )}
                      {bien.annualCondominiumFees != null && (
                        <div className="flex justify-between gap-4 border-b border-[hsl(var(--trait)/var(--trait-a))] py-1.5">
                          <dt className="text-muted-foreground">Charges annuelles</dt>
                          <dd className="tabulaire font-medium">{eur(bien.annualCondominiumFees)}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {bien.badges?.dpeBadge && (
                    <div>
                      <p className="etiquette-champ">Énergie</p>
                      <DpeBadges bien={bien} className="h-10" />
                    </div>
                  )}
                  {note && <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{note}</p>}
                </div>

                {mentions.length > 0 && (
                  <div className="mt-8">
                    <p className="etiquette-champ">Informations réglementaires</p>
                    <ul className="mt-1.5 space-y-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                      {mentions.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Voile>

              {/* La carte de contact, collante à droite : le prix, l'agence,
                  la demande de visite et le numéro. */}
              <Voile delai={210} className="panneau p-7 lg:sticky lg:top-24">
                <p className="tabulaire font-display text-[clamp(1.75rem,2.6vw,2.125rem)] font-semibold leading-none tracking-[-0.01em]">
                  {prixLibelle(bien)}
                </p>
                {baisse && bien.previousPrice != null && (
                  <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
                    <span className="line-through">{eur(bien.previousPrice)}</span> · baisse de{' '}
                    <span className="tabulaire">{eur(baisse.amount)}</span>
                  </p>
                )}
                <p className="tabulaire mt-1.5 text-[0.8125rem] text-muted-foreground">
                  {!location && bien.price != null && 'Honoraires inclus'}
                  {!location && bien.pricePerSquareMeter != null && ` · ${eur(bien.pricePerSquareMeter)} / m²`}
                  {location && note}
                </p>

                <div className="my-6 border-y border-[hsl(var(--trait)/var(--trait-a))] py-4">
                  <p className="text-[0.9375rem] font-semibold">Jobard Immobilier Paris</p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                    {location ? 'Gérance locative' : 'Transaction et estimation'} · {ADRESSE.rue}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button size="lg" className="w-full" asChild>
                    <Lien to={versContact}>
                      Demander une visite
                      <ArrowRight aria-hidden />
                    </Lien>
                  </Button>
                  <BoutonTelephone className="w-full" />
                </div>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                  Réponse sous 24 heures ouvrées. La personne qui répond est celle qui suivra votre
                  dossier.
                </p>
              </Voile>
            </div>
          </div>
        </section>

        {/* ---- DANS LE MÊME PORTEFEUILLE -------------------------------- */}
        {autresBiens.length > 0 && (
          <section className="bg-pierre pb-16 lg:pb-20">
            <div className="container mx-auto">
              <div className="mb-8 flex items-baseline gap-5">
                <p className="gravure shrink-0">Dans le même portefeuille</p>
                <Trait className="min-w-0 flex-1 self-center" />
              </div>
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {autresBiens.map((autre, index) => (
                  <Voile key={autre.id} delai={echelonner(index)} className="flex">
                    <CarteBien bien={autre} index={index + 3} />
                  </Voile>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BarreAppel action={{ libelle: 'Demander une visite', href: versContact }} />

      {/* La galerie complète, en boîte de dialogue. */}
      <Dialog open={galerie} onOpenChange={setGalerie}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <Ordinaux texte={bien.title} />
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {bien.photos.map((photo, i) => (
              <figure key={photo.medium} className="m-0 overflow-hidden bg-lin">
                <img
                  src={photo.large}
                  srcSet={`${photo.medium} 800w, ${photo.large} 1200w`}
                  sizes="(min-width: 56rem) 56rem, 90vw"
                  alt={photo.alt}
                  className="h-auto w-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BienPage;
