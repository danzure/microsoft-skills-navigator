import { useEffect } from 'react';

const DEFAULT_TITLE = 'Microsoft Skills Navigator & Certification Roadmap | atozazure';
const DEFAULT_DESC = 'Navigate Microsoft certifications and role-based learning pathways with an interactive metro roadmap. Track exam progress, monitor 1-year renewals, explore prerequisites, and access official Microsoft Learn resources across Azure, AI, Security, Power Platform, Microsoft 365, and GitHub.';
const SITE_URL = 'https://skills.atozazure.com';

/**
 * Lightweight native React SEO component that dynamically synchronizes
 * document head metadata, canonical URLs, social cards, and JSON-LD schemas.
 */
export default function SEO({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonical,
  ogType = 'website',
  schema,
}) {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = title 
      ? (title.includes('atozazure') ? title : `${title} | atozazure`) 
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to update or create a meta tag
    const setMetaTag = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to update or create a link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Canonical URL
    const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    // 6. Dynamic Route Structured Data (JSON-LD)
    let schemaScript = document.getElementById('route-structured-data');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'route-structured-data';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, keywords, canonical, ogType, schema]);

  return null;
}
