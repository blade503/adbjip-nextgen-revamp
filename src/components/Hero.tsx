import Aiguillage from '@/components/systeme/Aiguillage';
import { Calage, Trait } from '@/components/systeme/Ouverture';
import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';
import porte4x5_480 from '@/assets/accueil-porte-4x5-480.webp';
import porte4x5_720 from '@/assets/accueil-porte-4x5-720.webp';
import porte4x5_1000 from '@/assets/accueil-porte-4x5-1000.webp';
import porte4x5_1229 from '@/assets/accueil-porte-4x5-1229.webp';
import porte3x2_640 from '@/assets/accueil-porte-3x2-640.webp';
import porte3x2_960 from '@/assets/accueil-porte-3x2-960.webp';
import porte3x2_1400 from '@/assets/accueil-porte-3x2-1400.webp';

/**
 * L'OUVERTURE — direction « La Plaque », 04/09/2026.
 *
 * Une page de dossier : la plaque de rue, le titre en romain, le chapeau, et à
 * droite une famille qui rentre par la porte cochère d'un immeuble en pierre
 * de taille. Le titre est une adresse — « deux métiers, une seule adresse » — et
 * non un slogan ; l'image dit la phrase de la carte posée dessus : « un appel
 * trouve une réponse au lieu d'un transfert ».
 *
 * L'IMAGE, ET SON HISTOIRE (04/09/2026). La travée qui ouvrait le site était
 * une image de banque générée, jugée fausse par le client ; un dessin
 * d'élévation l'a remplacée le temps d'un après-midi (il reste sur les trois
 * autres ouvertures, `Ferronnerie`). Celle-ci est la troisième génération du
 * client (Gemini), choisie après deux essais : un seul immeuble, des voisins
 * différents, pas de voiture d'époque, pas de plaque, pas de texte, et de la
 * vie en indices — l'homme de dos, les deux pigeons, le rideau, le vélo, les
 * feuilles. Recadrée en 4/5 sur la porte pour la colonne de bureau (le câble
 * aérien et la voiture sont hors champ), en 3/2 sur l'immeuble entier sous le
 * titre pour téléphone et tablette : deux cadrages, donc `<picture>` et non un
 * seul fichier recoupé par `object-fit`, qui aurait décapité l'homme sur
 * téléphone. Sept fichiers WebP produits avec sharp depuis le JPEG d'origine
 * (2816 × 1536) : qualité 80 jusqu'à 960 px, 74 au-delà — les grandes
 * variantes ne servent qu'aux écrans Retina de bureau, où elles sont réduites
 * à l'affichage ; −23 % de poids sur les neuf grandes variantes des quatre
 * ouvertures (1 794 → 1 380 Ko), relevé le 08/09/2026.
 *
 * REMPLACÉE LE 20/10/2026 par une nouvelle génération du client (Gemini) : une
 * mère et ses trois enfants casqués, en vélo-cargo, devant la porte cochère
 * ouverte. La source (1844 × 2304) est déjà en 4/5 : les quatre variantes de
 * bureau ne sont que réduites. Le 3/2 du téléphone n'est PAS centré, la famille
 * est au pied de l'image : bande de 1229 px prise à 1040 px du haut, qui garde
 * la porte, le trottoir et les volets du rez-de-chaussée. Mêmes noms de
 * fichiers, mêmes qualités.
 *
 * C'est une image générée et l'immeuble n'existe pas : le client le sait et
 * l'a choisi. Une photographie du 27 rue de Lisbonne reste préférable.
 *
 * PAS DE BOUTONS DANS L'OUVERTURE, et c'est le point de la direction. La
 * version précédente posait « Confier un bien » et « Changer de syndic » côte
 * à côte, sans savoir à qui elle parlait. Ici le visiteur lit d'abord, puis se
 * reconnaît dans l'une des trois cartes — bailleur, conseil syndical, vendeur
 * — juste dessous. Le numéro, lui, est dans l'en-tête à toutes les largeurs,
 * et dans la barre d'appel sur téléphone.
 *
 * L'ouverture éclairée à cinq plans de la version « Le hall » (heures, relief,
 * lanternes, seuil) a été retirée avec la coquille de nuit : elle était
 * conçue pour un fond sombre et ses raccords fondaient vers le noir. Le point
 * d'ouverture de l'agence, qui était la seule information qu'elle portait,
 * vit désormais à côté du numéro dans l'en-tête.
 *
 * LE TEXTE EST CENTRÉ FACE AU VISUEL, ET LE VISUEL EST BORNÉ À 70 % DE LA
 * HAUTEUR D'ÉCRAN : sur un portable de 1440 × 830 la version précédente
 * plaçait le titre au ras du pli et le chapô dessous — mesuré, corrigé.
 */
