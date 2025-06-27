import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from 'react-ga4';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Send pageview to GA4
    ReactGA.send({ hitType: 'pageview', page: pathname });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
