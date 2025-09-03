import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  structuredData?: object;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  structuredData,
  ogImage = "ar contr",
  ogType = "website",
  twitterCard = "summary_large_image"
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update keywords if provided
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }
    
    // Update canonical URL if provided
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl;
    }
    
    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.textContent = JSON.stringify(structuredData);
      } else {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
    
    // Update Open Graph tags
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

    // Open Graph tags
    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:type', ogType);
    updateOrCreateMeta('og:image', ogImage);
    updateOrCreateMeta('og:url', canonicalUrl || window.location.href);
    updateOrCreateMeta('og:site_name', 'ABDJIP');
    updateOrCreateMeta('og:locale', 'fr_FR');
    
    // Twitter Card tags
    updateOrCreateMeta('twitter:card', twitterCard, false);
    updateOrCreateMeta('twitter:title', title, false);
    updateOrCreateMeta('twitter:description', description, false);
    updateOrCreateMeta('twitter:image', ogImage, false);
    updateOrCreateMeta('twitter:site', '@abdjip', false);
    
    // Additional SEO tags
    updateOrCreateMeta('robots', 'index, follow', false);
    updateOrCreateMeta('author', 'ABDJIP', false);
    updateOrCreateMeta('viewport', 'width=device-width, initial-scale=1.0', false);
  }, [title, description, keywords, canonicalUrl, structuredData, ogImage, ogType, twitterCard]);

  return null;
};

export default SEOHead;