import { AlertTriangle, Scale } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import {
  ADRESSE,
  DIRECTEUR_PUBLICATION,
  EDITEUR,
  ENTITES,
  Entite,
  HEBERGEUR,
  legalIsIncomplete,
} from '@/config/legal';
import EnTetePage from '@/components/systeme/EnTetePage';
import EnTeteSection from '@/components/systeme/EnTeteSection';

/** Une valeur manquante se voit, elle ne se devine pas. */
const Value = ({ children }: { children: string | null }) =>
  children ? (
    <span>{children}</span>
  ) : (
    <span className="bg-destructive/10 px-2 py-0.5 text-[0.8125rem] font-medium text-destructive-ink">
      à compléter
    </span>
  );

const Row = ({ label, children }: { label: string; children: string | null }) => (
  <div className="flex flex-col gap-1 border-b border-[hsl(var(--trait)/var(--trait-a))] py-3.5 sm:flex-row sm:gap-6">
    <dt className="w-full text-[0.8125rem] text-muted-foreground sm:w-64 sm:shrink-0">{label}</dt>
    <dd className="text-[0.875rem] font-medium">
      <Value>{children}</Value>
    </dd>
  </div>
);

/**
 * Une section de mentions : plaque vissée, filet qui court, puis la liste
 * réglée. Le titre était un `h2` nu de 20 px, sans repère visuel : la page
 * n'avait aucune des trois marques de la charte.
 */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-14 first:mt-0">
    <EnTeteSection plaque="Mention" titre={title} />
    <dl className="mt-6 border-t border-[hsl(var(--trait)/var(--trait-a))]">{children}</dl>
  </section>
);

const EntiteBlock = ({ entite }: { entite: Entite }) => (
  <Section title={entite.raisonSociale}>
    <Row label="Activité">{entite.role}</Row>
    <Row label="Forme juridique">{entite.formeJuridique}</Row>
    <Row label="Capital social">{entite.capital}</Row>
    <Row label="SIREN">{entite.siren}</Row>
    <Row label="SIRET (siège)">{entite.siret}</Row>
    <Row label="Immatriculation">{entite.rcs}</Row>
    <Row label="TVA intracommunautaire">{entite.tva}</Row>
    <Row label="Code APE">{`${entite.codeApe} — ${entite.activite}`}</Row>
    <Row label="Président">{entite.president}</Row>
    <Row label="Carte professionnelle">{entite.carteProfessionnelle.numero}</Row>
    <Row label="Délivrée par">{entite.carteProfessionnelle.delivreePar}</Row>
    <Row label="Délivrée le">{entite.carteProfessionnelle.delivreeLe}</Row>
    <Row label="Valable jusqu'au">{entite.carteProfessionnelle.valableJusquAu}</Row>
    <Row label="Mentions de la carte">{entite.carteProfessionnelle.mentions.join(' · ')}</Row>
    <Row label="Garantie financière">{entite.garantieFinanciere.organisme}</Row>
    <Row label="Adresse du garant">{entite.garantieFinanciere.adresse}</Row>
    {/* Un montant par activité : sans montant relevé, la ligne générique
        reste, en « à compléter ». */}
    {entite.garantieFinanciere.montants.length === 0 ? (
      <Row label="Montant garanti">{null}</Row>
    ) : (
      entite.garantieFinanciere.montants.map(({ activite, montant, precision }) => (
        <Row key={activite} label={`Montant garanti — ${activite}`}>
          {precision ? `${montant} · ${precision}` : montant}
        </Row>
      ))
    )}
    <Row label="Assurance RCP">{entite.assuranceRcp.assureur}</Row>
    <Row label="Adresse de l'assureur">{entite.assuranceRcp.adresse}</Row>
    {/* Le numéro du contrat n'est pas une mention obligatoire (le code de la
        consommation demande l'assureur et la couverture, R111-2) : la ligne
        ne paraît que renseignée, au lieu d'un « à compléter » sur une page
        indexée. */}
    {entite.assuranceRcp.contrat && <Row label="Numéro de contrat">{entite.assuranceRcp.contrat}</Row>}
    <Row label="Couverture géographique">{entite.assuranceRcp.couvertureGeographique}</Row>
  </Section>
);

