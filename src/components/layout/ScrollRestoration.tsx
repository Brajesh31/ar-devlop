import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};
