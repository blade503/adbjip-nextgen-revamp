import { ArrowRight } from 'lucide-react';

import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Voile } from '@/components/systeme/Ouverture';
import { echelonner } from '@/lib/echelon';
import { questionsRepondues } from '@/config/questions';
import { Lien } from '@/components/systeme/Lien';

/**
 * LES QUESTIONS — la dernière marche avant le téléphone.
 *
 * Placée AVANT le rendez-vous, et c'est le point de la section : une question
 * sans réponse est une objection. Posée après la demande, la FAQ l'entérine ;
 * posée avant, elle la lève. C'est aussi la seule section qui gagne des
 * positions sur des requêtes de longue traîne — « comment changer de syndic »,
 * « honoraires gérance Paris ».
 *
 * `<details>` PLUTÔT QUE L'ACCORDÉON RADIX, qui est pourtant déjà dans le
 * projet. Trois raisons, et elles pèsent plus que la souplesse d'animation :
 *  - le contenu reste dans le DOM même replié, donc indexable et trouvable par
 *    la recherche du navigateur ;
 *  - il fonctionne sans JavaScript, ce qui compte sur des pages prérendues ;
 *  - il apporte gratuitement le comportement clavier attendu (Entrée, Espace)
 *    et l'état exposé aux technologies d'assistance.
 *
 * Un registre de rangées réglées, pas une pile de boîtes : la question doit se
 * lire REPLIÉE, parce que la plupart des visiteurs ne déplieront rien.
 *
 * La section ne rend rien tant qu'aucune réponse n'a été fournie par l'agence
 * (voir `src/config/questions.ts`). C'est le comportement de la section Avis :
 * mieux vaut une section absente qu'une section remplie de « à compléter ».
 */
const Questions = () => {
  if (questionsRepondues.length === 0) return null;

  return (
    <section id="questions" className="nuit grain relative bg-nuit py-20 text-pierre lg:py-28">
      <div className="container relative mx-auto">
        <EnTeteSection
          fond="nuit"
          plaque="Les questions"
          titre="Ce qu'on nous demande avant de nous confier un immeuble"
          chapeau="Une question sans réponse est une objection. Autant y répondre avant que vous ne décrochiez."
        />

        <ul className="mt-14 border-t border-pierre/15">
          {questionsRepondues.map((q, index) => (
            <Voile as="li" key={q.question} delai={echelonner(index)}>
              <details className="deroule group border-b border-pierre/15">
                <summary className="rasante flex cursor-pointer items-center justify-between gap-6 py-5">
                  {/* La question est en Archivo corps 17 : elle doit se tenir
                      seule, repliée, sans que le chevron soit nécessaire pour
                      comprendre de quoi il s'agit. */}
                  <span className="font-display text-[1.0625rem] font-semibold leading-snug">
                    {q.question}
                  </span>
                  <span aria-hidden className="chevron shrink-0" />
                </summary>

                <div className="deroule-corps pb-6">
                  <p className="mesure-large text-[0.9375rem] leading-relaxed text-pierre/85">
                    {q.reponse}
                  </p>

                  {q.action && (
                    <Lien
                      to={q.action.href}
                      className="lien-trait mt-5 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-primary"
                    >
                      {q.action.libelle}
                      <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                    </Lien>
                  )}
                </div>
              </details>
            </Voile>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Questions;
