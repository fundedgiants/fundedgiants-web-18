
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
    console.log(`useScript effect started for: ${src}`);
    if (!src) {
      console.log(`useScript: No src provided, exiting.`);
      setLoading(false);
      return;
    }

    // Check if the SDK is already available on the window object, which is the
    // most reliable check for readiness.
    const isKlashaLoaded = src.includes('klasha') && !!window.KlashaClient;
    const isPaystackLoaded = src.includes('paystack') && !!window.PaystackPop;

    if (isKlashaLoaded || isPaystackLoaded) {
      console.log(`useScript: SDK already loaded for ${src}.`);
      setLoading(false);
      return;
    }

    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (script) {
        console.log(`useScript: Found existing script tag for ${src}.`);
    }

    // If a script tag with the same src exists, but the SDK is not on the window,
    // it might be a broken script from a previous attempt. Remove it.
    if (script && ((src.includes('klasha') && !isKlashaLoaded) || (src.includes('paystack') && !isPaystackLoaded))) {
      console.log(`useScript: Existing script for ${src} seems broken, removing it.`);
      script.remove();
      script = null;
    }

    const handleLoad = () => {
      console.log(`useScript: Script loaded successfully: ${src}`);
      setLoading(false);
    };
    const handleError = (event: Event | string) => {
      console.error('useScript: Script loading failed:', { src, event });
      setError(true);
      setLoading(false);
    };

    if (!script) {
      console.log(`useScript: Creating new script tag for ${src}.`);
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }

    console.log(`useScript: Adding event listeners for ${src}.`);
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    return () => {
      console.log(`useScript: Cleaning up effect for ${src}.`);
      if (script) {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      }
    };
  }, [src]);

  return { loading, error };
};
