import Aiguillage from '@/components/systeme/Aiguillage';
import { Trait } from '@/components/systeme/Ouverture';
import Ferronnerie from '@/components/systeme/Ferronnerie';
import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';

/**
 * L'OUVERTURE — direction « La Plaque », 04/09/2026.
 *
 * Une page de dossier : la plaque de rue, le titre en romain, le chapeau, et à
 * droite la ferronnerie d'un garde-corps, DESSINÉE. Le titre est une adresse —
 * « deux métiers, une seule adresse » — et non un slogan.
 *
 * PLUS DE PHOTOGRAPHIE, ET C'EST UNE DÉCISION DU CLIENT (04/09/2026) : la
 * travée haussmannienne qui ouvrait le site était une image générée, et elle
 * faisait fausse. Le dessin (`Ferronnerie`) ne prétend rien ; le jour où le 27
 * rue de Lisbonne est photographié, il reprend cette colonne — le cadre est le
 * même.
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
          <em>Votre syndic aussi.</em>
        </h1>

        <p className="voile mesure-large mt-7 text-[1.0625rem] leading-[1.55] text-ardoise [animation-delay:180ms] sm:text-[1.1875rem]">
          Gérance locative et syndic de copropriété au 27, rue de Lisbonne. Depuis 2011,{' '}
          <strong className="font-semibold text-foreground">
            les mêmes personnes dans le même bureau
          </strong>{' '}
          — pas un standard, pas un numéro de dossier.
        </p>
      </div>

      {/* La ferronnerie, et la citation posée sur son bord — la phrase qui
          résume la maison, en romain, sur une carte de crème. Masquée sous lg. */}
      <figure className="relative m-0">
        <Ferronnerie className="aspect-[3/2] w-full lg:aspect-[4/5] lg:max-h-[min(42rem,70vh)]" />
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
