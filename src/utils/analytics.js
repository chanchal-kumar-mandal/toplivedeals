// src/analytics.js
import ReactGA from "react-ga4";

// Your Measurement ID
const MEASUREMENT_ID = "G-RCHQ7TRW25";

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (action, category, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
