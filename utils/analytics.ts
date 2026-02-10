
import ReactGA from "react-ga4";

/**
 * Interface for GA4 Event parameters
 */
export interface AnalyticsEventParams {
    category: string;
    action: string;
    label?: string;
    value?: number;
    [key: string]: any;
}

/**
 * Tracks a custom event in Google Analytics
 */
export const trackEvent = (params: AnalyticsEventParams) => {
    try {
        ReactGA.event(params);
        if (import.meta.env.DEV) {
            // Debug logging removed as per request
        }
    } catch (error) {
        console.error("Analytics Error:", error);
    }
};

/**
 * Tracks a scroll milestone (e.g., reaching a specific section)
 */
export const trackScrollMilestone = (sectionName: string) => {
    trackEvent({
        category: "engagement",
        action: "scroll_milestone",
        label: sectionName,
    });
};

/**
 * Tracks a scroll depth milestone (25%, 50%, 75%, 100%)
 */
export const trackScrollDepth = (depth: number) => {
    trackEvent({
        category: "engagement",
        action: "scroll_depth",
        label: `${depth}%`,
        value: depth
    });
};

/**
 * Tracks form-related interactions
 */
export const trackFormInteraction = (formName: string, action: string, fieldName?: string) => {
    trackEvent({
        category: "form",
        action: action,
        label: fieldName ? `${formName} | ${fieldName}` : formName,
    });
};

/**
 * Tracks an interaction with a UI element
 */
export const trackInteraction = (elementName: string, interactionType: string = "click", category: string = "interaction") => {
    trackEvent({
        category: category,
        action: interactionType,
        label: elementName,
    });
};

/**
 * Tracks an outbound link click
 */
export const trackOutboundLink = (url: string) => {
    trackEvent({
        category: "engagement",
        action: "outbound_link_click",
        label: url,
    });
};
