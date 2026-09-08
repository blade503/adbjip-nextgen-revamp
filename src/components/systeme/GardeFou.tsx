import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ADRESSE } from "@/config/legal";

/**
 * LE GARDE-FOU — ce que voit le visiteur quand une page ne peut pas s'afficher.
 *
 * Avant lui, une erreur de rendu ou un morceau de route introuvable laissait
 * une PAGE BLANCHE, sans un mot : c'est ce qu'a vu le client le 08/09/2026 sur
 * la préversion (voir `src/lib/chargement.ts` pour la cause). React démonte
 * tout l'arbre à la première exception non rattrapée ; une frontière d'erreur
 * est le seul endroit où la rattraper.
 *
 * L'écran est volontairement AUTONOME : ni en-tête ni pied de page, qui
 * pourraient être la cause de l'erreur et la reproduire. Les mêmes jetons de
 * la direction (crème, romain, marine), un rechargement en premier — c'est ce
 * qui répare le cas courant — et le numéro de l'agence en dernier recours,
 * parce qu'un visiteur qui n'arrive pas à lire une page peut encore appeler.
 *
 * `App.tsx` le remonte à chaque changement d'URL (`key`) : une erreur sur une
 * page ne doit pas condamner la suivante.
 */
interface ProprietesGardeFou {
  children: ReactNode;
}

interface EtatGardeFou {
  erreur: Error | null;
}

class GardeFou extends Component<ProprietesGardeFou, EtatGardeFou> {
  state: EtatGardeFou = { erreur: null };

  static getDerivedStateFromError(erreur: Error): EtatGardeFou {
    return { erreur };
  }

  componentDidCatch(erreur: Error, infos: ErrorInfo) {
    // La console est le seul journal du site : pas de télémétrie.
    console.error("[garde-fou]", erreur, infos.componentStack);
  }

  render() {
    if (!this.state.erreur) return this.props.children;

    return (
      <main id="contenu" tabIndex={-1} className="min-h-screen bg-pierre">
        <div className="container mx-auto max-w-[38rem] py-20 lg:py-28">
          <p className="gravure">Un problème est survenu</p>
          <h1 className="mesure mt-5 text-[clamp(2.25rem,5vw,3.5rem)]">
            La page n'a pas pu <em>s'afficher.</em>
          </h1>
          <p className="mesure-large mt-6 text-[1.0625rem] leading-[1.55] text-ardoise">
            Le site vient probablement d'être mis à jour pendant votre visite.
            Recharger la page suffit en général.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
            <Button size="lg" variant="secondary" asChild>
              {/* Un vrai lien, pas le routeur : on repart d'un document neuf. */}
              <a href="/">Retour à l'accueil</a>
            </Button>
          </div>
          <p className="mt-10 text-[0.9375rem] leading-[1.55] text-ardoise">
            Si le problème persiste, l'agence répond au{" "}
            <a
              href={`tel:${ADRESSE.telephone.replace(/[^0-9+]/g, "")}`}
              className="tabulaire whitespace-nowrap font-display font-semibold text-foreground"
            >
              {ADRESSE.telephone}
            </a>
            .
          </p>
        </div>
      </main>
    );
  }
}

export default GardeFou;
