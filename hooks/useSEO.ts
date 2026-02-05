import { useEffect } from 'react';

interface SEOConfig {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

/**
 * Custom hook to dynamically update SEO meta tags for each page.
 * Updates the document title and relevant meta tags when the component mounts.
 */
export const useSEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}: SEOConfig) => {
    useEffect(() => {
        // Update document title
        const fullTitle = title.includes('Kytriq')
            ? title
            : `${title} | Kytriq Technologies`;
        document.title = fullTitle;

        // Helper function to update or create meta tags
        const updateMeta = (name: string, content: string, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

            if (meta) {
                meta.content = content;
            } else {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, name);
                meta.content = content;
                document.head.appendChild(meta);
            }
        };

        // Update title meta tags
        updateMeta('title', fullTitle);
        updateMeta('og:title', fullTitle, true);
        updateMeta('twitter:title', fullTitle);

        // Update description if provided
        if (description) {
            updateMeta('description', description);
            updateMeta('og:description', description, true);
            updateMeta('twitter:description', description);
        }

        // Update keywords if provided
        if (keywords) {
            updateMeta('keywords', keywords);
        }

        // Update image if provided
        if (image) {
            updateMeta('og:image', image, true);
            updateMeta('twitter:image', image);
        }

        // Update URL if provided
        if (url) {
            updateMeta('og:url', url, true);
            updateMeta('twitter:url', url);

            // Update canonical link
            let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (canonical) {
                canonical.href = url;
            }
        }

        // Update type
        updateMeta('og:type', type, true);

    }, [title, description, keywords, image, url, type]);
};

export default useSEO;
