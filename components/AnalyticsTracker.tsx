
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { trackInteraction } from "../utils/analytics";
import { useScrollDepth } from "../hooks/useScrollDepth";

const AnalyticsTracker = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    // Initialize reusable scroll depth tracking
    useScrollDepth();

    useEffect(() => {
        const trackingId = import.meta.env.VITE_GA_MEASUREMENT_ID;

        if (trackingId) {
            ReactGA.initialize(trackingId);
            setInitialized(true);
            if (import.meta.env.DEV) {
                console.log("✅ GA initialized with ID:", trackingId);
            }
        } else {
            console.warn("GA Measurement ID not found in environment variables.");
        }
    }, []);

    useEffect(() => {
        if (initialized) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [initialized, location]);


    // Global Click Listener for meaningful interactions
    useEffect(() => {
        if (!initialized) return;

        const handleGlobalClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const interactiveEl = target.closest('[data-analytics], [data-analytics-id], a, button, input[type="submit"]');

            if (interactiveEl instanceof HTMLElement) {
                const analyticsName =
                    interactiveEl.getAttribute('data-analytics') ||
                    interactiveEl.getAttribute('data-analytics-id') ||
                    interactiveEl.getAttribute('aria-label') ||
                    interactiveEl.innerText?.trim().slice(0, 30) ||
                    interactiveEl.getAttribute('placeholder')?.slice(0, 30) ||
                    'unnamed_interaction';

                const category = interactiveEl.getAttribute('data-analytics-category') ||
                    (interactiveEl.tagName === 'A' ? 'link' : 'ui_interaction');

                // Don't track if explicitly opted out
                if (interactiveEl.getAttribute('data-analytics-ignore')) return;

                const eventName = analyticsName.trim().toLowerCase().replace(/\s+/g, '_');
                trackInteraction(eventName, 'click', category);
            }
        };

        window.addEventListener('click', handleGlobalClick, { passive: true });
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [initialized]);

    return null;
};

export default AnalyticsTracker;
