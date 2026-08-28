import { ArrowRight, Phone } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import CarteLocalisation from '@/components/CarteLocalisation';
import FormulaireContact from '@/components/FormulaireContact';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ADRESSE, HORAIRES } from '@/config/legal';
import { echelonner } from '@/lib/echelon';

/**
 * CONTACT — recomposée dans le langage de la charte.
 *
 * LE FORMULAIRE N'EST PAS TOUCHÉ. `FormulaireContact` a été refait à l'étape 08
 * (champs réglés, leurre, mention RGPD au point d'écriture, `role="status"` sur
 * le retour d'envoi, repli mailto) et il est déjà à la charte. Cette page ne
 * change que ce qui l'entoure.
 *
 * CE QUI A CHANGÉ. Relevé avant : 15 vestiges — 5 `glass`, 3 `hover-lift`,
 * 2 `shadow-card`, 2 `text-center`, 1 `gradient-text`, 1 gélule,
 * 1 `bg-gradient-subtle`.
 *
 *  - l'ouverture claire et centrée → bande de nuit, plaque vissée, titre ferré
 *    à gauche sur la mesure. Le mot « projet » n'est plus en laiton : le laiton
 *    ne fait que 1,81:1 sur la pierre, il reste sur la plaque où il est mesuré.
 *  - les quatre cartes de coordonnées à carré d'icône coloré → une liste de
 *    définition réglée, comme celle du pied de page. Quatre pastilles de laiton
 *    empilées étaient le décor le plus daté de la page.
 *  - `glass` sur la carte et sur un bouton → `.cadre`, liseré gravé.
 *  - « Notre localisation » centré → en-tête de section ferré à gauche.
 *
 * CE QUI EST CONSERVÉ TEL QUEL : le `title` de l'iframe et le lien « Passer la
 * carte », ajoutés à la passe d'accessibilité — l'iframe Google consomme quatre
 * tabulations qu'on ne peut pas réduire, et n'avait aucun nom accessible.
 */

/** Les quatre coordonnées, libellés et valeurs inchangés. */
const COORDONNEES = [
  { intitule: 'Téléphone', valeur: ADRESSE.telephone, precision: HORAIRES.semaine },
  { intitule: 'Courriel', valeur: ADRESSE.email, precision: 'Réponse sous 24 h' },
  { intitule: 'Adresse', valeur: ADRESSE.rue, precision: `${ADRESSE.codePostal} ${ADRESSE.ville}` },
  { intitule: 'Horaires', valeur: HORAIRES.detail, precision: 'Lundi au vendredi' },
];

const Contact = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact — JIP, Jobard Immobilier Paris"
        description="Écrivez à l'agence ou appelez le 01 42 25 78 24. 27 rue de Lisbonne, 75008 Paris. Réponse sous 24 heures ouvrées."
        keywords="contact jip, agence immobilière paris 8, 27 rue de lisbonne, syndic paris contact"
        canonicalUrl="https://www.adbjip.fr/contact"
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        {/* ---- OUVERTURE ---------------------------------------------- */}
        <section className="nuit grain bg-nuit pb-16 pt-32 text-pierre">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              niveau="h1"
              plaque="Contactez-nous"
              titre="Parlons de votre projet"
              chapeau="Gestion de votre bien, syndic de votre immeuble ou estimation : écrivez-nous ou appelez l'agence. Un interlocuteur vous répond sous 24 heures ouvrées."
            />

            <Voile delai={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#formulaire">
                  Remplir le formulaire
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
            </Voile>
          </div>
        </section>

        {/* ---- LE FORMULAIRE ET LES COORDONNÉES -----------------------
            Travée 7 / 5 : le formulaire porte, les coordonnées accompagnent.
            Deux moitiés égales n'établissaient aucune hiérarchie. */}
        <section id="formulaire" className="scroll-mt-28 bg-background py-20 lg:py-28">
          <div className="container mx-auto">
            <div className="grid gap-x-16 gap-y-14 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <EnTeteSection plaque="Nous écrire" titre="Formulaire de contact" />
                <Voile delai={90} className="mt-10">
                  <FormulaireContact idPrefix="page" />
                </Voile>
              </div>

              <div className="lg:col-span-5">
                <EnTeteSection plaque="Nous joindre" titre="Informations de contact" />
                {/* Liste de définition réglée, comme au pied de page. Un seul
                    niveau de `div` dans le `dl` : la spécification n'en admet
                    pas deux, et l'icône n'a pas sa place entre `dl` et `dt`. */}
                <dl className="mt-10 border-t border-[hsl(var(--trait)/var(--trait-a))]">
                  {COORDONNEES.map((c, index) => (
                    <Voile
                      key={c.intitule}
                      delai={echelonner(index)}
                      className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-5"
                    >
                        <dt className="tabulaire font-display text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary-ink">
                          {c.intitule}
                        </dt>
                        <dd className="mt-2 text-[1.0625rem]">
                          {c.intitule === 'Téléphone' ? (
                            <a href={tel} className="lien-trait tabulaire font-display">
                              {c.valeur}
                            </a>
                          ) : c.intitule === 'Courriel' ? (
                            <a href={`mailto:${ADRESSE.email}`} className="lien-trait">
                              {c.valeur}
                            </a>
                          ) : (
                            c.valeur
                          )}
                          <span className="mt-1 block text-[0.875rem] text-muted-foreground">
                            {c.precision}
                          </span>
                        </dd>
                    </Voile>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ---- LA LOCALISATION ---------------------------------------- */}
        <section className="bg-ivoire py-20 lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Y venir"
              titre="Notre localisation"
              chapeau="Venez nous rendre visite dans notre agence parisienne."
            />

            <Voile delai={120} className="mt-14">
              <CarteLocalisation />
            </Voile>
          </div>
        </section>

        {/* ---- LE RAPPEL ---------------------------------------------- */}
        <section className="nuit grain bg-nuit py-20 text-pierre lg:py-28">
          <div className="container mx-auto">
            <EnTeteSection
              fond="nuit"
              plaque="Ou simplement"
              titre="Appelez, on décroche"
              chapeau="Pas de standard, pas de numéro de dossier : la personne qui répond est celle qui suivra votre dossier."
            />

            <Voile delai={120} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href={tel}>
                  <Phone aria-hidden />
                  {ADRESSE.telephone}
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Lien to="/services/estimation-biens">
                  Estimer mon bien
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
            </Voile>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
