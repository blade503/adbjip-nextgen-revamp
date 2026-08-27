import { ADRESSE, HORAIRES } from './legal';

/**
 * Métadonnées et données structurées.
 *
 * L'adresse, le téléphone, le courriel et les horaires ne sont PAS écrits ici :
 * ils sont dérivés de `src/config/legal.ts`, qui est la source unique. Ils y
 * étaient auparavant recopiés en dur, et les deux copies avaient déjà divergé —
 * « 27 rue de Lisbonne » ici contre « 27, rue de Lisbonne » là. C'est le même
 * mécanisme qui avait fini par faire afficher au site deux versions
 * contradictoires de ses horaires, toutes deux fausses.
 */

/** schema.org attend l'E.164, la charte affiche le format français. */
const telephoneE164 = `+33${ADRESSE.telephone.replace(/\D/g, '').replace(/^0/, '')}`;

/**
 * Traduction de `HORAIRES.schemaOrg` (format fixe « Mo-Fr 09:00-13:00 ») en
 * `OpeningHoursSpecification`. Deux plages distinctes et non une seule :
 * l'agence ferme entre 13h et 14h, et sans cette coupure les données
 * structurées l'annonceraient ouverte à l'heure du déjeuner, en contradiction
 * avec sa fiche Google.
 *
 * Plage inconnue : on lève en développement, on journalise et on ignore en
 * production. Le premier jet levait dans les deux cas, en affirmant « fait
 * échouer le build » — c'est faux, et vérifié : ce module est évalué à
 * l'exécution, donc `vite build` passe, le prérendu écrit une page dont React
 * n'a jamais monté (au-dessus du seuil de 2 000 octets, donc non détectée), et
 * la faute n'apparaît qu'en production sous forme d'écran blanc. Lever en
 * production transformait une faute de frappe dans les horaires en panne totale
 * du site : c'est pire que le mal soigné.
 *
 * Le développement est le bon moment pour crier — c'est là qu'on vient de faire
 * la faute. Reste à ajouter une validation des données structurées au build
 * (étape 11) : c'est le seul endroit qui attraperait réellement le cas.
 */
