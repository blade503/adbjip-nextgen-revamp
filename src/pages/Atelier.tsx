import { useState } from 'react';

import { Calage, Trait, Voile } from '@/components/systeme/Ouverture';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import PlaqueDeRue from '@/components/systeme/PlaqueDeRue';
import { echelonner } from '@/lib/echelon';
import { QUESTIONS, questionsIncompletes, questionsRepondues } from '@/config/questions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * L'ATELIER — planche de contrôle visuel du système.
 *
 * Chaque primitive et chaque composant une fois, sur les DEUX fonds, pour
 * qu'une régression se voie d'un coup d'œil au lieu de se découvrir sur une
 * page de production. C'est la référence à recharger après toute modification
 * de `src/index.css`.
 *
 * ACCESSIBLE EN DÉVELOPPEMENT SEULEMENT. Deux précautions, et les deux sont
 * nécessaires :
 *  - la route n'est montée que si `import.meta.env.DEV` — la page n'existe pas
 *    en production, où le chemin retombe sur la 404 ;
 *  - son chemin est dans une CONSTANTE et non écrit en clair dans l'attribut.
 *    `scripts/prerender.mjs` lit `App.tsx` au moyen d'une expression
 *    régulière sur l'attribut « path » des balises Route : un chemin littéral aurait été prérendu, aurait
 *    produit un onzième fichier dans `dist/` et aurait fait mentir le compteur
 *    « 10/10 » qui sert de repère. Le script est protégé, donc c'est ici qu'on
 *    s'adapte.
 */

const Case = ({
  titre,
  note,
  children,
}: {
  titre: string;
  note?: string;
  children: React.ReactNode;
}) => (
  <div className="panneau p-5">
    <p className="gravure">{titre}</p>
    {note && <p className="mt-2 text-[0.8125rem] text-muted-foreground">{note}</p>}
    <div className="mt-4 flex min-h-[5rem] flex-col justify-center gap-3">{children}</div>
  </div>
);