const MentionsLegales = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Mentions légales — Jobard Immobilier"
      description="Mentions légales de Jobard Immobilier Patrimoine : éditeur, carte professionnelle, garantie financière, et assurance."
      canonicalUrl="https://www.adbjip.fr/mentions-legales"
      /* Tant qu'une mention obligatoire manque, la page ne s'indexe pas : un
         « à compléter » dans un extrait de résultat de recherche est pire que
         l'absence. Le sitemap l'exclut déjà ; `noindex` retombe de lui-même
         quand `legalIsIncomplete` passe à faux. */
      noindex={legalIsIncomplete}
    />
    <Header />

    <main id="contenu" tabIndex={-1}>
      <EnTetePage
        surtitre="Informations légales"
        titre="Mentions légales"
        chapeau="Éditeur du site, carte professionnelle, garanties financières, assurance et hébergement."
        className="pb-6 lg:pb-8"
      />

      <div className="container mx-auto max-w-[52rem] pb-20 pt-6 lg:pb-28">
        {legalIsIncomplete && (
          <div className="mb-14 flex gap-3 border-l-2 border-destructive bg-destructive/5 py-4 pl-4 pr-5">
            <AlertTriangle aria-hidden className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm leading-relaxed">
              <strong>Page en cours de complément.</strong> Les mentions marquées « à compléter »
              — TVA, numéro du contrat d'assurance — figurent sur les factures et l'attestation
              d'assurance de la société, et seront publiées dès leur transmission par l'agence.
            </p>
          </div>
        )}

        <Section title="Éditeur du site">
          <Row label="Raison sociale">{EDITEUR.raisonSociale}</Row>
          <Row label="Siège social">{`${ADRESSE.rue}, ${ADRESSE.codePostal} ${ADRESSE.ville}`}</Row>
          <Row label="Téléphone">{ADRESSE.telephone}</Row>
          <Row label="Courriel">{ADRESSE.email}</Row>
          <Row label="Directeur de la publication">{DIRECTEUR_PUBLICATION}</Row>
        </Section>

        {/* Une société depuis le 20/10/2026 (Patrimoine), mais le rendu reste
            par entité : chaque société a sa propre carte professionnelle, et
            une seconde reviendrait sans toucher à cette page. */}
        {ENTITES.map((entite) => (
          <EntiteBlock key={entite.siren} entite={entite} />
        ))}

        {/* LA MÉDIATION DE LA CONSOMMATION A ÉTÉ RETIRÉE le 20/10/2026, à la
            demande du client. Elle est pourtant obligatoire pour un
            professionnel qui traite avec des particuliers (code de la
            consommation, L616-1 et R616-1) : à remettre dès que le médiateur
            est désigné — renseigner `MEDIATEUR` dans `config/legal.ts`, puis
            rétablir ici les trois lignes Médiateur, Site, Adresse. */}

        <Section title="Hébergement">
          <Row label="Hébergeur">{HEBERGEUR.nom}</Row>
          <Row label="Adresse">{HEBERGEUR.adresse}</Row>
          <Row label="Site">{HEBERGEUR.site}</Row>
        </Section>

        <section className="mt-14">
          <EnTeteSection plaque="Mention" titre="Propriété intellectuelle" />
          <p className="mesure-large mt-8 text-[0.9375rem] leading-relaxed text-muted-foreground">
            L'ensemble des contenus de ce site — textes, photographies, marques et logos — est
            protégé. Les photographies des biens proposés sont diffusées par l'agence dans le cadre
            de ses mandats et ne peuvent être reproduites sans autorisation.
          </p>

          <span id="donnees-personnelles" className="mt-14 block" />
          <EnTeteSection plaque="Mention" titre="Données personnelles" />
          <p className="mesure-large mt-8 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Les informations transmises via les formulaires de contact et d'estimation servent
            uniquement à traiter votre demande et ne sont ni cédées ni revendues. Vous disposez
            d'un droit d'accès, de rectification, d'effacement et d'opposition, que vous pouvez
            exercer à l'adresse <a className="lien-trait" href={`mailto:${ADRESSE.email}`}>{ADRESSE.email}</a>{' '}
            ou par courrier au siège de l'agence. Une réclamation peut être adressée à la CNIL.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
);

export default MentionsLegales;
