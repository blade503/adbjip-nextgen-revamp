import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import EnTetePage from '@/components/systeme/EnTetePage';
import EnTeteSection from '@/components/systeme/EnTeteSection';
import { Lien } from '@/components/systeme/Lien';
import { Voile } from '@/components/systeme/Ouverture';
import { ADRESSE } from '@/config/legal';
import { echelonner } from '@/lib/echelon';

/**
 * Page 404.
 *
 * Elle porte l'en-tête et le pied de page, contrairement à la version
 * précédente : les redirections 301 depuis l'ancien Symfony ne sont pas encore
 * écrites (voir REPRISE.md § 3), cette page va donc recevoir du trafic réel
 * venu de liens vieux de huit ans. Un visiteur qui y arrive doit trouver la
 * navigation et le téléphone de l'agence, pas une impasse avec un seul lien.
 *
 * Elle suit le rythme des autres pages : ouverture sur le crème, titre ferré à
 * gauche sur la mesure, puis un registre de destinations sur le lin — les
 * mêmes rangées réglées que partout, parce que c'est le même geste : dire au
 * visiteur où aller.
 *
 * Trois destinations plutôt qu'une : un lien venu d'un moteur ou d'un ancien
 * signet visait presque toujours l'une des trois.
 *
 * `noindex` : une 404 ne doit pas entrer dans l'index. Le `follow` reste, pour
 * que les liens de l'en-tête soient tout de même suivis.
 */

const DESTINATIONS = [
  {
    libelle: 'Voir les biens',
    detail: 'Le portefeuille à vendre et à louer, repris chaque nuit du logiciel de gestion.',
    href: '/biens',
  },
  {
    libelle: 'Faire gérer mon bien',
    detail: 'Gérance locative : un mandat, un interlocuteur.',
    href: '/services/gestion-locative',
  },
  {
    libelle: "Contacter l'agence",
    detail: `${ADRESSE.telephone} · ${ADRESSE.rue}, ${ADRESSE.codePostal} ${ADRESSE.ville}`,
    href: '/contact',
  },
];

const NotFound = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.error("404 : route inexistante demandée —", pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Page introuvable — JIP, Jobard Immobilier Paris"
        description="Cette adresse n'existe pas ou n'existe plus. Les biens, les services et les coordonnées de l'agence sont accessibles depuis l'accueil."
        noindex
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        <EnTetePage
          surtitre="Erreur 404"
          titre="Cette page n'existe pas"
          chapeau="Le lien est peut-être ancien : le site a été refait. Voici où aller."
        />

        {/* ---- LES DESTINATIONS --------------------------------------- */}
        <section className="bg-lin py-16 lg:py-20">
          <div className="container mx-auto">
            <EnTeteSection
              plaque="Où aller"
              titre="Trois destinations"
              chapeau="Un lien venu d'un moteur ou d'un ancien signet visait presque toujours l'une des trois."
            />

            <ul className="mt-10 border-t border-[hsl(var(--trait)/var(--trait-a))]">
              {DESTINATIONS.map((destination, index) => (
                <Voile as="li" key={destination.href} delai={echelonner(index)}>
                  <Lien
                    to={destination.href}
                    className="rasante group flex items-center justify-between gap-6 border-b border-[hsl(var(--trait)/var(--trait-a))] py-5"
                  >
                    <span>
                      <span className="block font-serif text-[1.375rem] leading-[1.15]">
                        {destination.libelle}
                      </span>
                      <span className="tabulaire mt-1 block text-[0.875rem] text-muted-foreground">
                        {destination.detail}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-primary-ink transition-transform duration-4 ease-sortie group-hover:translate-x-1.5"
                    />
                  </Lien>
                </Voile>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
