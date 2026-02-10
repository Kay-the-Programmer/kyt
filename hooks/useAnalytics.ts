
import { useCallback } from 'react';
import * as analytics from '../utils/analytics';

/**
 * Custom hook for accessing analytics tracking methods
 */
export const useAnalytics = () => {
    const trackEvent = useCallback((params: analytics.AnalyticsEventParams) => {
        analytics.trackEvent(params);
    }, []);

    const trackScrollMilestone = useCallback((sectionName: string) => {
        analytics.trackScrollMilestone(sectionName);
    }, []);

    const trackInteraction = useCallback((elementName: string, interactionType: string = "click") => {
        analytics.trackInteraction(elementName, interactionType);
    }, []);

    const trackOutboundLink = useCallback((url: string) => {
        analytics.trackOutboundLink(url);
    }, []);

    const trackScrollDepth = useCallback((depth: number) => {
        analytics.trackScrollDepth(depth);
    }, []);

    const trackFormInteraction = useCallback((formName: string, action: string, fieldName?: string) => {
        analytics.trackFormInteraction(formName, action, fieldName);
    }, []);

    return {
        trackEvent,
        trackScrollMilestone,
        trackScrollDepth,
        trackInteraction,
        trackOutboundLink,
        trackFormInteraction
    };
};
