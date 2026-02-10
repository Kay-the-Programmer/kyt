import { Helmet } from 'react-helmet-async';
import React from 'react';

interface SEOConfig {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

/**
 * Custom hook to dynamically update SEO meta tags for each page using react-helmet-async.
 * Returns a Helmet component to be rendered in the page.
 */
export const useSEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}: SEOConfig) => {
    const fullTitle = title.includes('Kytriq')
        ? title
        : `${title} | Kytriq Technologies`;

    // We return a Helmet component instead of using useEffect
    // This allows for better SSR and concurrent mode compatibility
    return {
        HelmetElement: React.createElement(Helmet, {}, [
            React.createElement('title', { key: 'title' }, fullTitle),
            React.createElement('meta', { key: 'meta-title', name: 'title', content: fullTitle }),
            React.createElement('meta', { key: 'og-title', property: 'og:title', content: fullTitle }),
            React.createElement('meta', { key: 'twitter-title', name: 'twitter:title', content: fullTitle }),
            description && React.createElement('meta', { key: 'description', name: 'description', content: description }),
            description && React.createElement('meta', { key: 'og-description', property: 'og:description', content: description }),
            description && React.createElement('meta', { key: 'twitter-description', name: 'twitter:description', content: description }),
            keywords && React.createElement('meta', { key: 'keywords', name: 'keywords', content: keywords }),
            image && React.createElement('meta', { key: 'og-image', property: 'og:image', content: image }),
            image && React.createElement('meta', { key: 'twitter-image', name: 'twitter:image', content: image }),
            url && React.createElement('meta', { key: 'og-url', property: 'og:url', content: url }),
            url && React.createElement('meta', { key: 'twitter-url', name: 'twitter:url', content: url }),
            url && React.createElement('link', { key: 'canonical', rel: 'canonical', href: url }),
            React.createElement('meta', { key: 'og-type', property: 'og:type', content: type }),
        ].filter(Boolean))
    };
};

export default useSEO;