const Atelier = () => {
  // Remonter le sous-arbre est la seule façon honnête de rejouer les entrées :
  // l'observateur relâche chaque élément dès son passage, exprès, pour qu'une
  // animation ne se rejoue jamais au défilement.
  const [cle, setCle] = useState(0);

  const composants = (
    <>
      <Case titre="Bouton — plaque de laiton" note="Liseré gravé en ::after, 3 px de retrait. Marine sur laiton : 7,79:1.">
        <div className="flex flex-wrap gap-2">
          <Button>Confier un bien</Button>
          <Button variant="secondary">Changer de syndic</Button>
          <Button variant="outline">Rencontrer l'équipe</Button>
          <Button variant="ghost">Ignorer</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Petit</Button>
          <Button size="lg">Grand</Button>
        </div>
      </Case>

      <Case titre="Étiquette — plaque fine" note="Même géométrie, 2 px de retrait : à 18 px de haut, 3 px ne laissent plus de champ.">
        <div className="flex flex-wrap gap-2">
          <Badge>Vente</Badge>
          <Badge variant="secondary">Location</Badge>
          <Badge variant="outline">Nouveau</Badge>
        </div>
      </Case>

      <Case titre="Champ réglé" note="Pas de boîte : un filet en pied de champ qui passe au laiton. Tabulez pour voir l'anneau.">
        <label className="block">
          <span className="etiquette-champ">Le bien concerné</span>
          <Input placeholder="Arrondissement, surface…" />
        </label>
        <label className="block">
          <span className="etiquette-champ">Message</span>
          <Textarea rows={2} placeholder="L'immeuble et ce que vous attendez." />
        </label>
      </Case>

      <Case titre="Panneau" note="Filet de 1 px, rayon de 2 px, aucune ombre par défaut.">
        <Card className="p-4">
          <p className="text-sm">Un panneau, pas une carte flottante.</p>
        </Card>
      </Case>

      <Case titre="Cadre gravé + calage" note="Le liseré sur une image, et la pose depuis 1,05 à l'entrée.">
        <Calage className="cadre aspect-[3/1] w-full">
          <div className="h-full w-full bg-[linear-gradient(118deg,#1d2b40,rgba(241,167,39,.3))]" />
        </Calage>
      </Case>

      <Case titre="Lumière rasante" note="Survolez : lavis par la gauche, liseré réveillé, image à 1,03. Rien ne décolle.">
        <a href="#atelier" className="rasante group flex items-center gap-4 border-y border-[hsl(var(--trait)/var(--trait-a))] py-3">
          <Calage className="cadre aspect-[3/2] w-24 shrink-0">
            <div className="h-full w-full bg-[linear-gradient(118deg,#1d2b40,rgba(241,167,39,.3))]" />
          </Calage>
          <span className="text-sm">Gérance locative</span>
          <span aria-hidden className="ml-auto text-primary-ink transition-transform duration-4 ease-sortie group-hover:translate-x-1.5">→</span>
        </a>
      </Case>

      <Case titre="Filet du lien" note="Un seul comportement de lien sur tout le site.">
        <a href="#atelier" className="lien-trait w-fit text-[0.6875rem] font-semibold uppercase tracking-[0.13em]">
          Tout le portefeuille →
        </a>
      </Case>

      <Case titre="Voile — échelonné" note="Six frères au plus, 70 ms d'écart. Masqué en JS, et seulement sous le pli.">
        {[0, 1, 2].map((i) => (
          <Voile key={i} delai={echelonner(i)}>
            <span className="block h-6 w-full bg-[hsl(var(--trait)/0.14)]" />
          </Voile>
        ))}
      </Case>

      <Case titre="Trait" note="Se tire de la gauche, 800 ms. La ponctuation du site.">
        <Trait />
        <Trait />
      </Case>
    </>
  );

  return (
    <div id="atelier" className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="gravure">Atelier — développement uniquement</p>
            <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)]">
              Chaque primitive une fois, sur les deux fonds
            </h1>
          </div>
          <Button variant="outline" onClick={() => setCle((c) => c + 1)}>
            Rejouer les entrées
          </Button>
        </div>

        <div key={cle}>
          <EnTeteSection
            className="mt-12"
            plaque="Sur la pierre"
            titre="Fond clair — les jetons par défaut"
            chapeau="C'est l'état des pages de contenu et du portefeuille."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{composants}</div>

          {/* La même chose, sous portée `.nuit` : aucun composant n'est
              réécrit, ils suivent tous la bascule de jetons. C'est le seul
              test qui prouve que le mécanisme marche. */}
          <section className="nuit mt-16 bg-nuit p-6 text-pierre md:p-10">
            <EnTeteSection
              fond="nuit"
              plaque="Sur la nuit"
              titre="Fond sombre — la classe de portée"
              chapeau="Les mêmes composants, aucun réécrit : ils lisent les jetons rebasculés."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{composants}</div>

            {/* LES QUESTIONS, en attente.
                La section de production ne rend rien tant que l'agence n'a pas
                fourni ses réponses. Sans cet aperçu, l'attente serait invisible
                et on l'oublierait — une section absente ne réclame rien d'elle-
                même. Le marqueur « à fournir » ne sort jamais de l'atelier. */}
            <div className="mt-14">
              <p className="gravure">
                Les questions — {questionsRepondues.length}/{QUESTIONS.length} réponse(s) fournie(s)
                {questionsIncompletes && ' · SECTION MASQUÉE EN PRODUCTION'}
              </p>
              <ul className="mt-5 border-t border-pierre/15">
                {QUESTIONS.map((q) => (
                  <li key={q.question} className="border-b border-pierre/15">
                    <div className="rasante flex items-center justify-between gap-6 py-4">
                      <span className="font-display text-[1.0625rem] font-semibold leading-snug">
                        {q.question}
                      </span>
                      <span
                        className={`shrink-0 rounded-[1px] px-2 py-1 font-display text-[0.5625rem] font-semibold uppercase tracking-[0.13em] ${
                          q.reponse ? 'bg-primary text-primary-foreground' : 'bg-pierre/10 text-muted-foreground'
                        }`}
                      >
                        {q.reponse ? 'répondue' : 'à fournir'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-14">
              <p className="gravure">Plaque de rue</p>
              <div className="mt-4 flex flex-wrap items-end gap-6">
                <PlaqueDeRue />
                <PlaqueDeRue taille="moyenne" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Atelier;
