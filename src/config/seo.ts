export const SEO_CONFIG = {
  site: {
    name: 'JIP — Jobard Immobilier Paris',
    url: 'https://www.adbjip.fr',
    description: 'JIP - Agence immobilière spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France',
    defaultImage: 'https://www.adbjip.fr/og-image.jpg',
    twitterHandle: '',
    phone: '+33142257824',
    address: {
      street: '27 rue de Lisbonne',
      city: 'Paris',
      region: 'Île-de-France',
      postalCode: '75008',
      country: 'FR'
    }
  },
  
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
      "logo": "https://www.adbjip.fr/logo.png",
      "description": "Agence immobilière spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "27 rue de Lisbonne",
        "addressLocality": "Paris",
        "addressRegion": "Île-de-France",
        "postalCode": "75008",
        "addressCountry": "FR"
      },
      "telephone": "+33142257824",
      "email": "j.immo.p@orange.fr",
      "foundingDate": "2011",
      "areaServed": {
        "@type": "Place",
        "name": "Île-de-France"
      },
      "serviceType": [
        "Gestion Locative",
        "Gestion de Copropriété", 
        "Estimation Immobilière",
        "Achats et Ventes"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127"
      }
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
