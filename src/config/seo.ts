export const SEO_CONFIG = {
  site: {
    name: 'ABDJIP',
    url: 'https://abdjip.fr',
    description: 'ABDJIP - Agence immobilière spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France',
    defaultImage: 'https://abdjip.fr/og-image-default.jpg',
    twitterHandle: '@abdjip',
    phone: '+33142257824',
    address: {
      street: '123 Rue de Rivoli',
      city: 'Paris',
      region: 'Île-de-France',
      postalCode: '75001',
      country: 'FR'
    }
  },
  
  pages: {
    home: {
      title: 'ABDJIP - Agence Immobilière Paris & Île-de-France',
      description: 'Agence immobilière ABDJIP spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France. Expertise 15+ ans.',
      keywords: 'agence immobilière Paris, gestion locative, copropriété, estimation biens, immobilier Île-de-France, ABDJIP'
    },
    
    estimation: {
      title: 'Estimation Immobilière Gratuite Paris & Île-de-France | ABDJIP',
      description: 'Estimation gratuite et précise de votre bien immobilier à Paris et en Île-de-France. Calculateur en ligne avec données DVF officielles. Expertise 15+ ans. Réponse sous 24h.',
      keywords: 'estimation immobilière gratuite, évaluation bien immobilier, prix immobilier Paris, estimation appartement, estimation maison, calculateur estimation, données DVF, expertise immobilière Paris, ABDJIP'
    },
    
    gestionLocative: {
      title: 'Gestion Locative Professionnelle Paris & Île-de-France | ABDJIP',
      description: 'Service de gestion locative professionnelle à Paris et en Île-de-France. Gestion complète de vos biens locatifs avec ABDJIP. Expertise 15+ ans.',
      keywords: 'gestion locative Paris, gestion locative Île-de-France, gestion biens locatifs, agence gestion locative, ABDJIP'
    },
    
    gestionCopropriete: {
      title: 'Gestion de Copropriété Paris & Île-de-France | ABDJIP',
      description: 'Service de gestion de copropriété professionnelle à Paris et en Île-de-France. Syndic de copropriété ABDJIP. Expertise 15+ ans.',
      keywords: 'gestion copropriété Paris, syndic copropriété, gestion copropriété Île-de-France, ABDJIP'
    },
    
    achatsVentes: {
      title: 'Achats & Ventes Immobilières Paris & Île-de-France | ABDJIP',
      description: 'Service d\'achat et vente immobilière à Paris et en Île-de-France. Accompagnement personnalisé avec ABDJIP. Expertise 15+ ans.',
      keywords: 'achat immobilier Paris, vente immobilier Paris, achat appartement, vente maison, agence immobilière Paris, ABDJIP'
    },
    
    contact: {
      title: 'Contact ABDJIP - Agence Immobilière Paris & Île-de-France',
      description: 'Contactez ABDJIP pour vos projets immobiliers à Paris et en Île-de-France. Gestion locative, copropriété, estimation. Réponse sous 24h.',
      keywords: 'contact ABDJIP, agence immobilière Paris, devis gratuit, conseil immobilier'
    }
  },
  
  structuredData: {
    organization: {
      "@type": "RealEstateAgent",
      "name": "ABDJIP",
      "url": "https://abdjip.fr",
      "logo": "https://abdjip.fr/logo.png",
      "description": "Agence immobilière spécialisée dans la gestion locative, copropriété et estimation de biens à Paris et en Île-de-France",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Rue de Rivoli",
        "addressLocality": "Paris",
        "addressRegion": "Île-de-France",
        "postalCode": "75001",
        "addressCountry": "FR"
      },
      "telephone": "+33142257824",
      "email": "contact@abdjip.fr",
      "foundingDate": "2008",
      "numberOfEmployees": "15",
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