const JOURS: Record<string, string[]> = {
  'Mo-Fr': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

const openingHoursSpecification = HORAIRES.schemaOrg.map((plage) => {
  const [jours, heures] = plage.split(' ');
  const [opens, closes] = heures.split('-');
  const dayOfWeek = JOURS[jours];
  if (!dayOfWeek) {
    const message =
      `Plage d'horaires non reconnue : « ${plage} ». ` +
      `Ajouter la clé « ${jours} » à JOURS dans src/config/seo.ts.`;
    if (import.meta.env.DEV) throw new Error(message);
    console.error(message);
    return null;
  }
  return { '@type': 'OpeningHoursSpecification', dayOfWeek, opens, closes };
}).filter(Boolean);

export const SEO_CONFIG = {
  site: {
    name: 'JIP — Jobard Immobilier Paris',
    url: 'https://www.adbjip.fr',
    description: 'JIP - Agence immobilière spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France',
    defaultImage: 'https://www.adbjip.fr/og-image.jpg',
    twitterHandle: '',
    phone: telephoneE164,
    address: {
      street: ADRESSE.rue,
      city: ADRESSE.ville,
      region: 'Île-de-France',
      postalCode: ADRESSE.codePostal,
      country: 'FR'
    }
  },
  
  /**
   * GABARIT NON CONSOMMÉ — vérifié le 27/08/2026 : aucune page n'importe
   * `SEO_CONFIG.pages`. Les dix routes déclarent leur titre et leur description
   * directement dans leur `<SEOHead>`, ce qui est plus lisible et permet à
   * `/biens` de composer sa description à partir du nombre réel d'annonces.
   *
   * NE PAS S'EN SERVIR EN L'ÉTAT. Ce bloc ne couvre que 6 des 10 routes, et
   * cinq de ses descriptions portent « Expertise 15+ ans » — un chiffre sans
   * source, relevé à l'étape 07 et toujours en attente d'arbitrage. Le brancher
   * réinjecterait la revendication dans les métadonnées de cinq pages.
   *
   * À supprimer ou à remplir après arbitrage ; conservé en attendant pour
   * garder trace des revendications à trancher.
   */
  pages: {
    home: {
      title: 'JIP - Agence Immobilière Paris & Île-de-France',
      description: 'Agence immobilière JIP spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France. Expertise 15+ ans.',
      keywords: 'agence immobilière Paris, gestion locative, copropriété, estimation biens, immobilier Île-de-France, JIP'
    },
    
    estimation: {
      title: 'Estimation Immobilière Gratuite Paris & Île-de-France | JIP',
      description: 'Estimation gratuite et précise de votre bien immobilier à Paris et en Île-de-France. Calculateur en ligne avec données DVF officielles. Expertise 15+ ans. Réponse sous 24h.',
      keywords: 'estimation immobilière gratuite, évaluation bien immobilier, prix immobilier Paris, estimation appartement, estimation maison, calculateur estimation, données DVF, expertise immobilière Paris, JIP'
    },
    
    gestionLocative: {
      title: 'Gestion Locative Professionnelle Paris & Île-de-France | JIP',
      description: 'Service de gestion locative professionnelle à Paris et en Île-de-France. Gestion complète de vos biens locatifs avec JIP. Expertise 15+ ans.',
      keywords: 'gestion locative Paris, gestion locative Île-de-France, gestion biens locatifs, agence gestion locative, JIP'
    },
    
    gestionCopropriete: {
      title: 'Gestion de Copropriété Paris & Île-de-France | JIP',
      description: 'Service de gestion de copropriété professionnelle à Paris et en Île-de-France. Syndic de copropriété JIP. Expertise 15+ ans.',
      keywords: 'gestion copropriété Paris, syndic copropriété, gestion copropriété Île-de-France, JIP'
    },
    
    achatsVentes: {
      title: 'Achats & Ventes Immobilières Paris & Île-de-France | JIP',
      description: 'Service d\'achat et vente immobilière à Paris et en Île-de-France. Accompagnement personnalisé avec JIP. Expertise 15+ ans.',
      keywords: 'achat immobilier Paris, vente immobilier Paris, achat appartement, vente maison, agence immobilière Paris, JIP'
    },
    
    contact: {
      title: 'Contact JIP - Agence Immobilière Paris & Île-de-France',
      description: 'Contactez JIP pour vos projets immobiliers à Paris et en Île-de-France. Gestion locative, copropriété, estimation. Réponse sous 24h.',
      keywords: 'contact JIP, agence immobilière Paris, devis gratuit, conseil immobilier'
    }
  },
  
  structuredData: {
    organization: {
      "@type": "RealEstateAgent",
      "name": "JIP — Jobard Immobilier Paris",
      "url": "https://www.adbjip.fr",
      "logo": "https://www.adbjip.fr/apple-touch-icon.png",
      "description": "Agence immobilière spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": ADRESSE.rue,
        "addressLocality": ADRESSE.ville,
        "addressRegion": "Île-de-France",
        "postalCode": ADRESSE.codePostal,
        "addressCountry": "FR"
      },
      "telephone": telephoneE164,
      "email": ADRESSE.email,
      "image": 'https://www.adbjip.fr/og-image.jpg',
      /**
       * Coordonnées relevées le 27/08/2026 sur la Base Adresse Nationale
       * (api-adresse.data.gouv.fr, « 27 Rue de Lisbonne 75008 Paris »,
       * score 0,9709). Ce n'est pas une estimation : c'est la même source que
       * celle qu'utilise déjà `MarketDataService` pour le géocodage.
       *
       * Les valeurs précédentes, écrites en dur dans `index.html`, plaçaient
       * l'agence à 558 m de son adresse — mesuré. Personne ne les avait
       * sourcées.
       */
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.877595,
        "longitude": 2.31381
      },
      /* Date de création de J.I.P. — Jobard Immobilier Paris, telle qu'inscrite
         au registre national des entreprises et reportée dans
         `src/config/legal.ts` (`dateCreation: '1er janvier 2011'`). En ISO ici,
         schema.org attendant une date et non une année. */
      "foundingDate": "2011-01-01",
      // Dérivées de HORAIRES.schemaOrg — voir le commentaire en tête de fichier.
      "openingHoursSpecification": openingHoursSpecification,
      /* Zone desservie : les deux échelles que le site revendique réellement.
         La ville d'abord, parce que c'est là que sont les immeubles gérés. */
      "areaServed": [
        { "@type": "City", "name": "Paris" },
        { "@type": "AdministrativeArea", "name": "Île-de-France" }
      ],
      "serviceType": [
        "Gestion Locative",
        "Gestion de Copropriété", 
        "Estimation Immobilière",
        "Achats et Ventes"
      ]
      // Pas d'`aggregateRating` ici : une note agrégée doit venir d'avis réels et
      // vérifiables. Google interdit par ailleurs à une entreprise de baliser
      // elle-même ses propres avis. La note publiable est celle de la fiche
      // Google, vers laquelle renvoie la section Avis (src/config/avis.ts).
    }
  }
};

export const generateStructuredData = (type: string, data: any) => {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
};