const Hero = () => (
  <section id="ouverture" className="bg-pierre">
    <div className="container mx-auto grid gap-x-16 gap-y-10 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20 lg:pt-12">
      <div className="max-w-[38rem]">
        <div className="voile">
          <PlaqueDeRue />
        </div>

        <h1 className="voile mt-9 text-[clamp(2.75rem,6.6vw,5.25rem)] [animation-delay:90ms]">
          Votre immeuble a une adresse.
          <br />
          {/* « Syndic » → « gestionnaire », retour papier du client du
              12/10/2026 : le titre parle aussi au bailleur, pas seulement au
              conseil syndical. */}
          <em>Votre gestionnaire aussi.</em>
        </h1>

        {/* 1978, et non 2011 : 2011 est la création de la SAS J.I.P. au
            registre ; le cabinet Jobard existe depuis 1978 (retour du client,
            12/10/2026). L'énumération, dans l'ordre du client (20/10/2026),
            depuis que Patrimoine est la seule société et porte tous les métiers. */}
        <p className="voile mesure-large mt-7 text-[1.0625rem] leading-[1.55] text-ardoise [animation-delay:180ms] sm:text-[1.1875rem]">
          Administration de biens, gérance locative, syndic de copropriété, vente et estimation
          au 27, rue de Lisbonne.{' '}
          <strong className="font-semibold text-foreground">
            Depuis 1978, le cabinet Jobard vous accompagne.
          </strong>
        </p>
      </div>

      {/* La porte, et la citation posée sur son bord — la phrase qui résume la
          maison, en romain, sur une carte de crème. Masquée sous lg. */}
      <figure className="relative m-0">
        <Calage className="aspect-[3/2] w-full bg-lin lg:aspect-[4/5] lg:max-h-[min(42rem,70vh)]">
          <picture>
            <source
              media="(min-width: 64rem)"
              srcSet={`${porte4x5_480} 480w, ${porte4x5_720} 720w, ${porte4x5_1000} 1000w, ${porte4x5_1229} 1229w`}
              sizes="(min-width: 90rem) 620px, 45vw"
            />
            <img
              src={porte3x2_960}
              srcSet={`${porte3x2_640} 640w, ${porte3x2_960} 960w, ${porte3x2_1400} 1400w`}
              sizes="100vw"
              alt="Une femme en parka et ses trois enfants casqués, à bord d'un vélo-cargo, devant la porte cochère en bois ouverte d'un immeuble haussmannien en pierre de taille ; au-dessus, un balcon filant en fonte."
              width={1229}
              height={1536}
              /* Point d'appui à 85 % de la hauteur sur bureau : borné à 70 vh,
                 le cadre 4/5 devient presque carré (581 px de haut sur un
                 portable de 1440 × 830) et un recadrage centré coupait la
                 famille, qui est au pied de l'image, à mi-jambes. */
              className="h-full w-full object-cover lg:object-[50%_85%]"
              loading="eager"
              /* EN MINUSCULES : `fetchPriority` en camelCase n'est reconnu qu'à
                 partir de React 19 — voir `src/types-react.d.ts`. */
              fetchpriority="high"
              decoding="sync"
            />
          </picture>
        </Calage>
        <figcaption className="absolute -left-7 bottom-6 hidden max-w-[17.5rem] border border-[hsl(var(--trait)/var(--trait-a))] bg-pierre px-5 py-4 font-serif text-[1.0625rem] leading-[1.35] lg:block">
          « Un appel trouve une réponse au lieu d'un transfert. »
        </figcaption>
      </figure>
    </div>

    {/* ---- L'AIGUILLAGE --------------------------------------------- */}
    <div className="container mx-auto pb-16 lg:pb-20">
      <div className="mb-5 flex items-baseline gap-5">
        <p className="gravure shrink-0">Vous êtes</p>
        <Trait className="min-w-0 flex-1 self-center" />
      </div>
      <Aiguillage />
    </div>
  </section>
);

export default Hero;
