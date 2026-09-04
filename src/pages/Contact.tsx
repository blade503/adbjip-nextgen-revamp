import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import CarteLocalisation from '@/components/CarteLocalisation';
import FormulaireContact from '@/components/FormulaireContact';
import { TEL } from '@/components/systeme/BoutonTelephone';
import EnTetePage from '@/components/systeme/EnTetePage';
import { Voile } from '@/components/systeme/Ouverture';
import { ADRESSE, HORAIRES } from '@/config/legal';

/**
 * CONTACT — planche 2h de la direction « La Plaque ».
 *
 * Le formulaire porte la page (colonne large) ; à droite, le numéro sur un
 * bloc de marine, les coordonnées, et la carte — chargée au clic seulement,
 * comme avant (`CarteLocalisation`).
 *
 * Le titre est celui de la conversion de la page d'accueil : « Parlons de
 * votre lot, ou de votre immeuble. » — la même phrase à l'endroit où l'on
 * arrive quand on l'a suivie.
 *
 * Pas de barre d'appel fixe ici : le numéro est déjà le premier bloc de la
 * colonne de droite, une barre le doublerait et couvrirait le formulaire.
 */
const Contact = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Contact — JIP, Jobard Immobilier Paris"
      description="Écrivez à l'agence ou appelez le 01 42 25 78 24. 27 rue de Lisbonne, 75008 Paris. Réponse sous 24 heures ouvrées."
      keywords="contact jip, agence immobilière paris 8, 27 rue de lisbonne, syndic paris contact"
      canonicalUrl="https://www.adbjip.fr/contact"
    />
    <Header />
    <main id="contenu" tabIndex={-1}>
      <EnTetePage
        surtitre="Contact"
        titre={
          <>
            Parlons de votre lot, <em>ou de votre immeuble.</em>
          </>
        }
        className="pb-8 lg:pb-10"
      />

      <section id="formulaire" className="scroll-mt-24 bg-pierre pb-16 lg:pb-20">
        <div className="container mx-auto grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
          <Voile delai={90}>
            <FormulaireContact idPrefix="page" />
          </Voile>

          <div className="space-y-4">
            {/* ---- Le numéro ------------------------------------------ */}
            <Voile delai={150} className="nuit bg-marine p-7 text-pierre">
              <p className="gravure">Ou simplement, appelez</p>
              <a
                href={TEL}
                className="tabulaire mt-3 block font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-none tracking-[-0.01em] text-primary transition-colors duration-3 hover:text-primary-glow"
              >
                {ADRESSE.telephone}
              </a>
              <p className="tabulaire mt-4 text-[0.8125rem] leading-[1.6] text-muted-foreground">
                {HORAIRES.jours}, {HORAIRES.detail}
                <br />
                Pas de standard : la personne qui répond est celle qui suivra votre dossier.
              </p>
            </Voile>

            {/* ---- Les coordonnées ------------------------------------ */}
            <Voile delai={210} className="panneau p-7">
              <p className="gravure">Nous joindre</p>
              <dl className="mt-3 space-y-3 text-[0.875rem] leading-[1.6] text-ardoise">
                <div>
                  <dt className="sr-only">Adresse</dt>
                  <dd>
                    <strong className="font-semibold text-foreground">
                      {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
                    </strong>
                    <br />
                    {ADRESSE.metro}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Courriel</dt>
                  <dd>
                    <a href={`mailto:${ADRESSE.email}`} className="lien-trait font-semibold text-foreground">
                      {ADRESSE.email}
                    </a>
                    <br />
                    Réponse sous 24 heures ouvrées
                  </dd>
                </div>
              </dl>
            </Voile>

            {/* ---- La carte, à la demande ----------------------------- */}
            <Voile delai={270}>
              <CarteLocalisation />
            </Voile>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Contact;
