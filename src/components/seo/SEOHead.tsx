import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Rafiki House Nanyuki';
const BASE_URL = 'https://rafikihousenanyuki.com';
const DEFAULT_DESCRIPTION = 'Luxury safari lodges and holiday homes in Nanyuki, Kenya. Book unique cottage stays at the foot of Mount Kenya with game drives, safaris, and authentic Kenyan hospitality.';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Luxury Safari Stays in Kenya`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta tags
    const metaTags: Record<string, string> = {
      description,
      'og:title': fullTitle,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:image': ogImage,
      'og:type': ogType,
      'og:site_name': SITE_NAME,
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      const isOg = name.startsWith('og:') || name.startsWith('twitter:');
      const attr = isOg ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    });

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // JSON-LD
    if (jsonLd) {
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) existingScript.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) existingScript.remove();
    };
  }, [fullTitle, description, canonicalUrl, ogImage, ogType, jsonLd]);

  return null;
}

// Pre-built JSON-LD schemas
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Rafiki House Nanyuki',
  description: DEFAULT_DESCRIPTION,
  url: BASE_URL,
  telephone: '+254-XXX-XXXXXX',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nanyuki',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 0.0167,
    longitude: 37.0833,
  },
  image: DEFAULT_OG_IMAGE,
  priceRange: '$$',
  starRating: {
    '@type': 'Rating',
    ratingValue: '4.5',
  },
};
