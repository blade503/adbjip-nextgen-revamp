import { useEffect } from 'react';

import { SEO_CONFIG } from '@/config/seo';

/**
 * Métadonnées de la page, écrites dans le <head> après le montage.
 *
 * DEUX BLOCS DE DONNÉES STRUCTURÉES, ET C'EST LE CŒUR DU FICHIER.
 *
 *  - `data-seo="agence"` : le `RealEstateAgent` — adresse, téléphone, horaires
 *    au format schema.org, zone desservie. Il est posé sur les DIX pages, sans
 *    qu'aucune n'ait à le demander : c'est l'identité de l'agence, elle ne
 *    dépend pas de la route.
 *  - `data-seo="page"` : le balisage propre à la page (`ItemList` des annonces,
 *    `Service` d'une prestation, `FAQPage` quand des réponses existent).
 *    RETIRÉ quand la page n'en fournit pas.
 *
 * La version précédente n'avait qu'un bloc et le sélectionnait par
 * `script[type="application/ld+json"]`, c'est-à-dire LE PREMIER du document.
 * Deux conséquences, toutes deux constatées dans le prérendu :
 *
 *  1. `index.html` portait un `RealEstateAgent` statique, et ce sélecteur
 *     l'écrasait dès le montage de React. Le bloc statique a été supprimé —
 *     il était de toute façon une seconde source de vérité, déjà divergente.
 *  2. Sur les pages qui fournissent leur propre balisage, `/biens` et
 *     `/services/gestion-locative`, l'identité de l'agence disparaissait
 *     purement et simplement du HTML livré. Vérifié dans `dist/`.
 *
 * Les attributs `data-seo` rendent les deux blocs adressables séparément, ce
 * qui règle aussi la fuite inverse : sans retrait explicite, le balisage d'une
 * page restait dans le <head> après navigation vers une page qui n'en a pas.
 *
 * AUCUN `aggregateRating`, ici ou ailleurs. Google interdit à une entreprise de
 * baliser ses propres avis, et ce site en a déjà porté deux, fabriqués. La
 * seule note publiable est celle de la fiche Google, vers laquelle renvoie la
 * section Avis (`src/config/avis.ts`).
 */

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  structuredData?: object;
  ogImage?: string;
  /** Requis dès que `ogImage` n'est pas l'image par défaut : l'alt décrit l'image, pas la page. */
  ogImageAlt?: string;
  ogType?: string;
  twitterCard?: string;
  /** Retire la page de l'index : réservé aux pages sans contenu propre (404). */
  noindex?: boolean;
}

/**
 * L'image de partage. 1200 × 630 vérifié sur le fichier — le format attendu par
 * Facebook, LinkedIn et X. Les dimensions sont déclarées dans les balises :
 * sans elles, les moteurs d'aperçu doivent télécharger l'image avant de savoir
 * comment la cadrer, et affichent parfois une vignette carrée en attendant.
 */
const OG_IMAGE = SEO_CONFIG.site.defaultImage;
const OG_LARGEUR = '1200';
const OG_HAUTEUR = '630';
const OG_ALT = "Façade haussmannienne parisienne, immeuble de rapport avec ses deux lanternes";

const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  structuredData,
  ogImage = OG_IMAGE,
  ogImageAlt = OG_ALT,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    /**
     * Pose une balise `meta`, en la créant au besoin. `parPropriete` distingue
     * `property=` (Open Graph, qui est du RDFa) de `name=` (Twitter et les
     * balises classiques) : les confondre produit des balises qu'aucun des deux
     * ne lit.
     */
    const meta = (cle: string, contenu: string, parPropriete = true) => {
      const selecteur = parPropriete ? `meta[property="${cle}"]` : `meta[name="${cle}"]`;
      let balise = document.querySelector(selecteur) as HTMLMetaElement | null;
      if (!balise) {
        balise = document.createElement('meta');
        balise.setAttribute(parPropriete ? 'property' : 'name', cle);
        document.head.appendChild(balise);
      }
      balise.setAttribute('content', contenu);
    };

    meta('description', description, false);

    /**
     * Les mots-clés d'une page ne doivent pas survivre à la navigation vers une
     * page qui n'en déclare pas : le contenu est écrit, pas vidé, donc sans ce
     * `else` la page d'arrivée héritait des mots-clés de la précédente.
     * (Google ignore `keywords` depuis longtemps ; d'autres moteurs le lisent
     * encore, et une valeur fausse est pire qu'aucune.)
     */
    if (keywords) meta('keywords', keywords, false);
    else document.querySelector('meta[name="keywords"]')?.remove();

    /**
     * L'URL canonique est absolue sur toutes les routes, sauf le 404 qui n'en
     * a pas : une page en `noindex` n'a rien à désigner. La version précédente
     * retombait sur `window.location.href`, et le prérendu figeait donc
     * `http://localhost:8799/__inexistant` dans le HTML livré — relevé le
     * 08/09/2026 dans `dist/404.html`. Sans canonique, on retire la balise (et
     * `og:url`, qui la suit) plutôt que d'en fabriquer une.
     */
    let lien = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (!lien) {
        lien = document.createElement('link');
        lien.rel = 'canonical';
        document.head.appendChild(lien);
      }
      lien.href = canonicalUrl;
    } else {
      lien?.remove();
    }

    /** Écrit — ou retire — un bloc JSON-LD identifié par son `data-seo`. */
    const jsonLd = (role: 'agence' | 'page', donnees: object | undefined) => {
      const selecteur = `script[type="application/ld+json"][data-seo="${role}"]`;
      const existant = document.querySelector(selecteur);
      if (!donnees) {
        existant?.remove();
        return;
      }
      const script = (existant as HTMLScriptElement) || document.createElement('script');
      if (!existant) {
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', role);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(donnees);
    };

    jsonLd('agence', {
      '@context': 'https://schema.org',
      ...SEO_CONFIG.structuredData.organization,
    });
    jsonLd('page', structuredData);

    meta('og:title', title);
    meta('og:description', description);
    meta('og:type', ogType);
    if (canonicalUrl) meta('og:url', canonicalUrl);
    else document.querySelector('meta[property="og:url"]')?.remove();
    meta('og:image', ogImage);
    // Les dimensions ne sont connues que pour l'image par défaut ; pour une
    // photo d'annonce on retire les balises plutôt que d'annoncer un faux format.
    if (ogImage === OG_IMAGE) {
      meta('og:image:width', OG_LARGEUR);
      meta('og:image:height', OG_HAUTEUR);
    } else {
      document.querySelector('meta[property="og:image:width"]')?.remove();
      document.querySelector('meta[property="og:image:height"]')?.remove();
    }
    meta('og:image:alt', ogImageAlt);
    meta('og:site_name', SEO_CONFIG.site.name);
    meta('og:locale', 'fr_FR');

    meta('twitter:card', twitterCard, false);
    meta('twitter:title', title, false);
    meta('twitter:description', description, false);
    meta('twitter:image', ogImage, false);
    meta('twitter:image:alt', ogImageAlt, false);

    meta('robots', noindex ? 'noindex, follow' : 'index, follow', false);
    meta('author', SEO_CONFIG.site.name, false);
  }, [title, description, keywords, canonicalUrl, structuredData, ogImage, ogImageAlt, ogType, twitterCard, noindex]);

  return null;
};

export default SEOHead;
