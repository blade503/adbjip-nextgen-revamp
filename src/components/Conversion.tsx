import { ArrowRight, Clock, Mail, MapPin } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { ADRESSE, HORAIRES } from '@/config/legal';
import { Lien } from '@/components/systeme/Lien';

/**
 * LA CONVERSION — la seule demande du site.
 *
 * L'objectif est UN ENTRETIEN DE MANDAT : un propriétaire qui veut confier un
 * lot en gérance, un conseil syndical qui veut changer de syndic. C'est le
 * revenu récurrent de la maison, et donc le seul indicateur qui compte —
 * pas les visites, pas les téléchargements, pas les « estimations gratuites ».
 *
 * LE TÉLÉPHONE EST L'OBJET PRINCIPAL, et c'est un choix, pas un manque
 * d'ambition technique. La clientèle d'une gérance parisienne est composée de
 * propriétaires de 50 à 80 ans et de conseils syndicaux : ils appellent. Le
 * numéro est donc composé à l'échelle d'un titre, en chiffres tabulaires, comme
 * un numéro gravé sur une plaque de cuivre — et non relégué en corps 12 dans un
 * pied de page. Les horaires sont juste dessous parce qu'un numéro sans
 * horaires produit un appel dans le vide et une mauvaise première impression.
 *
 * LE PRÉ-TRIAGE remplace le formulaire long. Trois profils, trois liens, et le
 * service arrive présélectionné dans le formulaire de /contact (paramètre
 * `?service=`). Un visiteur ne remplit pas un formulaire de sept champs au
 * milieu d'une page d'accueil ; il accepte de dire qui il est en un clic.
 */

const PROFILS = [
  {
    libelle: 'Propriétaire bailleur',
    detail: "Je veux confier un lot ou un immeuble en gérance.",
    service: 'gestion-locative',
  },
  {
    libelle: 'Conseil syndical',
    detail: 'Nous cherchons un syndic pour notre copropriété.',
    service: 'gestion-copropriete',
  },
  {
    libelle: 'Vendeur ou acquéreur',
    detail: 'Je veux vendre, acheter ou faire estimer un bien.',
    service: 'achats-ventes',
  },
];

const Conversion = () => {
  const tel = `tel:${ADRESSE.telephone.replace(/[^0-9+]/g, '')}`;

  return (
    <section id="contact" className="nuit grain relative bg-nuit pb-20 pt-4 text-pierre lg:pb-28">
      <div className="container relative mx-auto">
        <EnTeteSection
          fond="nuit"
          plaque="Prendre rendez-vous"
          titre={
            <>
              Parlons de votre lot,
              <br />
              ou de votre immeuble.
            </>
          }
        />

        <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-12">
          {/* ---- Le numéro ---------------------------------------- */}
          <Voile className="lg:col-span-5">
            <p className="gravure">Appeler l'agence</p>
            <a
              href={tel}
              className="tabulaire mt-5 block font-display text-[clamp(1.875rem,4.4vw,2.75rem)] font-semibold leading-none tracking-[-0.015em] text-primary transition-colors duration-3 hover:text-primary-glow"
            >
              {ADRESSE.telephone}
            </a>

            {/* UN SEUL NIVEAU DE `div` DANS UN `dl`.
                La spécification n'admet comme enfant direct de `dl` qu'un `div`
                groupant un ou plusieurs `dt` suivis d'un ou plusieurs `dd`. La
                structure précédente était `dl > div > div > dt`, avec l'icône en
                frère du groupe : deux niveaux, donc invalide, et une icône n'a de
                toute façon pas sa place entre `dl` et `dt`.
                Relevé par Lighthouse (`dlitem` et `definition-list`, 14 éléments sur
                l'accueil). Ma passe d'accessibilité l'avait manqué : je vérifiais
                les contrastes, le focus et le clavier, pas la validité du balisage.
                L'icône vit maintenant DANS le `dd`. */}
            <dl className="mt-8 space-y-4 border-t border-pierre/15 pt-6 text-[0.875rem]">
              <div>
                <dt className="sr-only">Horaires</dt>
                <dd className="flex gap-3 tabulaire">
                  <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{HORAIRES.jours}, {HORAIRES.detail}</span>
                </dd>
              </div>
              {/* L'adresse a sa place ici et pas seulement dans le pied de
                  page : la section s'intitule « prendre rendez-vous », et un
                  rendez-vous se prend quelque part. Elle comble en outre la
                  colonne, qui s'arrêtait 200 px avant la fin de la rangée. */}
              <div>
                <dt className="sr-only">Adresse</dt>
                <dd className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
                    <span className="mt-1 block text-muted-foreground">
                      Métro Villiers ou Europe, ligne 3.
                    </span></span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Courriel</dt>
                <dd className="flex gap-3">
                  <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><a href={`mailto:${ADRESSE.email}`} className="lien-trait">
                      {ADRESSE.email}
                    </a>
                    <span className="mt-1 block text-muted-foreground">
                      Réponse sous 24 heures ouvrées.
                    </span></span>
                </dd>
              </div>
            </dl>
          </Voile>

          {/* ---- Le pré-triage ------------------------------------ */}
          <div className="lg:col-span-7">
            <p className="gravure">Ou nous écrire — vous êtes</p>

            <ul className="mt-5 border-t border-pierre/15">
              {PROFILS.map((profil, index) => (
                <Voile as="li" key={profil.service} delai={echelonner(index)}>
                  <Lien
                    to={`/contact?service=${profil.service}`}
                    className="rasante group flex items-center justify-between gap-6 border-b border-pierre/15 py-5"
                  >
                    <span>
                      <span className="block font-display text-[1.0625rem] font-semibold">
                        {profil.libelle}
                      </span>
                      <span className="mt-1 block text-[0.875rem] text-muted-foreground">
                        {profil.detail}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-primary transition-transform duration-4 ease-sortie group-hover:translate-x-1.5"
                    />
                  </Lien>
                </Voile>
              ))}
            </ul>

            <p className="mt-6 text-[0.8125rem] text-muted-foreground">
              Le service arrive présélectionné dans le formulaire : quatre champs à remplir,
              pas sept.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conversion;
