import { useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ADRESSE } from '@/config/legal';

/**
 * LA CARTE, DEVENUE EXPLICITE — 28/08/2026.
 *
 * L'iframe Google Maps était chargé d'emblée, et deux plaques étaient posées
 * PAR-DESSUS. Trois défauts relevés à l'écran, pas déduits :
 *
 *  1. Les plaques masquaient le bouton « Ouvrir dans Google Maps » ET la mention
 *     « Données cartographiques · Conditions d'utilisation » en bas du cadre.
 *     Or les conditions de Google interdisent précisément de masquer cette
 *     attribution. Elles passent donc en LÉGENDE SOUS le cadre.
 *  2. La carte arrivait en couleurs Google — violets, verts, jaunes — au milieu
 *     d'une page de pierre et de nuit. C'était le seul élément du site qui avait
 *     l'air collé. On ne peut pas la recolorer : restyler l'imagerie d'un embed
 *     est interdit par ces mêmes conditions. On peut en revanche ne pas
 *     l'imposer.
 *  3. L'iframe consomme quatre tabulations au clavier, et charge des serveurs
 *     tiers avant que le visiteur n'ait rien demandé. Sur un site français, cette
 *     seconde partie n'est pas un détail : la CNIL considère le chargement
 *     automatique de Google Maps comme un transfert de données vers un tiers.
 *
 * D'où ce dispositif : un cadre de la charte qui donne l'adresse, le métro et un
 * lien sortant, et un bouton pour afficher la carte si le visiteur la veut. Les
 * quatre tabulations et la connexion à Google n'existent qu'à partir de là.
 *
 * Ce que l'on perd : la carte n'est plus visible au premier coup d'œil. Ce que
 * l'on garde : l'adresse, le métro et l'itinéraire, qui sont l'information que
 * la carte servait à donner.
 */

/** L'itinéraire chez Google, sans embed : une simple recherche d'adresse. */
const LIEN_ITINERAIRE = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ADRESSE.rue} ${ADRESSE.codePostal} ${ADRESSE.ville}`,
)}`;

/**
 * L'URL de l'embed est celle qui était en place, inchangée : elle encode le
 * cadrage et le niveau de zoom relevés pour cette adresse.
 */
const SRC_CARTE =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.284893470584!2d2.3122!3d48.8794' +
  '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc9c9b4a5a3%3A0x0!2s27%20rue%20de' +
  '%20Lisbonne%2C%2075008%20Paris!5e0!3m2!1sfr!2sfr!4v1700000000000';

const CarteLocalisation = () => {
  const [affichee, setAffichee] = useState(false);

  return (
    <>
      <div className="cadre relative h-80 overflow-hidden bg-marine">
        {affichee ? (
          <>
            {/**
             * CONTOURNEMENT DE LA CARTE.
             *
             * Mesuré au clavier : l'iframe consomme QUATRE tabulations
             * consécutives — ses commandes internes appartiennent à Google, on ne
             * peut pas les réduire. Sans échappatoire, un visiteur au clavier
             * traverse quatre arrêts qui ne correspondent à aucune action de sa
             * part, alors que l'adresse est donnée en texte juste au-dessus.
             *
             * Il n'existe QUE si la carte est affichée : avant, il n'y a rien à
             * contourner, et un lien d'évitement qui n'évite rien est du bruit.
             */}
            <a
              href="#apres-carte"
              className="sr-only rounded-[2px] bg-nuit px-4 py-2 font-display text-sm text-pierre focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20"
            >
              Passer la carte
            </a>
            <iframe
              /* Un iframe SANS nom accessible est annoncé « cadre » et rien de
                 plus. Celui-ci n'en avait aucun — relevé au clavier. */
              title={`Carte de localisation de l'agence JIP, ${ADRESSE.rue}, ${ADRESSE.ville} 8e`}
              src={SRC_CARTE}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </>
        ) : (
          /* L'attente, dans la matière du site. Ferré à gauche comme tout le
             reste : rien n'est centré sur ce site sauf la plaque de rue. */
          <div className="nuit absolute inset-0 flex flex-col justify-center gap-5 px-6 sm:px-10">
            <p className="flex items-center gap-2.5 font-display text-[1.0625rem] font-semibold text-pierre">
              <MapPin aria-hidden className="h-5 w-5 shrink-0 text-primary" />
              {ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => setAffichee(true)}>
                Afficher la carte
              </Button>
              <Button variant="outline" asChild>
                <a href={LIEN_ITINERAIRE} target="_blank" rel="noopener noreferrer">
                  Itinéraire
                  <ExternalLink aria-hidden className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="mesure text-[0.8125rem] text-muted-foreground">
              La carte est fournie par Google. L'afficher établit une connexion à ses serveurs.
            </p>
          </div>
        )}
      </div>

      {/* LES DEUX PLAQUES, EN LÉGENDE ET NON EN SURIMPRESSION. Elles étaient
          posées sur le cadre, où elles couvraient les commandes de la carte et
          son attribution obligatoire. Ici elles se lisent, et ne cachent rien. */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* L'adresse n'apparaît ici QUE si la carte occupe le cadre : sinon elle
            est déjà le titre du cadre, et la répéter deux fois à trois
            centimètres d'écart ne renseigne personne. */}
        {affichee && (
          <p className="plaque-pierre plaque">
            {ADRESSE.rue} — {ADRESSE.codePostal}
          </p>
        )}
        <p className="plaque-pierre plaque">Métro Miromesnil — 2 min à pied</p>
      </div>

      {/* Cible du contournement : le premier contenu après la carte. */}
      <span id="apres-carte" tabIndex={-1} />
    </>
  );
};

export default CarteLocalisation;
