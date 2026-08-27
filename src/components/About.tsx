import { ArrowRight } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Calage, Voile } from '@/components/systeme/Ouverture';
import { Button } from '@/components/ui/button';
import { ENTITES } from '@/config/legal';
import bureauImage from '@/assets/agence-bureau.webp';
import bureauImage800 from '@/assets/agence-bureau-800.webp';

/* Deux largeurs : l'image accompagne une colonne 7/12, elle ne dépasse jamais
   ~760 px. Le 1200 px pesait 111 Ko pour rien sous cette largeur. */
const bureauJeu = `${bureauImage800} 800w, ${bureauImage} 1200w`;
import { Lien } from '@/components/systeme/Lien';

/**
 * L'AGENCE.
 *
 * La travée est asymétrique — 5 / 7 — et non deux moitiés égales : deux colonnes
 * de même largeur n'établissent aucune hiérarchie, et c'est le réglage par
 * défaut de toutes les grilles. Ici le texte porte, l'image accompagne.
 *
 * Les deux dirigeants sont nommés, avec leur société et leur métier, repris de
 * `src/config/legal.ts` — donc du registre national des entreprises. C'est le
 * seul argument de confiance qu'une maison familiale de quinze ans peut avancer
 * sans inventer de chiffre, et c'est plus fort qu'un compteur de biens gérés :
 * un propriétaire qui confie un lot veut savoir à qui il le confie.
 */
const About = () => {
  return (
    <section id="agence" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto">
        <EnTeteSection
          plaque="L'agence"
          titre="Les mêmes personnes, depuis 2011"
          chapeau="Deux sociétés, une famille, un bureau. Le dossier de gérance et le dossier de syndic du même immeuble sont tenus dans la même pièce — c'est ce qui fait qu'un appel trouve une réponse au lieu d'un transfert."
        />

        {/* `items-center` et non `items-start` : la colonne de texte est plus
            courte que la photographie, et alignée en haut elle laissait 350 px
            de vide sous le bouton. Centrée, le blanc se répartit de part et
            d'autre et se lit comme une composition au lieu d'un trou. */}
        <div className="mt-16 grid items-center gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {/* Le registre des dirigeants. Filets horizontaux, chiffres
                tabulaires, capitales espacées : la mise en page d'un extrait
                Kbis plutôt que d'une carte « notre équipe » avec une photo
                ronde et un titre inventé. */}
            <dl className="border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {ENTITES.map((entite) => (
                <div
                  key={entite.siren}
                  className="border-b border-[hsl(var(--trait)/var(--trait-a))] py-5"
                >
                  <dt className="font-display text-[1.0625rem] font-semibold">
                    {entite.president}
                  </dt>
                  <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-muted-foreground">
                    {entite.role.replace(' — éditeur du site', '')}
                  </dd>
                  <dd className="tabulaire mt-2 font-display text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {entite.raisonSociale} · SIREN {entite.siren} · depuis{' '}
                    {entite.dateCreation.replace('1er janvier ', '').replace('17 juin ', '')}
                  </dd>
                </div>
              ))}
            </dl>

            <Voile delai={120}>
              <Button variant="outline" size="lg" className="mt-8" asChild>
                <Lien to="/equipe">
                  Rencontrer l'équipe
                  <ArrowRight aria-hidden />
                </Lien>
              </Button>
            </Voile>
          </div>

          <Voile delai={60} className="lg:col-span-7">
            <figure className="m-0">
              <Calage className="cadre aspect-[3/2] w-full">
                <div className="photo-editoriale h-full w-full">
                  <img
                    src={bureauImage}
                    srcSet={bureauJeu}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    alt="Le bureau de l'agence : dossiers de gérance et de syndic, plans, vue sur la rue"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Calage>
              <figcaption className="mt-4 flex gap-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                <span aria-hidden className="mt-[0.55rem] h-px w-6 shrink-0 bg-primary" />
                <span>
                  Le bureau, 27 rue de Lisbonne. Les dossiers de gérance et de syndic y sont
                  tenus par les mêmes personnes.
                </span>
              </figcaption>
            </figure>
          </Voile>
        </div>
      </div>
    </section>
  );
};

export default About;
