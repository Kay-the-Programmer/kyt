
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const AnalyticsTracker = () => {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const trackingId = import.meta.env.VITE_GA_MEASUREMENT_ID;

        if (trackingId) {
            ReactGA.initialize(trackingId);
            setInitialized(true);
            console.log("GA initialized with ID:", trackingId);
        } else {
            console.warn("GA Measurement ID not found in environment variables.");
        }
    }, []);

    useEffect(() => {
        if (initialized) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [initialized, location]);

    return null;
};

export default AnalyticsTracker;
