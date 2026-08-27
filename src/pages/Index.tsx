import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Metiers from '@/components/Metiers';
import About from '@/components/About';
import AvisGoogle from '@/components/AvisGoogle';
import BiensApercu from '@/components/BiensApercu';
import Questions from '@/components/Questions';
import Conversion from '@/components/Conversion';
import Footer from '@/components/Footer';
import { questionsRepondues } from '@/config/questions';

/**
 * L'ordre des sections suit une descente : on entre par la rue, on traverse ce
 * que fait l'agence, puis on arrive dans le hall.
 *
 *   1. Ouverture ....... nuit    la plaque, l'adresse, les deux portes
 *   2. Métiers ......... pierre  le registre des quatre métiers
 *   3. Portefeuille .... ivoire  les biens, en couleurs vraies
 *   4. L'agence ........ pierre  qui tient les dossiers
 *   5. Avis ............ nuit  ┐
 *   6. Conversion ...... nuit  ├ le dernier mouvement, sombre et continu
 *   7. Pied de page .... nuit  ┘
 *
 * Deux mouvements longs plutôt qu'une alternance clair / sombre à chaque
 * section : l'alternance hachait la page, et l'ancienne version enchaînait à
 * l'inverse cinq sections claires qui se lisaient comme un seul bloc. Ici la
 * bascule tombe une fois, à l'endroit exact où le discours passe de « voici ce
 * que nous faisons » à « voici comment nous joindre » — la preuve, la demande,
 * l'adresse.
 */
/**
 * Données structurées. Le balisage `FAQPage` ne se pose QUE sur des réponses
 * réellement écrites : baliser des questions sans réponse vaut moins que ne
 * rien baliser, et Google traite une FAQPage vide comme du balisage trompeur.
 * Tant que l'agence n'a rien fourni, on renvoie l'organisation seule, exactement
 * comme avant.
 */
/**
 * Le balisage PROPRE À L'ACCUEIL, et rien d'autre : `SEOHead` pose le
 * `RealEstateAgent` sur les dix pages, le renvoyer ici en ferait un doublon.
 *
 * `undefined` tant qu'aucune question n'a de réponse écrite — et c'est le cas
 * aujourd'hui, les sept réponses de `src/config/questions.ts` valent `null`.
 * Un `FAQPage` dont les `acceptedAnswer` seraient vides ou « à compléter »
 * serait un balisage mensonger : Google le traite comme du contenu réel et peut
 * l'afficher tel quel dans ses résultats.
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
        <About />
        <AvisGoogle />
        <Questions />
        <Conversion />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
