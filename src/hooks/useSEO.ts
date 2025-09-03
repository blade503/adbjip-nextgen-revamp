import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: any;
}

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update document title
    document.title = config.title;
    
    // Update meta description
    const updateOrCreateMeta = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateOrCreateMeta('description', config.description, false);
    if (config.keywords) {
      updateOrCreateMeta('keywords', config.keywords, false);
    }

    // Canonical URL
    if (config.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = config.canonicalUrl;
    }

    // Open Graph tags
    updateOrCreateMeta('og:title', config.title);
    updateOrCreateMeta('og:description', config.description);
    updateOrCreateMeta('og:type', config.ogType || 'website');
    updateOrCreateMeta('og:image', config.ogImage || 'https://abdjip.fr/og-image-default.jpg');
    updateOrCreateMeta('og:url', config.canonicalUrl || window.location.href);
    updateOrCreateMeta('og:site_name', 'ABDJIP');
    updateOrCreateMeta('og:locale', 'fr_FR');
    
    // Twitter Card tags
    updateOrCreateMeta('twitter:card', config.twitterCard || 'summary_large_image', false);
    updateOrCreateMeta('twitter:title', config.title, false);
    updateOrCreateMeta('twitter:description', config.description, false);
    updateOrCreateMeta('twitter:image', config.ogImage || 'https://abdjip.fr/og-image-default.jpg', false);
    updateOrCreateMeta('twitter:site', '@abdjip', false);
    
    // Additional SEO tags
    updateOrCreateMeta('robots', 'index, follow', false);
    updateOrCreateMeta('author', 'ABDJIP', false);

    // Structured data
    if (config.structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.textContent = JSON.stringify(config.structuredData);
      } else {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(config.structuredData);
        document.head.appendChild(script);
      }
    }
  }, [config]);
};
