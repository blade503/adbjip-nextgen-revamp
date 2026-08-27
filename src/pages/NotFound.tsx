import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Lien } from '@/components/systeme/Lien';

/**
 * Page 404.
 *
 * Elle porte l'en-tête et le pied de page, contrairement à la version
 * précédente : les redirections 301 depuis l'ancien Symfony ne sont pas encore
 * écrites (voir REPRISE.md § 3), cette page va donc recevoir du trafic réel
 * venu de liens vieux de huit ans. Un visiteur qui y arrive doit trouver la
 * navigation et le téléphone de l'agence, pas une impasse avec un seul lien.
 *
 * `noindex` : une 404 ne doit pas entrer dans l'index. Le `follow` reste, pour
 * que les liens de l'en-tête soient tout de même suivis.
 */
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
      <main id="contenu" tabIndex={-1} className="bg-muted/40 py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="plaque mb-6">Erreur 404</p>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Cette page n'existe pas</h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Le lien est peut-être ancien : le site a été refait. Voici où aller.
            </p>

            {/* Trois destinations plutôt qu'une : un lien venu d'un moteur ou
                d'un ancien signet visait presque toujours l'une des trois. */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Lien to="/biens">Voir les biens</Lien>
              </Button>
              <Button variant="outline" className="bg-background" asChild>
                <Lien to="/services/gestion-locative">Faire gérer mon bien</Lien>
              </Button>
              <Button variant="outline" className="bg-background" asChild>
                <Lien to="/contact">Contacter l'agence</Lien>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
