import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Metiers from '@/components/Metiers';
import AvisGoogle from '@/components/AvisGoogle';
import BiensApercu from '@/components/BiensApercu';
import Questions from '@/components/Questions';
import Conversion from '@/components/Conversion';
import Footer from '@/components/Footer';
import BarreAppel from '@/components/systeme/BarreAppel';
import { questionsRepondues } from '@/config/questions';

/**
 * L'ordre des sections est celui de l'arborescence de la direction « La
 * Plaque » (planche 2a) : « hero · aiguillage par profil · 4 métiers ·
 * portefeuille · avis · contact ».
 *
 *   1. Ouverture ........ crème   la plaque, l'adresse, la travée
 *   2. Vous êtes ........ crème   trois cartes, trois visiteurs
 *   3. Métiers .......... lin     le registre des quatre métiers
 *   4. Portefeuille ..... crème   les biens, en couleurs vraies
 *   5. Avis ............. lin     la preuve
 *   6. Questions ........ crème   (masquée tant que l'agence n'a pas répondu)
 *   7. Rendez-vous ...... marine  la demande, une seule
 *   8. Pied de page ..... crème
 *
 * La présentation de l'agence a quitté l'accueil : elle a sa page (/agence),
 * fusionnée avec l'ancienne page Équipe.
 */

/**
 * Le balisage PROPRE À L'ACCUEIL : `SEOHead` pose le `RealEstateAgent` sur
 * toutes les pages, le renvoyer ici en ferait un doublon. `undefined` tant
 * qu'aucune question n'a de réponse écrite : un `FAQPage` aux réponses vides
 * serait un balisage mensonger.
 */
const donneesStructurees = () => {
  if (questionsRepondues.length === 0) return undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questionsRepondues.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.reponse },
    })),
  };
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="JIP — Gérance locative et syndic de copropriété, Paris 8ᵉ"
        description="Jobard Immobilier Paris, agence indépendante depuis 2011 : gérance locative et syndic de copropriété au 27, rue de Lisbonne, Paris 8ᵉ."
        canonicalUrl="https://www.adbjip.fr/"
        structuredData={donneesStructurees()}
      />
      <Header />
      <main id="contenu" tabIndex={-1}>
        <Hero />
        <Metiers />
        <BiensApercu />
        <AvisGoogle />
        <Questions />
        <Conversion />
      </main>
      <Footer />
      <BarreAppel action={{ libelle: 'Écrire', href: '/contact' }} />
    </div>
  );
};

export default Index;
