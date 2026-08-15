import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main role="main" className="flex min-h-screen items-center justify-center bg-muted/40 px-6">
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-ink">
          Erreur 404
        </p>
        <h1 className="mb-4 text-4xl font-bold">Cette page n'existe pas</h1>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          Le lien est peut-être ancien : le site a été refait. Nos biens, nos services et nos
          coordonnées sont accessibles depuis l'accueil.
        </p>
        <a
          href="/"
          className="inline-flex items-center rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Retour à l'accueil
        </a>
      </div>
    </main>
  );
};

export default NotFound;
