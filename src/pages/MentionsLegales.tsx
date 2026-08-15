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
  MEDIATEUR,
  legalIsIncomplete,
} from '@/config/legal';

/** Une valeur manquante se voit, elle ne se devine pas. */
const Value = ({ children }: { children: string | null }) =>
  children ? (
    <span>{children}</span>
  ) : (
    <span className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-medium text-destructive-ink">
      à compléter
    </span>
  );

const Row = ({ label, children }: { label: string; children: string | null }) => (
  <div className="flex flex-col gap-1 border-b border-border/60 py-3 sm:flex-row sm:gap-6">
    <dt className="w-full text-sm text-muted-foreground sm:w-64 sm:shrink-0">{label}</dt>
    <dd className="text-sm font-medium">
      <Value>{children}</Value>
    </dd>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="mb-4 text-xl font-bold">{title}</h2>
    <dl>{children}</dl>
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
    <Row label="Mentions de la carte">{entite.carteProfessionnelle.mentions.join(' · ')}</Row>
    <Row label="Garantie financière">{entite.garantieFinanciere.organisme}</Row>
    <Row label="Adresse du garant">{entite.garantieFinanciere.adresse}</Row>
    <Row label="Montant garanti">{entite.garantieFinanciere.montant}</Row>
    <Row label="Assurance RCP">{entite.assuranceRcp.assureur}</Row>
    <Row label="Numéro de contrat">{entite.assuranceRcp.contrat}</Row>
    <Row label="Couverture géographique">{entite.assuranceRcp.couvertureGeographique}</Row>
  </Section>
);

const MentionsLegales = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Mentions légales | JIP — Jobard Immobilier Paris"
      description="Mentions légales de l'agence J.I.P. — Jobard Immobilier Paris : éditeur, carte professionnelle, garantie financière, assurance et médiation de la consommation."
      canonicalUrl="https://www.adbjip.fr/mentions-legales"
    />
    <Header />

    <main role="main">
      <section className="border-b border-border/60 bg-gradient-subtle pt-32 pb-12">
        <div className="container mx-auto px-6">
          <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary">
            <Scale className="h-4 w-4" />
            Informations légales
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">Mentions légales</h1>
        </div>
      </section>

      <div className="container mx-auto max-w-3xl px-6 py-14">
        {legalIsIncomplete && (
          <div className="mb-10 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-sm leading-relaxed">
              <strong>Page incomplète, à ne pas mettre en ligne en l'état.</strong> Les mentions
              marquées « à compléter » sont obligatoires au titre de la loi Hoguet. Elles figurent
              sur la carte professionnelle et l'attestation de garantie financière de chacune des
              deux sociétés, et se renseignent dans <code>src/config/legal.ts</code>. Ce bandeau disparaît une fois
              tous les champs remplis.
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

        {/* Les deux sociétés exercent depuis la même adresse mais portent des
            activités distinctes, donc des cartes professionnelles distinctes :
            gestion pour J.I.P., transaction pour Patrimoine. */}
        {ENTITES.map((entite) => (
          <EntiteBlock key={entite.siren} entite={entite} />
        ))}

        <Section title="Médiation de la consommation">
          <Row label="Médiateur">{MEDIATEUR.nom}</Row>
          <Row label="Site">{MEDIATEUR.site}</Row>
          <Row label="Adresse">{MEDIATEUR.adresse}</Row>
        </Section>

        <Section title="Hébergement">
          <Row label="Hébergeur">{HEBERGEUR.nom}</Row>
          <Row label="Adresse">{HEBERGEUR.adresse}</Row>
          <Row label="Site">{HEBERGEUR.site}</Row>
        </Section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus de ce site — textes, photographies, marques et logos — est
            protégé. Les photographies des biens proposés sont diffusées par l'agence dans le cadre
            de ses mandats et ne peuvent être reproduites sans autorisation.
          </p>

          <h2 id="donnees-personnelles" className="text-xl font-bold text-foreground">Données personnelles</h2>
          <p>
            Les informations transmises via les formulaires de contact et d'estimation servent
            uniquement à traiter votre demande et ne sont ni cédées ni revendues. Vous disposez
            d'un droit d'accès, de rectification, d'effacement et d'opposition, que vous pouvez
            exercer à l'adresse <a className="text-primary-ink underline" href={`mailto:${ADRESSE.email}`}>{ADRESSE.email}</a>{' '}
            ou par courrier au siège de l'agence. Une réclamation peut être adressée à la CNIL.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
);

export default MentionsLegales;
