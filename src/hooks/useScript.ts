
import { useState, useEffect } from 'react';

/**
 * A hook to dynamically load an external script and track its status.
 * @param src The source URL of the script to load.
 * @returns An object with the loading and error status of the script.
 */
export const useScript = (src: string): { loading: boolean; error: boolean } => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    // Check if the SDK is already available on the window object, which is the
    // most reliable check for readiness.
    const isKlashaLoaded = src.includes('klasha') && !!window.KlashaClient;
    const isPaystackLoaded = src.includes('paystack') && !!window.PaystackPop;

    if (isKlashaLoaded || isPaystackLoaded) {
      setLoading(false);
      return;
    }

    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

    const handleLoad = () => setLoading(false);
    const handleError = () => {
      setError(true);
      setLoading(false);
    };

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [src]);

  return { loading, error };
};
