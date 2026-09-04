import Aiguillage from '@/components/systeme/Aiguillage';
import { Calage, Trait } from '@/components/systeme/Ouverture';
import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';
import travee800 from '@/assets/travee-lisbonne-800.webp';
import travee620 from '@/assets/travee-lisbonne-620.webp';
import travee440 from '@/assets/travee-lisbonne-440.webp';

/**
 * L'OUVERTURE — direction « La Plaque », 04/09/2026.
 *
 * Une page de dossier : la plaque de rue, le titre en romain, le chapeau, et
 * la travée d'entrée du 27 rue de Lisbonne à droite, à son format portrait. Le
 * titre est une adresse — « deux métiers, une seule adresse » — et non un
 * slogan.
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
 * LA PHOTO N'EST PAS AGRANDIE : le fichier fait 800 × 1080 et la colonne de
 * droite en fait au plus ~600. Sur téléphone elle passe en 3/2, sous le texte,
 * pour que le titre reste au-dessus du pli (mesuré sur la version précédente :
 * en 4/5 elle prenait 70 % d'un écran de 375).
 *
 * LE TEXTE EST CENTRÉ FACE À LA PHOTO, ET LA PHOTO EST BORNÉE À 70 % DE LA
 * HAUTEUR D'ÉCRAN. La planche calait le texte en bas de la colonne
 * (`items-end`) : sur un portable de 1440 × 830, la photo en 4/5 faisait
 * 760 px, le titre arrivait au ras du pli et le chapô passait dessous — vu à
 * l'écran le 04/09/2026. Bornée à `70vh`, la photo laisse le titre, le chapô
 * et le haut des trois cartes dans le premier écran.
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

      {/* La travée, et la citation posée sur son bord — la phrase qui résume
          la maison, en romain, sur une carte de crème. Masquée sous lg : sur
          téléphone la carte couvrirait la porte cochère. */}
      <figure className="relative m-0">
        <Calage className="aspect-[3/2] w-full lg:aspect-[4/5] lg:max-h-[min(42rem,70vh)]">
          <img
            src={travee800}
            srcSet={`${travee440} 440w, ${travee620} 620w, ${travee800} 800w`}
            sizes="(min-width: 64rem) 45vw, 100vw"
            alt="La travée d'entrée d'un immeuble haussmannien : porte cochère à fronton, deux lanternes, balcons en fonte ouvragée"
            width={800}
            height={1080}
            className="h-full w-full object-cover object-[50%_62%]"
            loading="eager"
            /* EN MINUSCULES : `fetchPriority` en camelCase n'est reconnu qu'à
               partir de React 19 — voir `src/types-react.d.ts`. */
            fetchpriority="high"
            decoding="sync"
          />
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
