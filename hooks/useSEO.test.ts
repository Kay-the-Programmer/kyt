import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSEO } from './useSEO';

describe('useSEO Hook', () => {
    // Clear head before each test to ensure a clean state
    beforeEach(() => {
        document.head.innerHTML = '';
        document.title = '';
    });

    afterEach(() => {
        document.head.innerHTML = '';
        document.title = '';
    });

    it('should update document title correctly', () => {
        renderHook(() => useSEO({ title: 'Home Page' }));
        expect(document.title).toBe('Home Page | Kytriq Technologies');
    });

    it('should use provided title if it includes "Kytriq"', () => {
        renderHook(() => useSEO({ title: 'Kytriq Solutions' }));
        expect(document.title).toBe('Kytriq Solutions');
    });

    it('should set meta description', () => {
        const description = 'This is a test description';
        renderHook(() => useSEO({ title: 'Test', description }));

        const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
        const twitterDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;

        expect(metaDesc).not.toBeNull();
        expect(metaDesc.content).toBe(description);
        expect(ogDesc).not.toBeNull();
        expect(ogDesc.content).toBe(description);
        expect(twitterDesc).not.toBeNull();
        expect(twitterDesc.content).toBe(description);
    });

    it('should set meta keywords', () => {
        const keywords = 'test, seo, react';
        renderHook(() => useSEO({ title: 'Test', keywords }));

        const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
        expect(metaKeywords).not.toBeNull();
        expect(metaKeywords.content).toBe(keywords);
    });

    it('should set meta image', () => {
        const image = 'https://example.com/image.jpg';
        renderHook(() => useSEO({ title: 'Test', image }));

        const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
        const twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;

        expect(ogImage).not.toBeNull();
        expect(ogImage.content).toBe(image);
        expect(twitterImage).not.toBeNull();
        expect(twitterImage.content).toBe(image);
    });

    it('should set meta url and update canonical link if exists', () => {
        const url = 'https://example.com/page';

        // Setup existing canonical link to test update
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = 'https://example.com/old';
        document.head.appendChild(link);

        renderHook(() => useSEO({ title: 'Test', url }));

        const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
        const twitterUrl = document.querySelector('meta[name="twitter:url"]') as HTMLMetaElement;
        const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

        expect(ogUrl).not.toBeNull();
        expect(ogUrl.content).toBe(url);
        expect(twitterUrl).not.toBeNull();
        expect(twitterUrl.content).toBe(url);

        expect(canonical).not.toBeNull();
        expect(canonical.href).toBe(url);
    });

    it('should set default type to website', () => {
        renderHook(() => useSEO({ title: 'Test' }));

        const ogType = document.querySelector('meta[property="og:type"]') as HTMLMetaElement;
        expect(ogType).not.toBeNull();
        expect(ogType.content).toBe('website');
    });

    it('should set custom type', () => {
        renderHook(() => useSEO({ title: 'Test', type: 'article' }));

        const ogType = document.querySelector('meta[property="og:type"]') as HTMLMetaElement;
        expect(ogType).not.toBeNull();
        expect(ogType.content).toBe('article');
    });

    it('should update existing meta tags', () => {
        // First render
        const { rerender } = renderHook((props) => useSEO(props), {
            initialProps: { title: 'Initial', description: 'Initial Desc' }
        });

        expect(document.title).toBe('Initial | Kytriq Technologies');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Initial Desc');

        // Rerender with new props
        rerender({ title: 'Updated', description: 'Updated Desc' });

        expect(document.title).toBe('Updated | Kytriq Technologies');
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Updated Desc');

        // Ensure no duplicate tags were created
        expect(document.querySelectorAll('meta[name="description"]').length).toBe(1);
    });
});
